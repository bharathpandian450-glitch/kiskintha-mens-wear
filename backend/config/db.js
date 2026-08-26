const bcrypt = require('bcryptjs');


// Precomputed password hashes
const passCustomer = '$2a$10$xPLP0KJ8qXKLp6N5kJJ8CeGx6kFOkXmRVRHNF7pPT8WQFxMOEBrHK'; // customer123 / admin123
const passOwner = '$2a$10$xPLP0KJ8qXKLp6N5kJJ8CeGx6kFOkXmRVRHNF7pPT8WQFxMOEBrHK';

// In-Memory Database Store (T-Shirts collection items deleted clean as requested)
const memoryStore = {
    users: [
        { id: 3, name: 'Kiskintha (Store Owner)', email: 'owner@kiskinthamenswear.com', password: passOwner, phone: '9876543200', address: 'Kiskintha Mens Wear Main Branch, Chennai', role: 'owner', created_at: new Date() }
    ],
                        categories: [
        { id: 1, name: 'T-Shirts' },
        { id: 2, name: 'Shirts' },
        { id: 3, name: 'Pants' },
        { id: 4, name: 'Trousers' },
        { id: 7, name: 'Hoodie' },
        { id: 8, name: 'Group Shirts' }
    ],
    products: [
        // ==========================================
        // 🖼️ 100% STRICT SUBFOLDER PRODUCT MAPPING (NO TROUSERS CATEGORY!)
        // ==========================================
        { id: 1, name: "Kiskintha 3 Color T Shirt", description: "Kiskintha 3 Color T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "T-Shirts/3 color t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "3", rating: 4.3, stock: 25, created_at: new Date() },
        { id: 2, name: "Kiskintha Beach T Shirt", description: "Kiskintha Beach T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "T-Shirts/beach t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Beach", rating: 4.4, stock: 28, created_at: new Date() },
        { id: 3, name: "Kiskintha Black T Shirt", description: "Kiskintha Black T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "T-Shirts/black t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Black", rating: 4.5, stock: 31, created_at: new Date() },
        { id: 4, name: "Kiskintha Brookyn White T Shirty", description: "Kiskintha Brookyn White T Shirty from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "T-Shirts/brookyn white t shirty.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Brookyn", rating: 4.6, stock: 34, created_at: new Date() },
        { id: 5, name: "Kiskintha Brown T Shirt", description: "Kiskintha Brown T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "T-Shirts/brown t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.7, stock: 37, created_at: new Date() },
        { id: 6, name: "Kiskintha Color Minimalist Shirt", description: "Kiskintha Color Minimalist Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "T-Shirts/color minimalist shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Color", rating: 4.8, stock: 40, created_at: new Date() },
        { id: 7, name: "Kiskintha Contrast Round T Shirt", description: "Kiskintha Contrast Round T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "T-Shirts/contrast round t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Contrast", rating: 4.9, stock: 43, created_at: new Date() },
        { id: 8, name: "Kiskintha Los Angel  Double T Shirt", description: "Kiskintha Los Angel  Double T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "T-Shirts/los angel  double t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Los", rating: 4.3, stock: 46, created_at: new Date() },
        { id: 9, name: "Kiskintha Los Angel T Shirt", description: "Kiskintha Los Angel T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "T-Shirts/los angel t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Los", rating: 4.4, stock: 49, created_at: new Date() },
        { id: 10, name: "Kiskintha Miles Color Pattern T Shirt", description: "Kiskintha Miles Color Pattern T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "T-Shirts/miles color pattern t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Miles", rating: 4.5, stock: 52, created_at: new Date() },
        { id: 11, name: "Kiskintha Plain White T Short", description: "Kiskintha Plain White T Short from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "T-Shirts/plain white t short.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Plain", rating: 4.6, stock: 55, created_at: new Date() },
        { id: 12, name: "Kiskintha Polo T Shirt", description: "Kiskintha Polo T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "T-Shirts/polo t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Polo T-Shirts", size: "S,M,L,XL,XXL", color: "Polo", rating: 4.7, stock: 58, created_at: new Date() },
        { id: 13, name: "Kiskintha Pttoed Plant T Shirt", description: "Kiskintha Pttoed Plant T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "T-Shirts/pttoed plant t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Pttoed", rating: 4.8, stock: 61, created_at: new Date() },
        { id: 14, name: "Kiskintha Shirt Selve T Shirt", description: "Kiskintha Shirt Selve T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "T-Shirts/shirt selve t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Shirt", rating: 4.9, stock: 64, created_at: new Date() },
        { id: 15, name: "Kiskintha Smile T Shirt", description: "Kiskintha Smile T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "T-Shirts/smile t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Smile", rating: 4.3, stock: 27, created_at: new Date() },
        { id: 16, name: "Kiskintha Summer T Shirt 2", description: "Kiskintha Summer T Shirt 2 from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "T-Shirts/summer t shirt 2.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Summer", rating: 4.4, stock: 30, created_at: new Date() },
        { id: 17, name: "Kiskintha Summer T Shrt", description: "Kiskintha Summer T Shrt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "T-Shirts/summer t shrt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Summer", rating: 4.5, stock: 33, created_at: new Date() },
        { id: 18, name: "Kiskintha T Shirt Classic", description: "Kiskintha T Shirt Classic from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "T-Shirts/t shirt classic.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "T", rating: 4.6, stock: 36, created_at: new Date() },
        { id: 19, name: "Kiskintha T Shirt", description: "Kiskintha T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "T-Shirts/t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "T", rating: 4.7, stock: 39, created_at: new Date() },
        { id: 20, name: "Kiskintha White T Shirt", description: "Kiskintha White T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "T-Shirts/white t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "White", rating: 4.8, stock: 42, created_at: new Date() },
        { id: 21, name: "Kiskintha Yellow T Shirt", description: "Kiskintha Yellow T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "T-Shirts/yellow t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", size: "S,M,L,XL,XXL", color: "Yellow", rating: 4.9, stock: 45, created_at: new Date() },
        { id: 22, name: "Kiskintha Best Pastel Shirt", description: "Kiskintha Best Pastel Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Shirts/best pastel shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Best", rating: 4.3, stock: 48, created_at: new Date() },
        { id: 23, name: "Kiskintha Brown Shirt", description: "Kiskintha Brown Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Shirts/brown shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.4, stock: 51, created_at: new Date() },
        { id: 24, name: "Kiskintha Causal Light Shade Shirt", description: "Kiskintha Causal Light Shade Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Shirts/causal light shade shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Causal", rating: 4.5, stock: 54, created_at: new Date() },
        { id: 25, name: "Kiskintha Causal Shirt", description: "Kiskintha Causal Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Shirts/causal shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Causal", rating: 4.6, stock: 57, created_at: new Date() },
        { id: 26, name: "Kiskintha Checcked Every Day Shirt", description: "Kiskintha Checcked Every Day Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Shirts/checcked every day shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Checcked", rating: 4.7, stock: 60, created_at: new Date() },
        { id: 27, name: "Kiskintha Checked Double Shirt", description: "Kiskintha Checked Double Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Shirts/checked double shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Checked", rating: 4.8, stock: 63, created_at: new Date() },
        { id: 28, name: "Kiskintha Checked Royal Blue Shirt", description: "Kiskintha Checked Royal Blue Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Shirts/checked royal blue shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Checked", rating: 4.9, stock: 26, created_at: new Date() },
        { id: 29, name: "Kiskintha Checked Shirt Black", description: "Kiskintha Checked Shirt Black from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Shirts/checked shirt black.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Checked", rating: 4.3, stock: 29, created_at: new Date() },
        { id: 30, name: "Kiskintha COTTON SHIRTS", description: "Kiskintha COTTON SHIRTS from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/COTTON SHIRTS.jpg", category_id: 2, category_name: "Shirts", subcategory: "Cotton Shirts", size: "S,M,L,XL,XXL", color: "COTTON", rating: 4.4, stock: 32, created_at: new Date() },
        { id: 31, name: "Kiskintha Cracked Shirt Red", description: "Kiskintha Cracked Shirt Red from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Shirts/cracked shirt red.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Cracked", rating: 4.5, stock: 35, created_at: new Date() },
        { id: 32, name: "Kiskintha Denin Shirt", description: "Kiskintha Denin Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Shirts/denin shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Denin", rating: 4.6, stock: 38, created_at: new Date() },
        { id: 33, name: "Kiskintha Double Color Shirt", description: "Kiskintha Double Color Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Shirts/double color shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Double", rating: 4.7, stock: 41, created_at: new Date() },
        { id: 34, name: "Kiskintha Double Colr Blue Shirt", description: "Kiskintha Double Colr Blue Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Shirts/double colr blue shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Double", rating: 4.8, stock: 44, created_at: new Date() },
        { id: 35, name: "Kiskintha Front Tripped Shirt", description: "Kiskintha Front Tripped Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Shirts/front tripped shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Front", rating: 4.9, stock: 47, created_at: new Date() },
        { id: 36, name: "Kiskintha GREEN COTTON SHIRT", description: "Kiskintha GREEN COTTON SHIRT from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Shirts/GREEN COTTON SHIRT.jpg", category_id: 2, category_name: "Shirts", subcategory: "Cotton Shirts", size: "S,M,L,XL,XXL", color: "GREEN", rating: 4.3, stock: 50, created_at: new Date() },
        { id: 37, name: "Kiskintha Green Pastel Color Shirt", description: "Kiskintha Green Pastel Color Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Shirts/green pastel color shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Green", rating: 4.4, stock: 53, created_at: new Date() },
        { id: 38, name: "Kiskintha Korean Loose Casual Shirt", description: "Kiskintha Korean Loose Casual Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Shirts/korean loose casual shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Korean", rating: 4.5, stock: 56, created_at: new Date() },
        { id: 39, name: "Kiskintha Light Shade Shirt Blue", description: "Kiskintha Light Shade Shirt Blue from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Shirts/light shade shirt blue.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Light", rating: 4.6, stock: 59, created_at: new Date() },
        { id: 40, name: "Kiskintha Light Shade Shirt", description: "Kiskintha Light Shade Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Shirts/light shade shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Light", rating: 4.7, stock: 62, created_at: new Date() },
        { id: 41, name: "Kiskintha Linen 1", description: "Kiskintha Linen 1 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Shirts/linen 1.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", size: "S,M,L,XL,XXL", color: "Linen", rating: 4.8, stock: 25, created_at: new Date() },
        { id: 42, name: "Kiskintha Linen 2", description: "Kiskintha Linen 2 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/linen 2.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", size: "S,M,L,XL,XXL", color: "Linen", rating: 4.9, stock: 28, created_at: new Date() },
        { id: 43, name: "Kiskintha Linen 3", description: "Kiskintha Linen 3 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Shirts/linen 3.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", size: "S,M,L,XL,XXL", color: "Linen", rating: 4.3, stock: 31, created_at: new Date() },
        { id: 44, name: "Kiskintha Linen 4", description: "Kiskintha Linen 4 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Shirts/linen 4.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", size: "S,M,L,XL,XXL", color: "Linen", rating: 4.4, stock: 34, created_at: new Date() },
        { id: 45, name: "Kiskintha Linen 5", description: "Kiskintha Linen 5 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Shirts/linen 5.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", size: "S,M,L,XL,XXL", color: "Linen", rating: 4.5, stock: 37, created_at: new Date() },
        { id: 46, name: "Kiskintha Maroon Shirt", description: "Kiskintha Maroon Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Shirts/maroon shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Maroon", rating: 4.6, stock: 40, created_at: new Date() },
        { id: 47, name: "Kiskintha Marron Shirt Double Color", description: "Kiskintha Marron Shirt Double Color from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Shirts/marron shirt double color.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Marron", rating: 4.7, stock: 43, created_at: new Date() },
        { id: 48, name: "Kiskintha Moroon Strong", description: "Kiskintha Moroon Strong from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Shirts/moroon strong.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Moroon", rating: 4.8, stock: 46, created_at: new Date() },
        { id: 49, name: "Kiskintha Multi Color Shirt", description: "Kiskintha Multi Color Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Shirts/multi color shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Multi", rating: 4.9, stock: 49, created_at: new Date() },
        { id: 50, name: "Kiskintha Normal Floural Shirt", description: "Kiskintha Normal Floural Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Shirts/normal floural shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Normal", rating: 4.3, stock: 52, created_at: new Date() },
        { id: 51, name: "Kiskintha Olive Blue Shirt", description: "Kiskintha Olive Blue Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Shirts/olive blue shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Olive", rating: 4.4, stock: 55, created_at: new Date() },
        { id: 52, name: "Kiskintha Pink Casual Shirt", description: "Kiskintha Pink Casual Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Shirts/pink casual shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.5, stock: 58, created_at: new Date() },
        { id: 53, name: "Kiskintha Red And Blue Shirt", description: "Kiskintha Red And Blue Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Shirts/red and blue shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Red", rating: 4.6, stock: 61, created_at: new Date() },
        { id: 54, name: "Kiskintha Red Straight Shirt", description: "Kiskintha Red Straight Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/red straight shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Red", rating: 4.7, stock: 64, created_at: new Date() },
        { id: 55, name: "Kiskintha Regualer Shirt", description: "Kiskintha Regualer Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Shirts/regualer shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Regualer", rating: 4.8, stock: 27, created_at: new Date() },
        { id: 56, name: "Kiskintha Regular Fit Shirt", description: "Kiskintha Regular Fit Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Shirts/regular fit shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Regular", rating: 4.9, stock: 30, created_at: new Date() },
        { id: 57, name: "Kiskintha Royal Bluse Shirt", description: "Kiskintha Royal Bluse Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Shirts/royal bluse shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Royal", rating: 4.3, stock: 33, created_at: new Date() },
        { id: 58, name: "Kiskintha Shirt Half Box", description: "Kiskintha Shirt Half Box from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Shirts/shirt half box.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Shirt", rating: 4.4, stock: 36, created_at: new Date() },
        { id: 59, name: "Kiskintha Shirt Half Whitte Black", description: "Kiskintha Shirt Half Whitte Black from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Shirts/shirt half whitte black.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Shirt", rating: 4.5, stock: 39, created_at: new Date() },
        { id: 60, name: "Kiskintha Shirt Line", description: "Kiskintha Shirt Line from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Shirts/shirt line.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Shirt", rating: 4.6, stock: 42, created_at: new Date() },
        { id: 61, name: "Kiskintha Stright Line Shirt", description: "Kiskintha Stright Line Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Shirts/stright line shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Stright", rating: 4.7, stock: 45, created_at: new Date() },
        { id: 62, name: "Kiskintha Stright Mild Shade Shirt", description: "Kiskintha Stright Mild Shade Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Shirts/stright mild shade shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Stright", rating: 4.8, stock: 48, created_at: new Date() },
        { id: 63, name: "Kiskintha Strong Shirt Pink", description: "Kiskintha Strong Shirt Pink from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Shirts/strong shirt pink.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Strong", rating: 4.9, stock: 51, created_at: new Date() },
        { id: 64, name: "Kiskintha Strriaght Shirt", description: "Kiskintha Strriaght Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Shirts/strriaght shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Strriaght", rating: 4.3, stock: 54, created_at: new Date() },
        { id: 65, name: "Kiskintha Trending Shirt", description: "Kiskintha Trending Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Shirts/trending shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", size: "S,M,L,XL,XXL", color: "Trending", rating: 4.4, stock: 57, created_at: new Date() },
        { id: 66, name: "Kiskintha Yellow Checked Shirt", description: "Kiskintha Yellow Checked Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/yellow checked shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", size: "S,M,L,XL,XXL", color: "Yellow", rating: 4.5, stock: 60, created_at: new Date() },
        { id: 67, name: "Kiskintha 8 Packet Jeans Pant", description: "Kiskintha 8 Packet Jeans Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Pants/8 packet jeans pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "8", rating: 4.6, stock: 63, created_at: new Date() },
        { id: 68, name: "Kiskintha Baggy Jeans Wide Leg", description: "Kiskintha Baggy Jeans Wide Leg from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Pants/Baggy jeans wide leg.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "Baggy", rating: 4.7, stock: 26, created_at: new Date() },
        { id: 69, name: "Kiskintha Cargo Pant", description: "Kiskintha Cargo Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Pants/cargo pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Cargo Pants", size: "S,M,L,XL,XXL", color: "Cargo", rating: 4.8, stock: 29, created_at: new Date() },
        { id: 70, name: "Kiskintha Dark Design Pants", description: "Kiskintha Dark Design Pants from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Pants/dark design pants.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "Dark", rating: 4.9, stock: 32, created_at: new Date() },
        { id: 71, name: "Kiskintha Denin Jeans Fit Pant", description: "Kiskintha Denin Jeans Fit Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Pants/denin jeans fit pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "Denin", rating: 4.3, stock: 35, created_at: new Date() },
        { id: 72, name: "Kiskintha Hiphop Denin Pant", description: "Kiskintha Hiphop Denin Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Pants/hiphop denin pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "Hiphop", rating: 4.4, stock: 38, created_at: new Date() },
        { id: 73, name: "Kiskintha JEAN BLACK 2", description: "Kiskintha JEAN BLACK 2 from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Pants/JEAN BLACK 2.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "JEAN", rating: 4.5, stock: 41, created_at: new Date() },
        { id: 74, name: "Kiskintha JEAN PANT", description: "Kiskintha JEAN PANT from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Pants/JEAN PANT.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "JEAN", rating: 4.6, stock: 44, created_at: new Date() },
        { id: 75, name: "Kiskintha Jeans Black", description: "Kiskintha Jeans Black from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Pants/jeans black.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "Jeans", rating: 4.7, stock: 47, created_at: new Date() },
        { id: 76, name: "Kiskintha Losse Fit Pant Jean", description: "Kiskintha Losse Fit Pant Jean from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Pants/losse fit pant jean.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "Losse", rating: 4.8, stock: 50, created_at: new Date() },
        { id: 77, name: "Kiskintha Shaight Cut Jean", description: "Kiskintha Shaight Cut Jean from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Pants/shaight cut jean.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", size: "S,M,L,XL,XXL", color: "Shaight", rating: 4.9, stock: 53, created_at: new Date() },
        { id: 78, name: "Kiskintha  473Wx593H 700593828 Grey MODEL", description: "Kiskintha  473Wx593H 700593828 Grey MODEL from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Pants/-473Wx593H-700593828-grey-MODEL.avif", category_id: 3, category_name: "Pants", subcategory: "Formal Trousers", size: "S,M,L,XL,XXL", color: "Assorted", rating: 4.3, stock: 56, created_at: new Date() },
        { id: 79, name: "Kiskintha COTTON PANT 2", description: "Kiskintha COTTON PANT 2 from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Pants/COTTON PANT 2.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", size: "S,M,L,XL,XXL", color: "COTTON", rating: 4.4, stock: 59, created_at: new Date() },
        { id: 80, name: "Kiskintha COTTON PANT 3", description: "Kiskintha COTTON PANT 3 from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Pants/COTTON PANT 3.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", size: "S,M,L,XL,XXL", color: "COTTON", rating: 4.5, stock: 62, created_at: new Date() },
        { id: 81, name: "Kiskintha Cotton Pant Sandal", description: "Kiskintha Cotton Pant Sandal from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Pants/cotton pant sandal.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", size: "S,M,L,XL,XXL", color: "Cotton", rating: 4.6, stock: 25, created_at: new Date() },
        { id: 82, name: "Kiskintha COTTON PANT", description: "Kiskintha COTTON PANT from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Pants/COTTON PANT.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", size: "S,M,L,XL,XXL", color: "COTTON", rating: 4.7, stock: 28, created_at: new Date() },
        { id: 83, name: "Kiskintha Front Packet Leg Pant", description: "Kiskintha Front Packet Leg Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Pants/front packet leg pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", size: "S,M,L,XL,XXL", color: "Front", rating: 4.8, stock: 31, created_at: new Date() },
        { id: 84, name: "Kiskintha Gurka Pant", description: "Kiskintha Gurka Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Pants/gurka pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Gurkha Trousers", size: "S,M,L,XL,XXL", color: "Gurka", rating: 4.9, stock: 34, created_at: new Date() },
        { id: 85, name: "Kiskintha High Waist Straight Leg Suit", description: "Kiskintha High Waist Straight Leg Suit from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Pants/high waist straight leg suit.jpg", category_id: 3, category_name: "Pants", subcategory: "Suit Trousers", size: "S,M,L,XL,XXL", color: "High", rating: 4.3, stock: 37, created_at: new Date() },
        { id: 86, name: "Kiskintha Luxury Gurkha Pant", description: "Kiskintha Luxury Gurkha Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Pants/luxury gurkha pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Gurkha Trousers", size: "S,M,L,XL,XXL", color: "Luxury", rating: 4.4, stock: 40, created_at: new Date() },
        { id: 87, name: "Kiskintha PANT 1", description: "Kiskintha PANT 1 from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Pants/PANT 1.jpg", category_id: 3, category_name: "Pants", subcategory: "Formal Trousers", size: "S,M,L,XL,XXL", color: "PANT", rating: 4.5, stock: 43, created_at: new Date() },
        { id: 88, name: "Kiskintha Shopping", description: "Kiskintha Shopping from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Pants/shopping.webp", category_id: 3, category_name: "Pants", subcategory: "Casual Trousers", size: "S,M,L,XL,XXL", color: "Shopping", rating: 4.6, stock: 46, created_at: new Date() },
        { id: 89, name: "Kiskintha Aura Hoodie", description: "Kiskintha Aura Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Hoodie/aura hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Aura", rating: 4.7, stock: 49, created_at: new Date() },
        { id: 90, name: "Kiskintha Brookn Hoodie", description: "Kiskintha Brookn Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Hoodie/brookn hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Brookn", rating: 4.8, stock: 52, created_at: new Date() },
        { id: 91, name: "Kiskintha Half Cat Hoodie", description: "Kiskintha Half Cat Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Hoodie/half cat hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Half", rating: 4.9, stock: 55, created_at: new Date() },
        { id: 92, name: "Kiskintha Hooodie", description: "Kiskintha Hooodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Hoodie/hooodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Hooodie", rating: 4.3, stock: 58, created_at: new Date() },
        { id: 93, name: "Kiskintha Jean Hoodie", description: "Kiskintha Jean Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Hoodie/jean hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Jean", rating: 4.4, stock: 61, created_at: new Date() },
        { id: 94, name: "Kiskintha Jocker Hoodie", description: "Kiskintha Jocker Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Hoodie/jocker hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Jocker", rating: 4.5, stock: 64, created_at: new Date() },
        { id: 95, name: "Kiskintha Los Angel Hoodie", description: "Kiskintha Los Angel Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Hoodie/los angel hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Los", rating: 4.6, stock: 27, created_at: new Date() },
        { id: 96, name: "Kiskintha Loyal Hoodie", description: "Kiskintha Loyal Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Hoodie/loyal hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Loyal", rating: 4.7, stock: 30, created_at: new Date() },
        { id: 97, name: "Kiskintha Pink Hoodie", description: "Kiskintha Pink Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Hoodie/pink hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.8, stock: 33, created_at: new Date() },
        { id: 98, name: "Kiskintha Shirt Type Hoodie", description: "Kiskintha Shirt Type Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Hoodie/shirt type hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Shirt", rating: 4.9, stock: 36, created_at: new Date() },
        { id: 99, name: "Kiskintha Spider Hoodie", description: "Kiskintha Spider Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Hoodie/spider hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", size: "S,M,L,XL,XXL", color: "Spider", rating: 4.3, stock: 39, created_at: new Date() },
        { id: 100, name: "Kiskintha 3 Color Shirt Combo Group Shirt", description: "Kiskintha 3 Color Shirt Combo Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Group Shirt/3 color shirt combo group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "3", rating: 4.4, stock: 42, created_at: new Date() },
        { id: 101, name: "Kiskintha 5 Types Of Group Shirt", description: "Kiskintha 5 Types Of Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Group Shirt/5 types of group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "5", rating: 4.5, stock: 45, created_at: new Date() },
        { id: 102, name: "Kiskintha Best Group Shirt", description: "Kiskintha Best Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Group Shirt/best group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Best", rating: 4.6, stock: 48, created_at: new Date() },
        { id: 103, name: "Kiskintha Best Running Group Shirt", description: "Kiskintha Best Running Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Group Shirt/best running group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Best", rating: 4.7, stock: 51, created_at: new Date() },
        { id: 104, name: "Kiskintha Causal Group Shirt", description: "Kiskintha Causal Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Group Shirt/causal group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Causal", rating: 4.8, stock: 54, created_at: new Date() },
        { id: 105, name: "Kiskintha College Group Shirt", description: "Kiskintha College Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Group Shirt/college group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "College", rating: 4.9, stock: 57, created_at: new Date() },
        { id: 106, name: "Kiskintha Formal  Group Shirt", description: "Kiskintha Formal  Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Group Shirt/formal  group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Formal", rating: 4.3, stock: 60, created_at: new Date() },
        { id: 107, name: "Kiskintha Formal Group Shirt", description: "Kiskintha Formal Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Group Shirt/formal group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Formal", rating: 4.4, stock: 63, created_at: new Date() },
        { id: 108, name: "Kiskintha Group Light Shade Group Shirt", description: "Kiskintha Group Light Shade Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Group Shirt/group light shade group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Group", rating: 4.5, stock: 26, created_at: new Date() },
        { id: 109, name: "Kiskintha Group Short Straight Group Shirt", description: "Kiskintha Group Short Straight Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Group Shirt/group short straight group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Group", rating: 4.6, stock: 29, created_at: new Date() },
        { id: 110, name: "Kiskintha Pastel Color Group Shirt", description: "Kiskintha Pastel Color Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Group Shirt/pastel color group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Pastel", rating: 4.7, stock: 32, created_at: new Date() },
        { id: 111, name: "Kiskintha Pastel Shade Group Shirt", description: "Kiskintha Pastel Shade Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Group Shirt/pastel shade group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Pastel", rating: 4.8, stock: 35, created_at: new Date() },
        { id: 112, name: "Kiskintha Straight Line Group Shirt", description: "Kiskintha Straight Line Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Group Shirt/straight line group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", size: "S,M,L,XL,XXL", color: "Straight", rating: 4.9, stock: 38, created_at: new Date() },
        { id: 113, name: "Kiskintha Tousers 1 Classic Cotton Trouser", description: "Kiskintha Tousers 1 Classic Cotton Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1118.60, image: "Trousers/tousers1.jpg", category_id: 4, category_name: "Trousers", subcategory: "Cotton Trousers", size: "S,M,L,XL,XXL", color: "Classic", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 114, name: "Kiskintha Touser 2 Slim Fit Trouser", description: "Kiskintha Touser 2 Slim Fit Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1258.60, image: "Trousers/touser2.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", size: "S,M,L,XL,XXL", color: "Slim", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 115, name: "Kiskintha Touser 3 Casual Stretch Trouser", description: "Kiskintha Touser 3 Casual Stretch Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1398.60, image: "Trousers/touser3.jpg", category_id: 4, category_name: "Trousers", subcategory: "Casual Trousers", size: "S,M,L,XL,XXL", color: "Casual", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 116, name: "Kiskintha Touoser 4 Formal Grey Trouser", description: "Kiskintha Touoser 4 Formal Grey Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1099.00, original_price: 1538.60, image: "Trousers/touoser4.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 117, name: "Kiskintha Touser 5 Chino Dark Trouser", description: "Kiskintha Touser 5 Chino Dark Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1258.60, image: "Trousers/touser5.jpg", category_id: 4, category_name: "Trousers", subcategory: "Chino Trousers", size: "S,M,L,XL,XXL", color: "Dark", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 118, name: "Kiskintha Touser 6 Premium Cotton Trouser", description: "Kiskintha Touser 6 Premium Cotton Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1678.60, image: "Trousers/touser6.jpg", category_id: 4, category_name: "Trousers", subcategory: "Cotton Trousers", size: "S,M,L,XL,XXL", color: "Premium", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 119, name: "Kiskintha Tousers 7 Regular Fit Trouser", description: "Kiskintha Tousers 7 Regular Fit Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 949.00, original_price: 1328.60, image: "Trousers/tousers7.jpg", category_id: 4, category_name: "Trousers", subcategory: "Regular Trousers", size: "S,M,L,XL,XXL", color: "Regular", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 120, name: "Kiskintha Touser 8 Formal Black Trouser", description: "Kiskintha Touser 8 Formal Black Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1818.60, image: "Trousers/touser8.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", size: "S,M,L,XL,XXL", color: "Black", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 121, name: "Kiskintha Tousers 9 Modern Fit Trouser", description: "Kiskintha Tousers 9 Modern Fit Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1049.00, original_price: 1468.60, image: "Trousers/tousers9.jpg", category_id: 4, category_name: "Trousers", subcategory: "Modern Trousers", size: "S,M,L,XL,XXL", color: "Modern", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 122, name: "Kiskintha Tousers 10 Stylish Chino Trouser", description: "Kiskintha Tousers 10 Stylish Chino Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1149.00, original_price: 1608.60, image: "Trousers/tousers10.jpg", category_id: 4, category_name: "Trousers", subcategory: "Chino Trousers", size: "S,M,L,XL,XXL", color: "Stylish", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 123, name: "Kiskintha Touser 11 Executive Suit Trouser", description: "Kiskintha Touser 11 Executive Suit Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1958.60, image: "Trousers/touser11.jpg", category_id: 4, category_name: "Trousers", subcategory: "Suit Trousers", size: "S,M,L,XL,XXL", color: "Executive", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 124, name: "Kiskintha Touser 12 Smart Formal Trouser", description: "Kiskintha Touser 12 Smart Formal Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1249.00, original_price: 1748.60, image: "Trousers/touser12.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", size: "S,M,L,XL,XXL", color: "Smart", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 125, name: "Kiskintha Touser 13 Olive Cargo Trouser", description: "Kiskintha Touser 13 Olive Cargo Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1099.00, original_price: 1538.60, image: "Trousers/touser13.jpg", category_id: 4, category_name: "Trousers", subcategory: "Cargo Trousers", size: "S,M,L,XL,XXL", color: "Olive", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 126, name: "Kiskintha Touser 14 Navy Chino Trouser", description: "Kiskintha Touser 14 Navy Chino Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1398.60, image: "Trousers/touser14.jpg", category_id: 4, category_name: "Trousers", subcategory: "Chino Trousers", size: "S,M,L,XL,XXL", color: "Navy", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 127, name: "Kiskintha Touser 15 Light Grey Formal Trouser", description: "Kiskintha Touser 15 Light Grey Formal Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1678.60, image: "Trousers/touser15.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", size: "S,M,L,XL,XXL", color: "Light Grey", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 128, name: "Kiskintha Touser 16 Dark Charcoal Trouser", description: "Kiskintha Touser 16 Dark Charcoal Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1818.60, image: "Trousers/touser16.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", size: "S,M,L,XL,XXL", color: "Charcoal", rating: 4.7, stock: 35, created_at: new Date() }
    ],
    orders: [],        // ALL OLD ORDERS CLEARED
    order_items: []    // ALL OLD ORDER ITEMS CLEARED
};

// Force in-memory engine to guarantee 100% reliable execution
let useFallback = true;

// Custom query router that runs on memoryStore
const smartPool = {
    async query(sql, params = []) {
        // --- Memory Query Engine ---
        const cleanSql = sql.trim().toUpperCase();

        // ORDER_ITEMS
        if (cleanSql.includes('SELECT') && cleanSql.includes('FROM ORDER_ITEMS')) {
            let list = memoryStore.order_items.map(oi => {
                const p = memoryStore.products.find(prod => prod.id == oi.product_id);
                return {
                    ...oi,
                    product_name: p ? p.name : 'Kiskintha Apparel Item',
                    image: p ? p.image : ''
                };
            });
            if (cleanSql.includes('WHERE ORDER_ID =') || cleanSql.includes('ORDER_ID = ?')) {
                list = list.filter(oi => oi.order_id == params[0]);
            }
            return [list, []];
        }

        // ORDERS (Count, Sum or List)
        if (cleanSql.includes('SELECT') && (cleanSql.includes('FROM ORDERS') || cleanSql.includes('FROM ORDERS O'))) {
            // Count query check
            if (cleanSql.includes('COUNT(*)')) {
                let count = memoryStore.orders.length;
                if ((cleanSql.includes('WHERE USER_ID =') || cleanSql.includes('WHERE O.USER_ID =')) && params.length > 0) {
                    count = memoryStore.orders.filter(o => o.user_id == params[0]).length;
                }
                return [[{ count, total: count }], []];
            }

            // Sum query check
            if (cleanSql.includes('SUM(TOTAL)') || cleanSql.includes('SUM(')) {
                const totalSum = memoryStore.orders
                    .filter(o => o.status !== 'Cancelled' && !o.status.includes('Reject'))
                    .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                return [[{ total: totalSum }], []];
            }

            // List query
            let list = memoryStore.orders.map(o => {
                const u = memoryStore.users.find(usr => usr.id == o.user_id);
                return {
                    ...o,
                    customer_name: u ? u.name : 'Customer',
                    customer_email: u ? u.email : 'customer@kiskinthamenswear.com',
                    customer_phone: o.phone || (u ? u.phone : '9876543210'),
                    customer_address: o.address || (u ? u.address : 'Chennai, Tamil Nadu'),
                    u_phone: o.phone || (u ? u.phone : '9876543210')
                };
            });

            if ((cleanSql.includes('WHERE USER_ID =') || cleanSql.includes('WHERE O.USER_ID =')) && params.length > 0) {
                list = list.filter(o => o.user_id == params[0]);
            }

            list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            return [list, []];
        }

        // USERS
        if (cleanSql.includes('SELECT') && cleanSql.includes('FROM USERS')) {
            if (cleanSql.includes('COUNT(*)')) {
                let count = memoryStore.users.length;
                if (cleanSql.includes("ROLE = 'CUSTOMER'") || cleanSql.includes('ROLE = ?')) {
                    count = memoryStore.users.filter(u => u.role === 'customer').length;
                }
                return [[{ count }], []];
            }

            if (cleanSql.includes('WHERE ID =')) {
                const user = memoryStore.users.filter(u => u.id == params[0]);
                return [user, []];
            }
            if (cleanSql.includes('WHERE EMAIL =') || cleanSql.includes('OR PHONE =')) {
                const val = (params[0] || '').toString().toLowerCase();
                const val2 = (params[1] || params[0] || '').toString().toLowerCase();
                const user = memoryStore.users.filter(u =>
                    u.email.toLowerCase() === val ||
                    u.phone.toLowerCase() === val ||
                    u.email.toLowerCase() === val2 ||
                    u.phone.toLowerCase() === val2
                );
                return [user, []];
            }
            if (cleanSql.includes("ROLE IN ('ADMIN', 'OWNER')") || cleanSql.includes("ROLE IN ('ADMIN','OWNER')") || cleanSql.includes("ROLE IN")) {
                const staff = memoryStore.users.filter(u => u.role === 'admin' || u.role === 'owner');
                return [staff, []];
            }
            if (cleanSql.includes("ROLE = 'CUSTOMER'") || cleanSql.includes('ROLE = ?')) {
                const customers = memoryStore.users.filter(u => u.role === 'customer');
                return [customers, []];
            }
            return [memoryStore.users, []];
        }

        if (cleanSql.includes('UPDATE USERS SET PASSWORD')) {
            const user = memoryStore.users.find(u => u.id == params[1]);
            if (user) {
                user.password = params[0];
            }
            return [{ affectedRows: 1 }, []];
        }

        if (cleanSql.includes('UPDATE USERS SET')) {
            const idVal = params[params.length - 2] || params[params.length - 1];
            const emailVal = params[params.length - 1];
            const user = memoryStore.users.find(u =>
                u.id == idVal ||
                u.id == emailVal ||
                (u.email && u.email.toLowerCase() === idVal.toString().toLowerCase()) ||
                (u.email && u.email.toLowerCase() === emailVal.toString().toLowerCase())
            );
            if (user) {
                user.name = params[0];
                user.phone = params[1] || '';
                user.address = params[2] || '';
            }
            return [{ affectedRows: 1 }, []];
        }

        if (cleanSql.includes('INSERT INTO USERS')) {
            const newUser = {
                id: memoryStore.users.length + 1,
                name: params[0],
                email: params[1],
                password: params[2],
                phone: params[3] || '',
                address: params[4] || '',
                role: params[5] || 'customer',
                created_at: new Date()
            };
            memoryStore.users.unshift(newUser);
            return [{ insertId: newUser.id, affectedRows: 1 }, []];
        }

        // CATEGORIES
        if (cleanSql.includes('SELECT') && cleanSql.includes('FROM CATEGORIES')) {
            return [memoryStore.categories, []];
        }

        // PRODUCTS
        if (cleanSql.includes('SELECT') && cleanSql.includes('FROM PRODUCTS')) {
            if (cleanSql.includes('COUNT(*)')) {
                return [[{ count: memoryStore.products.length }], []];
            }

            let list = memoryStore.products.map(p => {
                const cat = memoryStore.categories.find(c => c.id == p.category_id);
                return { ...p, category_name: cat ? cat.name : 'Men Wear' };
            });

            if (cleanSql.includes('WHERE P.ID =') || cleanSql.includes('WHERE ID =')) {
                const prod = list.filter(p => p.id == params[0]);
                return [prod, []];
            }

            if (params.length > 0) {
                if (cleanSql.includes('CATEGORY_ID = ?') && cleanSql.includes('LIKE')) {
                    const catId = params[0];
                    const searchTerm = (params[1] || '').replace(/%/g, '').toLowerCase();
                    list = list.filter(p => p.category_id == catId && (p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm)));
                } else if (cleanSql.includes('CATEGORY_ID = ?')) {
                    const catId = params[0];
                    list = list.filter(p => p.category_id == catId);
                } else if (cleanSql.includes('LIKE')) {
                    const searchTerm = (params[0] || '').replace(/%/g, '').toLowerCase();
                    list = list.filter(p => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm));
                }
            }

            return [list, []];
        }

        if (cleanSql.includes('INSERT INTO PRODUCTS')) {
            const newProd = {
                id: memoryStore.products.length + 1,
                name: params[0],
                description: params[1],
                price: parseFloat(params[2]),
                image: params[3] || '',
                category_id: parseInt(params[4]),
                size: params[5] || 'S,M,L,XL',
                stock: parseInt(params[6]) || 0,
                created_at: new Date()
            };
            memoryStore.products.unshift(newProd);
            return [{ insertId: newProd.id, affectedRows: 1 }, []];
        }

        if (cleanSql.includes('STOCK = STOCK -') || cleanSql.includes('STOCK - ?')) {
            const qty = parseInt(params[0]) || 1;
            const prodId = params[1];
            const prod = memoryStore.products.find(p => p.id == prodId);
            if (prod) {
                prod.stock = Math.max(0, prod.stock - qty);
            }
            return [{ affectedRows: 1 }, []];
        }

        if (cleanSql.includes('STOCK = STOCK +') || cleanSql.includes('STOCK + ?')) {
            const qty = parseInt(params[0]) || 1;
            const prodId = params[1];
            const prod = memoryStore.products.find(p => p.id == prodId);
            if (prod) {
                prod.stock = prod.stock + qty;
            }
            return [{ affectedRows: 1 }, []];
        }

        if (cleanSql.includes('UPDATE PRODUCTS SET NAME') || cleanSql.includes('UPDATE PRODUCTS SET')) {
            const prod = memoryStore.products.find(p => p.id == params[params.length - 1]);
            if (prod) {
                prod.name = params[0];
                prod.description = params[1];
                prod.price = parseFloat(params[2]);
                prod.image = params[3];
                prod.category_id = parseInt(params[4]);
                prod.size = params[5];
                prod.stock = parseInt(params[6]);
            }
            return [{ affectedRows: 1 }, []];
        }

        if (cleanSql.includes('DELETE FROM PRODUCTS')) {
            memoryStore.products = memoryStore.products.filter(p => p.id != params[0]);
            return [{ affectedRows: 1 }, []];
        }

        // ORDERS
        if (cleanSql.includes('INSERT INTO ORDERS')) {
            const newOrder = {
                id: 100 + memoryStore.orders.length + 1,
                user_id: params[0],
                total: parseFloat(params[1]),
                address: params[2],
                phone: params[3],
                payment_method: params[4] || 'UPI QR Payment (bharathpandian450-1@okhdfcbank)',
                status: params[5] || 'Pending Approval',
                created_at: new Date()
            };
            memoryStore.orders.unshift(newOrder);
            return [{ insertId: newOrder.id, affectedRows: 1 }, []];
        }

        if (cleanSql.includes('INSERT INTO ORDER_ITEMS')) {
            const newItem = {
                id: memoryStore.order_items.length + 1,
                order_id: params[0],
                product_id: params[1],
                quantity: params[2],
                price: params[3],
                size: params[4]
            };
            memoryStore.order_items.push(newItem);
            return [{ insertId: newItem.id, affectedRows: 1 }, []];
        }

        if (cleanSql.includes('UPDATE ORDERS')) {
            const orderId = params[1] || params[params.length - 1];
            const newStatus = params[0];
            const order = memoryStore.orders.find(o => o.id == orderId);
            if (order) {
                order.status = newStatus;
            }
            return [{ affectedRows: 1 }, []];
        }

        // STATS
        if (cleanSql.includes('COUNT') || cleanSql.includes('SUM')) {
            const totalProducts = memoryStore.products.length;
            const totalOrders = memoryStore.orders.length;
            const totalCustomers = memoryStore.users.filter(u => u.role === 'customer').length;
            const totalRevenue = memoryStore.orders
                .filter(o => o.status !== 'Cancelled' && !o.status.includes('Reject'))
                .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
            const totalOwners = memoryStore.users.filter(u => u.role === 'owner').length;

            return [[{
                totalProducts,
                totalOrders,
                totalCustomers,
                totalRevenue,
                totalOwners
            }], []];
        }

        return [[], []];
    }
};

smartPool.memoryStore = memoryStore;
module.exports = smartPool;
