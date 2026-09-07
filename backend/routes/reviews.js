const express = require('express');
const router = express.Router();
const { Review, Product, Order, getIsConnected } = require('../config/mongodb');
const { auth } = require('../middleware/auth');
const { initialData } = require('../config/db');
const { loadPersistentOrders } = require('../config/persistentOrders');

// In-memory reviews array fallback
if (!initialData.reviews) {
    initialData.reviews = [
        {
            id: 1,
            product_id: 10,
            user_id: 1,
            customer_name: 'Karthik Kumar',
            rating: 5,
            comment: 'Excellent quality shirt! Perfect fit and fabric is super comfortable.',
            created_at: new Date('2026-08-15')
        },
        {
            id: 2,
            product_id: 10,
            user_id: 2,
            customer_name: 'Senthil Nathan',
            rating: 5,
            comment: 'Very good fabric quality. Color looks premium and delivery was very fast.',
            created_at: new Date('2026-08-20')
        },
        {
            id: 3,
            product_id: 3,
            user_id: 1,
            customer_name: 'Anand V',
            rating: 4,
            comment: 'Nice T-Shirt for daily wear. Soft cotton material.',
            created_at: new Date('2026-08-25')
        }
    ];
}

// GET reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        let reviews = [];

        if (getIsConnected()) {
            try {
                reviews = await Review.find({ product_id: productId }).sort({ created_at: -1 }).lean();
            } catch (err) {}
        }

        // Fallback to in-memory reviews if disconnected or empty
        if ((!reviews || reviews.length === 0) && initialData.reviews) {
            reviews = initialData.reviews.filter(r => Number(r.product_id) === productId);
        }

        // Calculate average rating
        let avgRating = 4.5;
        if (reviews && reviews.length > 0) {
            const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
            avgRating = Number((sum / reviews.length).toFixed(1));
        }

        res.json({
            product_id: productId,
            total_reviews: reviews.length,
            average_rating: avgRating,
            reviews: reviews || []
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error fetching product reviews' });
    }
});

// GET all reviews for Store Owner Portal
router.get('/all', async (req, res) => {
    try {
        let reviews = [];
        if (getIsConnected()) {
            try {
                reviews = await Review.find({}).sort({ created_at: -1 }).lean();
            } catch (err) {}
        }
        if ((!reviews || reviews.length === 0) && initialData.reviews) {
            reviews = initialData.reviews;
        }
        res.json(reviews || []);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching all reviews' });
    }
});

// POST a new product review (Customer Portal - Only Purchased Customers - No Duplicates)
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, rating, comment } = req.body;
        const productId = Number(product_id);
        const numericRating = Number(rating);

        if (!productId || isNaN(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5 stars' });
        }
        if (!comment || !comment.trim()) {
            return res.status(400).json({ message: 'Please write a review comment' });
        }

        const customerName = req.user?.name || req.user?.username || 'Verified Customer';
        const userId = Number(req.user?.id || 0);
        const userEmail = (req.user?.email || '').toLowerCase();
        const userPhone = (req.user?.phone || '').trim();

        // 1. PURCHASE VERIFICATION: Verify customer has purchased this product
        let userOrders = [];
        if (getIsConnected()) {
            try {
                const query = {
                    $or: [
                        { user_id: userId },
                        { customer_email: userEmail },
                        { customer_phone: userPhone },
                        { phone: userPhone }
                    ]
                };
                userOrders = await Order.find(query).lean();
            } catch (oErr) {}
        }

        if (!userOrders || userOrders.length === 0) {
            const diskOrders = loadPersistentOrders();
            userOrders = diskOrders.filter(o =>
                Number(o.user_id) === userId ||
                (userEmail && (o.customer_email || '').toLowerCase() === userEmail) ||
                (userPhone && (o.customer_phone || o.phone || '').trim() === userPhone)
            );
        }

        const hasPurchased = userOrders.some(order =>
            Array.isArray(order.items) && order.items.some(item => Number(item.product_id) === productId)
        );

        if (!hasPurchased) {
            return res.status(403).json({
                message: 'Only customers who have successfully purchased this product can submit a review.'
            });
        }

        // 2. DUPLICATE REVIEW PREVENTION: Check if customer has already submitted a review for this product
        let existingReview = null;
        if (getIsConnected()) {
            try {
                existingReview = await Review.findOne({
                    product_id: productId,
                    $or: [
                        { user_id: userId },
                        { customer_name: customerName }
                    ]
                }).lean();
            } catch (rErr) {}
        }

        if (!existingReview && initialData.reviews) {
            existingReview = initialData.reviews.find(r =>
                Number(r.product_id) === productId &&
                (Number(r.user_id) === userId || r.customer_name === customerName)
            );
        }

        if (existingReview) {
            return res.status(400).json({
                message: 'You have already submitted a review for this product. Multiple reviews for the same product are not allowed.'
            });
        }

        const reviewId = Date.now();
        const newReview = {
            id: reviewId,
            product_id: productId,
            user_id: userId,
            customer_name: customerName,
            rating: numericRating,
            comment: comment.trim(),
            created_at: new Date()
        };

        // Save to MongoDB Atlas if connected
        if (getIsConnected()) {
            try {
                await Review.create(newReview);
            } catch (e) {
                console.error('MongoDB review save error:', e.message);
            }
        }

        // Save to in-memory fallback array
        if (!initialData.reviews) initialData.reviews = [];
        initialData.reviews.unshift(newReview);

        // Recalculate average rating & update Product record in MongoDB
        try {
            let allProdReviews = initialData.reviews.filter(r => Number(r.product_id) === productId);
            if (getIsConnected()) {
                const dbRevs = await Review.find({ product_id: productId }).lean();
                if (dbRevs && dbRevs.length > 0) allProdReviews = dbRevs;
            }
            const avgRating = Number((allProdReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allProdReviews.length).toFixed(1));

            if (getIsConnected()) {
                await Product.updateOne({ id: productId }, { $set: { rating: avgRating } });
            }
            const pObj = (initialData.products || []).find(p => Number(p.id) === productId);
            if (pObj) pObj.rating = avgRating;
        } catch (updateErr) {}

        res.status(201).json({
            message: 'Thank you! Your customer review has been published successfully.',
            review: newReview
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Server error submitting customer review' });
    }
});

module.exports = router;
