const bcrypt = require('bcryptjs');

const passCustomer = '$2a$10$xPLP0KJ8qXKLp6N5kJJ8CeGx6kFOkXmRVRHNF7pPT8WQFxMOEBrHK';
const passOwner = bcrypt.hashSync(process.env.OWNER_PASSWORD || 'Gowtham@123', 10);

// In-Memory Database Store
const memoryStore = {
    users: [
        { id: 3, name: 'Kiskintha (Store Owner)', email: 'kiskinthaowner@kiskinthamenswear.com', username: 'kiskinthaowner', password: passOwner, phone: '9876543200', address: 'Kiskintha Mens Wear Main Branch, Chennai', role: 'owner', created_at: new Date() }
    ],
    categories: [
        { id: 1, name: 'T-Shirts' },
        { id: 2, name: 'Shirts' },
        { id: 3, name: 'Pants' },
        { id: 4, name: 'Trousers' },
        { id: 7, name: 'Hoodies' },
        { id: 8, name: 'Group Shirts' }
    ],
    products: [
        { id: 1, name: "Kiskintha 3 Color T Shirt", description: "Kiskintha 3 Color T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "T-Shirts/3 color t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Multi", rating: 4.3, stock: 25, created_at: new Date() },
        { id: 2, name: "Kiskintha Beach T Shirt", description: "Kiskintha Beach T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "T-Shirts/beach t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.4, stock: 28, created_at: new Date() },
        { id: 3, name: "Kiskintha Black T Shirt", description: "Kiskintha Black T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "T-Shirts/black t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.5, stock: 31, created_at: new Date() },
        { id: 4, name: "Kiskintha Brookyn White T Shirty", description: "Kiskintha Brookyn White T Shirty from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "T-Shirts/brookyn white t shirty.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.6, stock: 34, created_at: new Date() },
        { id: 5, name: "Kiskintha Brown T Shirt", description: "Kiskintha Brown T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "T-Shirts/brown t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.7, stock: 37, created_at: new Date() },
        { id: 6, name: "Kiskintha Color Minimalist Shirt", description: "Kiskintha Color Minimalist Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "T-Shirts/color minimalist shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.8, stock: 40, created_at: new Date() },
        { id: 7, name: "Kiskintha Contrast Round T Shirt", description: "Kiskintha Contrast Round T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "T-Shirts/contrast round t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.9, stock: 43, created_at: new Date() },
        { id: 8, name: "Kiskintha Los Angel  Double T Shirt", description: "Kiskintha Los Angel  Double T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "T-Shirts/los angel  double t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.3, stock: 46, created_at: new Date() },
        { id: 9, name: "Kiskintha Los Angel T Shirt", description: "Kiskintha Los Angel T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "T-Shirts/los angel t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.4, stock: 49, created_at: new Date() },
        { id: 10, name: "Kiskintha Miles Color Pattern T Shirt", description: "Kiskintha Miles Color Pattern T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "T-Shirts/miles color pattern t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Multi", rating: 4.5, stock: 52, created_at: new Date() },
        { id: 11, name: "Kiskintha Plain White T Short", description: "Kiskintha Plain White T Short from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "T-Shirts/plain white t short.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.6, stock: 55, created_at: new Date() },
        { id: 12, name: "Kiskintha Polo T Shirt", description: "Kiskintha Polo T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "T-Shirts/polo t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Polo T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 58, created_at: new Date() },
        { id: 13, name: "Kiskintha Pttoed Plant T Shirt", description: "Kiskintha Pttoed Plant T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "T-Shirts/pttoed plant t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.8, stock: 61, created_at: new Date() },
        { id: 14, name: "Kiskintha Shirt Selve T Shirt", description: "Kiskintha Shirt Selve T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "T-Shirts/shirt selve t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.9, stock: 64, created_at: new Date() },
        { id: 15, name: "Kiskintha Smile T Shirt", description: "Kiskintha Smile T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "T-Shirts/smile t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Yellow", rating: 4.3, stock: 27, created_at: new Date() },
        { id: 16, name: "Kiskintha Summer T Shirt 2", description: "Kiskintha Summer T Shirt 2 from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "T-Shirts/summer t shirt 2.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.4, stock: 30, created_at: new Date() },
        { id: 17, name: "Kiskintha Summer T Shrt", description: "Kiskintha Summer T Shrt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "T-Shirts/summer t shrt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.5, stock: 33, created_at: new Date() },
        { id: 18, name: "Kiskintha T Shirt Classic", description: "Kiskintha T Shirt Classic from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "T-Shirts/t shirt classic.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.6, stock: 36, created_at: new Date() },
        { id: 19, name: "Kiskintha T Shirt", description: "Kiskintha T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "T-Shirts/t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.7, stock: 39, created_at: new Date() },
        { id: 20, name: "Kiskintha White T Shirt", description: "Kiskintha White T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "T-Shirts/white t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.8, stock: 42, created_at: new Date() },
        { id: 21, name: "Kiskintha Yellow T Shirt", description: "Kiskintha Yellow T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "T-Shirts/yellow t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Yellow", rating: 4.9, stock: 45, created_at: new Date() },
        { id: 22, name: "Kiskintha Best Pastel Shirt", description: "Kiskintha Best Pastel Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Shirts/best pastel shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.3, stock: 48, created_at: new Date() },
        { id: 23, name: "Kiskintha Brown Shirt", description: "Kiskintha Brown Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Shirts/brown shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.4, stock: 51, created_at: new Date() },
        { id: 24, name: "Kiskintha Causal Light Shade Shirt", description: "Kiskintha Causal Light Shade Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Shirts/causal light shade shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.5, stock: 54, created_at: new Date() },
        { id: 25, name: "Kiskintha Causal Shirt", description: "Kiskintha Causal Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Shirts/causal shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.6, stock: 57, created_at: new Date() },
        { id: 26, name: "Kiskintha Checcked Every Day Shirt", description: "Kiskintha Checcked Every Day Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Shirts/checcked every day shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 60, created_at: new Date() },
        { id: 27, name: "Kiskintha Checked Double Shirt", description: "Kiskintha Checked Double Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Shirts/checked double shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.8, stock: 63, created_at: new Date() },
        { id: 28, name: "Kiskintha Checked Royal Blue Shirt", description: "Kiskintha Checked Royal Blue Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Shirts/checked royal blue shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.9, stock: 26, created_at: new Date() },
        { id: 29, name: "Kiskintha Checked Shirt Black", description: "Kiskintha Checked Shirt Black from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Shirts/checked shirt black.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.3, stock: 29, created_at: new Date() },
        { id: 30, name: "Kiskintha COTTON SHIRTS", description: "Kiskintha COTTON SHIRTS from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/COTTON SHIRTS.jpg", category_id: 2, category_name: "Shirts", subcategory: "Cotton Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.4, stock: 32, created_at: new Date() },
        { id: 31, name: "Kiskintha Cracked Shirt Red", description: "Kiskintha Cracked Shirt Red from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Shirts/cracked shirt red.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.5, stock: 35, created_at: new Date() },
        { id: 32, name: "Kiskintha Denin Shirt", description: "Kiskintha Denin Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Shirts/denin shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.6, stock: 38, created_at: new Date() },
        { id: 33, name: "Kiskintha Double Color Shirt", description: "Kiskintha Double Color Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Shirts/double color shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 41, created_at: new Date() },
        { id: 34, name: "Kiskintha Double Colr Blue Shirt", description: "Kiskintha Double Colr Blue Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Shirts/double colr blue shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.8, stock: 44, created_at: new Date() },
        { id: 35, name: "Kiskintha Front Tripped Shirt", description: "Kiskintha Front Tripped Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Shirts/front tripped shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.9, stock: 47, created_at: new Date() },
        { id: 36, name: "Kiskintha GREEN COTTON SHIRT", description: "Kiskintha GREEN COTTON SHIRT from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Shirts/GREEN COTTON SHIRT.jpg", category_id: 2, category_name: "Shirts", subcategory: "Cotton Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.3, stock: 50, created_at: new Date() },
        { id: 37, name: "Kiskintha Green Pastel Color Shirt", description: "Kiskintha Green Pastel Color Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Shirts/green pastel color shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.4, stock: 53, created_at: new Date() },
        { id: 38, name: "Kiskintha Korean Loose Casual Shirt", description: "Kiskintha Korean Loose Casual Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Shirts/korean loose casual shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.5, stock: 56, created_at: new Date() },
        { id: 39, name: "Kiskintha Light Shade Shirt Blue", description: "Kiskintha Light Shade Shirt Blue from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Shirts/light shade shirt blue.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.6, stock: 59, created_at: new Date() },
        { id: 40, name: "Kiskintha Light Shade Shirt", description: "Kiskintha Light Shade Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Shirts/light shade shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 62, created_at: new Date() },
        { id: 41, name: "Kiskintha Linen 1", description: "Kiskintha Linen 1 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Shirts/linen 1.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.8, stock: 25, created_at: new Date() },
        { id: 42, name: "Kiskintha Linen 2", description: "Kiskintha Linen 2 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/linen 2.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.9, stock: 28, created_at: new Date() },
        { id: 43, name: "Kiskintha Linen 3", description: "Kiskintha Linen 3 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Shirts/linen 3.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.3, stock: 31, created_at: new Date() },
        { id: 44, name: "Kiskintha Linen 4", description: "Kiskintha Linen 4 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Shirts/linen 4.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.4, stock: 34, created_at: new Date() },
        { id: 45, name: "Kiskintha Linen 5", description: "Kiskintha Linen 5 from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Shirts/linen 5.jpg", category_id: 2, category_name: "Shirts", subcategory: "Linen Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.5, stock: 37, created_at: new Date() },
        { id: 46, name: "Kiskintha Maroon Shirt", description: "Kiskintha Maroon Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Shirts/maroon shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.6, stock: 40, created_at: new Date() },
        { id: 47, name: "Kiskintha Marron Shirt Double Color", description: "Kiskintha Marron Shirt Double Color from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Shirts/marron shirt double color.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.7, stock: 43, created_at: new Date() },
        { id: 48, name: "Kiskintha Moroon Strong", description: "Kiskintha Moroon Strong from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Shirts/moroon strong.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.8, stock: 46, created_at: new Date() },
        { id: 49, name: "Kiskintha Multi Color Shirt", description: "Kiskintha Multi Color Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Shirts/multi color shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Multi", rating: 4.9, stock: 49, created_at: new Date() },
        { id: 50, name: "Kiskintha Normal Floural Shirt", description: "Kiskintha Normal Floural Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Shirts/normal floural shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.3, stock: 52, created_at: new Date() },
        { id: 51, name: "Kiskintha Olive Blue Shirt", description: "Kiskintha Olive Blue Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Shirts/olive blue shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.4, stock: 55, created_at: new Date() },
        { id: 52, name: "Kiskintha Pink Casual Shirt", description: "Kiskintha Pink Casual Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Shirts/pink casual shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.5, stock: 58, created_at: new Date() },
        { id: 53, name: "Kiskintha Red And Blue Shirt", description: "Kiskintha Red And Blue Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Shirts/red and blue shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.6, stock: 61, created_at: new Date() },
        { id: 54, name: "Kiskintha Red Straight Shirt", description: "Kiskintha Red Straight Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/red straight shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.7, stock: 64, created_at: new Date() },
        { id: 55, name: "Kiskintha Regualer Shirt", description: "Kiskintha Regualer Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Shirts/regualer shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.8, stock: 27, created_at: new Date() },
        { id: 56, name: "Kiskintha Regular Fit Shirt", description: "Kiskintha Regular Fit Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Shirts/regular fit shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.9, stock: 30, created_at: new Date() },
        { id: 57, name: "Kiskintha Royal Bluse Shirt", description: "Kiskintha Royal Bluse Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Shirts/royal bluse shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.3, stock: 33, created_at: new Date() },
        { id: 58, name: "Kiskintha Shirt Half Box", description: "Kiskintha Shirt Half Box from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Shirts/shirt half box.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.4, stock: 36, created_at: new Date() },
        { id: 59, name: "Kiskintha Shirt Half Whitte Black", description: "Kiskintha Shirt Half Whitte Black from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Shirts/shirt half whitte black.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.5, stock: 39, created_at: new Date() },
        { id: 60, name: "Kiskintha Shirt Line", description: "Kiskintha Shirt Line from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Shirts/shirt line.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.6, stock: 42, created_at: new Date() },
        { id: 61, name: "Kiskintha Stright Line Shirt", description: "Kiskintha Stright Line Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Shirts/stright line shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 45, created_at: new Date() },
        { id: 62, name: "Kiskintha Stright Mild Shade Shirt", description: "Kiskintha Stright Mild Shade Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Shirts/stright mild shade shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.8, stock: 48, created_at: new Date() },
        { id: 63, name: "Kiskintha Strong Shirt Pink", description: "Kiskintha Strong Shirt Pink from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Shirts/strong shirt pink.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.9, stock: 51, created_at: new Date() },
        { id: 64, name: "Kiskintha Strriaght Shirt", description: "Kiskintha Strriaght Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Shirts/strriaght shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.3, stock: 54, created_at: new Date() },
        { id: 65, name: "Kiskintha Trending Shirt", description: "Kiskintha Trending Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Shirts/trending shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.4, stock: 57, created_at: new Date() },
        { id: 66, name: "Kiskintha Yellow Checked Shirt", description: "Kiskintha Yellow Checked Shirt from Kiskintha Mens Wear Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/yellow checked shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Checked Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Yellow", rating: 4.5, stock: 60, created_at: new Date() },
        { id: 67, name: "Kiskintha 8 Packet Jeans Pant", description: "Kiskintha 8 Packet Jeans Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Pants/8 packet jeans pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.6, stock: 63, created_at: new Date() },
        { id: 68, name: "Kiskintha Baggy Jeans Wide Leg", description: "Kiskintha Baggy Jeans Wide Leg from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Pants/Baggy jeans wide leg.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 26, created_at: new Date() },
        { id: 69, name: "Kiskintha Cargo Pant", description: "Kiskintha Cargo Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Pants/cargo pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Cargo Pants", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.8, stock: 29, created_at: new Date() },
        { id: 70, name: "Kiskintha Dark Design Pants", description: "Kiskintha Dark Design Pants from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Pants/dark design pants.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.9, stock: 32, created_at: new Date() },
        { id: 71, name: "Kiskintha Denin Jeans Fit Pant", description: "Kiskintha Denin Jeans Fit Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Pants/denin jeans fit pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.3, stock: 35, created_at: new Date() },
        { id: 72, name: "Kiskintha Hiphop Denin Pant", description: "Kiskintha Hiphop Denin Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Pants/hiphop denin pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.4, stock: 38, created_at: new Date() },
        { id: 73, name: "Kiskintha JEAN BLACK 2", description: "Kiskintha JEAN BLACK 2 from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Pants/JEAN BLACK 2.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.5, stock: 41, created_at: new Date() },
        { id: 74, name: "Kiskintha JEAN PANT", description: "Kiskintha JEAN PANT from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Pants/JEAN PANT.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.6, stock: 44, created_at: new Date() },
        { id: 75, name: "Kiskintha Jeans Black", description: "Kiskintha Jeans Black from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Pants/jeans black.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.7, stock: 47, created_at: new Date() },
        { id: 76, name: "Kiskintha Losse Fit Pant Jean", description: "Kiskintha Losse Fit Pant Jean from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Pants/losse fit pant jean.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.8, stock: 50, created_at: new Date() },
        { id: 77, name: "Kiskintha Shaight Cut Jean", description: "Kiskintha Shaight Cut Jean from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Pants/shaight cut jean.jpg", category_id: 3, category_name: "Pants", subcategory: "Jeans", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.9, stock: 53, created_at: new Date() },
        { id: 78, name: "Kiskintha  473Wx593H 700593828 Grey MODEL", description: "Kiskintha  473Wx593H 700593828 Grey MODEL from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Pants/-473Wx593H-700593828-grey-MODEL.avif", category_id: 3, category_name: "Pants", subcategory: "Formal Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.3, stock: 56, created_at: new Date() },
        { id: 79, name: "Kiskintha COTTON PANT 2", description: "Kiskintha COTTON PANT 2 from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Pants/COTTON PANT 2.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.4, stock: 59, created_at: new Date() },
        { id: 80, name: "Kiskintha COTTON PANT 3", description: "Kiskintha COTTON PANT 3 from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Pants/COTTON PANT 3.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.5, stock: 62, created_at: new Date() },
        { id: 81, name: "Kiskintha Cotton Pant Sandal", description: "Kiskintha Cotton Pant Sandal from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Pants/cotton pant sandal.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Sandal", rating: 4.6, stock: 25, created_at: new Date() },
        { id: 82, name: "Kiskintha COTTON PANT", description: "Kiskintha COTTON PANT from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Pants/COTTON PANT.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "White", rating: 4.7, stock: 28, created_at: new Date() },
        { id: 83, name: "Kiskintha Front Packet Leg Pant", description: "Kiskintha Front Packet Leg Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Pants/front packet leg pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Chinos & Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.8, stock: 31, created_at: new Date() },
        { id: 84, name: "Kiskintha Gurka Pant", description: "Kiskintha Gurka Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Pants/gurka pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Gurkha Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.9, stock: 34, created_at: new Date() },
        { id: 85, name: "Kiskintha High Waist Straight Leg Suit", description: "Kiskintha High Waist Straight Leg Suit from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Pants/high waist straight leg suit.jpg", category_id: 3, category_name: "Pants", subcategory: "Suit Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.3, stock: 37, created_at: new Date() },
        { id: 86, name: "Kiskintha Luxury Gurkha Pant", description: "Kiskintha Luxury Gurkha Pant from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Pants/luxury gurkha pant.jpg", category_id: 3, category_name: "Pants", subcategory: "Gurkha Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "White", rating: 4.4, stock: 40, created_at: new Date() },
        { id: 87, name: "Kiskintha PANT 1", description: "Kiskintha PANT 1 from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Pants/PANT 1.jpg", category_id: 3, category_name: "Pants", subcategory: "Formal Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.5, stock: 43, created_at: new Date() },
        { id: 88, name: "Kiskintha Shopping", description: "Kiskintha Shopping from Kiskintha Mens Wear Pants collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Pants/shopping.webp", category_id: 3, category_name: "Pants", subcategory: "Casual Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.6, stock: 46, created_at: new Date() },
        { id: 89, name: "Kiskintha Aura Hoodie", description: "Kiskintha Aura Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Hoodie/aura hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 49, created_at: new Date() },
        { id: 90, name: "Kiskintha Brookn Hoodie", description: "Kiskintha Brookn Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Hoodie/brookn hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.8, stock: 52, created_at: new Date() },
        { id: 91, name: "Kiskintha Half Cat Hoodie", description: "Kiskintha Half Cat Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Hoodie/half cat hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.9, stock: 55, created_at: new Date() },
        { id: 92, name: "Kiskintha Hooodie", description: "Kiskintha Hooodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Hoodie/hooodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.3, stock: 58, created_at: new Date() },
        { id: 93, name: "Kiskintha Jean Hoodie", description: "Kiskintha Jean Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Hoodie/jean hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.4, stock: 61, created_at: new Date() },
        { id: 94, name: "Kiskintha Jocker Hoodie", description: "Kiskintha Jocker Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Hoodie/jocker hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.5, stock: 64, created_at: new Date() },
        { id: 95, name: "Kiskintha Los Angel Hoodie", description: "Kiskintha Los Angel Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Hoodie/los angel hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.6, stock: 27, created_at: new Date() },
        { id: 96, name: "Kiskintha Loyal Hoodie", description: "Kiskintha Loyal Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Hoodie/loyal hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.7, stock: 30, created_at: new Date() },
        { id: 97, name: "Kiskintha Pink Hoodie", description: "Kiskintha Pink Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Hoodie/pink hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.8, stock: 33, created_at: new Date() },
        { id: 98, name: "Kiskintha Shirt Type Hoodie", description: "Kiskintha Shirt Type Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Hoodie/shirt type hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.9, stock: 36, created_at: new Date() },
        { id: 99, name: "Kiskintha Spider Hoodie", description: "Kiskintha Spider Hoodie from Kiskintha Mens Wear Hoodie collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Hoodie/spider hoodie.jpg", category_id: 7, category_name: "Hoodie", subcategory: "Fashion Hoodies", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.3, stock: 39, created_at: new Date() },
        { id: 100, name: "Kiskintha 3 Color Shirt Combo Group Shirt", description: "Kiskintha 3 Color Shirt Combo Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Group Shirt/3 color shirt combo group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Multi", rating: 4.4, stock: 42, created_at: new Date() },
        { id: 101, name: "Kiskintha 5 Types Of Group Shirt", description: "Kiskintha 5 Types Of Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 699.00, original_price: 979.00, image: "Group Shirt/5 types of group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Multi", rating: 4.5, stock: 45, created_at: new Date() },
        { id: 102, name: "Kiskintha Best Group Shirt", description: "Kiskintha Best Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1119.00, image: "Group Shirt/best group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.6, stock: 48, created_at: new Date() },
        { id: 103, name: "Kiskintha Best Running Group Shirt", description: "Kiskintha Best Running Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1259.00, image: "Group Shirt/best running group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.7, stock: 51, created_at: new Date() },
        { id: 104, name: "Kiskintha Causal Group Shirt", description: "Kiskintha Causal Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1399.00, image: "Group Shirt/causal group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.8, stock: 54, created_at: new Date() },
        { id: 105, name: "Kiskintha College Group Shirt", description: "Kiskintha College Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1679.00, image: "Group Shirt/college group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Yellow", rating: 4.9, stock: 57, created_at: new Date() },
        { id: 106, name: "Kiskintha Formal  Group Shirt", description: "Kiskintha Formal  Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1819.00, image: "Group Shirt/formal  group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.3, stock: 60, created_at: new Date() },
        { id: 107, name: "Kiskintha Formal Group Shirt", description: "Kiskintha Formal Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1959.00, image: "Group Shirt/formal group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.4, stock: 63, created_at: new Date() },
        { id: 108, name: "Kiskintha Group Light Shade Group Shirt", description: "Kiskintha Group Light Shade Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1499.00, original_price: 2099.00, image: "Group Shirt/group light shade group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.5, stock: 26, created_at: new Date() },
        { id: 109, name: "Kiskintha Group Short Straight Group Shirt", description: "Kiskintha Group Short Straight Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 399.00, original_price: 559.00, image: "Group Shirt/group short straight group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.6, stock: 29, created_at: new Date() },
        { id: 110, name: "Kiskintha Pastel Color Group Shirt", description: "Kiskintha Pastel Color Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 400.00, original_price: 560.00, image: "Group Shirt/pastel color group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.7, stock: 32, created_at: new Date() },
        { id: 111, name: "Kiskintha Pastel Shade Group Shirt", description: "Kiskintha Pastel Shade Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 499.00, original_price: 699.00, image: "Group Shirt/pastel shade group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.8, stock: 35, created_at: new Date() },
        { id: 112, name: "Kiskintha Straight Line Group Shirt", description: "Kiskintha Straight Line Group Shirt from Kiskintha Mens Wear Group Shirts collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 599.00, original_price: 839.00, image: "Group Shirt/straight line group shirt.jpg", category_id: 8, category_name: "Group Shirts", subcategory: "Group Shirt Combos", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.9, stock: 38, created_at: new Date() },
        { id: 113, name: "Kiskintha Tousers 1 Classic Cotton Trouser", description: "Kiskintha Tousers 1 Classic Cotton Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 799.00, original_price: 1118.60, image: "Trousers/tousers1.jpg", category_id: 4, category_name: "Trousers", subcategory: "Cotton Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 114, name: "Kiskintha Touser 2 Slim Fit Trouser", description: "Kiskintha Touser 2 Slim Fit Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1258.60, image: "Trousers/touser2.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 115, name: "Kiskintha Touser 3 Casual Stretch Trouser", description: "Kiskintha Touser 3 Casual Stretch Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1398.60, image: "Trousers/touser3.jpg", category_id: 4, category_name: "Trousers", subcategory: "Casual Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 116, name: "Kiskintha Touoser 4 Formal Grey Trouser", description: "Kiskintha Touoser 4 Formal Grey Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1099.00, original_price: 1538.60, image: "Trousers/touoser4.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 117, name: "Kiskintha Touser 5 Chino Dark Trouser", description: "Kiskintha Touser 5 Chino Dark Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 899.00, original_price: 1258.60, image: "Trousers/touser5.jpg", category_id: 4, category_name: "Trousers", subcategory: "Chino Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 118, name: "Kiskintha Touser 6 Premium Cotton Trouser", description: "Kiskintha Touser 6 Premium Cotton Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1678.60, image: "Trousers/touser6.jpg", category_id: 4, category_name: "Trousers", subcategory: "Cotton Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "White", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 119, name: "Kiskintha Tousers 7 Regular Fit Trouser", description: "Kiskintha Tousers 7 Regular Fit Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 949.00, original_price: 1328.60, image: "Trousers/tousers7.jpg", category_id: 4, category_name: "Trousers", subcategory: "Regular Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 120, name: "Kiskintha Touser 8 Formal Black Trouser", description: "Kiskintha Touser 8 Formal Black Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1818.60, image: "Trousers/touser8.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 121, name: "Kiskintha Tousers 9 Modern Fit Trouser", description: "Kiskintha Tousers 9 Modern Fit Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1049.00, original_price: 1468.60, image: "Trousers/tousers9.jpg", category_id: 4, category_name: "Trousers", subcategory: "Modern Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 122, name: "Kiskintha Tousers 10 Stylish Chino Trouser", description: "Kiskintha Tousers 10 Stylish Chino Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1149.00, original_price: 1608.60, image: "Trousers/tousers10.jpg", category_id: 4, category_name: "Trousers", subcategory: "Chino Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 123, name: "Kiskintha Touser 11 Executive Suit Trouser", description: "Kiskintha Touser 11 Executive Suit Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1399.00, original_price: 1958.60, image: "Trousers/touser11.jpg", category_id: 4, category_name: "Trousers", subcategory: "Suit Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 124, name: "Kiskintha Touser 12 Smart Formal Trouser", description: "Kiskintha Touser 12 Smart Formal Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1249.00, original_price: 1748.60, image: "Trousers/touser12.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 125, name: "Kiskintha Touser 13 Olive Cargo Trouser", description: "Kiskintha Touser 13 Olive Cargo Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1099.00, original_price: 1538.60, image: "Trousers/touser13.jpg", category_id: 4, category_name: "Trousers", subcategory: "Cargo Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Green", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 126, name: "Kiskintha Touser 14 Navy Chino Trouser", description: "Kiskintha Touser 14 Navy Chino Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 999.00, original_price: 1398.60, image: "Trousers/touser14.jpg", category_id: 4, category_name: "Trousers", subcategory: "Chino Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 127, name: "Kiskintha Touser 15 Light Grey Formal Trouser", description: "Kiskintha Touser 15 Light Grey Formal Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1199.00, original_price: 1678.60, image: "Trousers/touser15.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 128, name: "Kiskintha Touser 16 Dark Charcoal Trouser", description: "Kiskintha Touser 16 Dark Charcoal Trouser from Kiskintha Mens Wear Trousers collection. Premium quality fabric with durable stitching, stylish fit, and high comfort.", price: 1299.00, original_price: 1818.60, image: "Trousers/touser16.jpg", category_id: 4, category_name: "Trousers", subcategory: "Formal Trousers", sleeve_type: "", size: "S,M,L,XL,XXL", color: "Black", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 129, name: "Kiskintha Premium Cotton Shirt 4", description: "Kiskintha Premium Cotton Shirt 4 from Kiskintha Mens Wear Shirts collection. Full Hand premium cotton fabric with elegant styling, breathable texture, and supreme comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/COTTON SHIRTS 4.jpg", category_id: 2, category_name: "Shirts", subcategory: "Cotton Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.6, stock: 35, created_at: new Date() },
        { id: 130, name: "Kiskintha Classic Full Hand Shirt", description: "Kiskintha Classic Full Hand Shirt from Kiskintha Mens Wear Shirts collection. Tailored Full Hand formal-casual shirt in premium rich woven fabric with superior fit.", price: 899.00, original_price: 1259.00, image: "Shirts/full hand shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 40, created_at: new Date() },
        { id: 131, name: "Kiskintha Brown Half Hand Shirt", description: "Kiskintha Brown Half Hand Shirt from Kiskintha Mens Wear Shirts collection. Light and breathable Half Hand casual shirt in rich earthy brown tone.", price: 599.00, original_price: 839.00, image: "Shirts/brown shirt half hand.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.5, stock: 35, created_at: new Date() },
        { id: 132, name: "Kiskintha Green Half Hand Shirt", description: "Kiskintha Green Half Hand Shirt from Kiskintha Mens Wear Shirts collection. Refreshing Half Hand casual shirt in premium cotton weave with tailored collar.", price: 649.00, original_price: 899.00, image: "Shirts/green shirt half hand.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.6, stock: 38, created_at: new Date() },
        { id: 133, name: "Kiskintha Pattern Design Half Hand Shirt", description: "Kiskintha Pattern Design Half Hand Shirt from Kiskintha Mens Wear Shirts collection. Designer printed Half Hand shirt with crisp collar and modern fit.", price: 699.00, original_price: 979.00, image: "Shirts/half hand design shirt1.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 32, created_at: new Date() },
        { id: 134, name: "Kiskintha Urban Half Hand Shirt 2", description: "Kiskintha Urban Half Hand Shirt 2 from Kiskintha Mens Wear Shirts collection. Contemporary casual Half Hand shirt crafted with premium soft cotton blend.", price: 699.00, original_price: 979.00, image: "Shirts/half hand shirt 2.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.5, stock: 30, created_at: new Date() },
        { id: 135, name: "Kiskintha Striped Half Hand Shirt 4", description: "Kiskintha Striped Half Hand Shirt 4 from Kiskintha Mens Wear Shirts collection. Sleek dark-toned Half Hand shirt with stylish detailing for everyday smart casuals.", price: 749.00, original_price: 1049.00, image: "Shirts/half hand shirt 4.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.8, stock: 28, created_at: new Date() },
        { id: 136, name: "Kiskintha Azure Half Hand Shirt 5", description: "Kiskintha Azure Half Hand Shirt 5 from Kiskintha Mens Wear Shirts collection. Cool azure blue Half Hand shirt designed for effortless summer style and all-day comfort.", price: 799.00, original_price: 1119.00, image: "Shirts/half hand shirt 5.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.6, stock: 34, created_at: new Date() },
        { id: 137, name: "Kiskintha Modern Half Hand Shirt 3", description: "Kiskintha Modern Half Hand Shirt 3 from Kiskintha Mens Wear Shirts collection. Soft pastel shade Half Hand shirt with breathable texture and neat finishes.", price: 699.00, original_price: 979.00, image: "Shirts/half hand t shirt 3.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.4, stock: 36, created_at: new Date() },
        { id: 138, name: "Kiskintha Sunset Orange Half Hand Shirt", description: "Kiskintha Sunset Orange Half Hand Shirt from Kiskintha Mens Wear Shirts collection. Vibrant warm tone Half Hand shirt with comfortable fit and premium touch.", price: 649.00, original_price: 899.00, image: "Shirts/orange shirt half hand.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Red", rating: 4.6, stock: 42, created_at: new Date() },
        { id: 139, name: "Kiskintha Selve Style Half Hand Shirt", description: "Kiskintha Selve Style Half Hand Shirt from Kiskintha Mens Wear Shirts collection. Trendy Half Hand collar shirt with contrast sleeve accents and durable stitching.", price: 599.00, original_price: 839.00, image: "Shirts/shirt selve t shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.5, stock: 40, created_at: new Date() },
        { id: 140, name: "Kiskintha Sunshine Yellow Half Hand Shirt", description: "Kiskintha Sunshine Yellow Half Hand Shirt from Kiskintha Mens Wear Shirts collection. Bright and lively yellow Half Hand shirt for relaxed outings and casual wear.", price: 649.00, original_price: 899.00, image: "Shirts/yellow half hand shirt.jpg", category_id: 2, category_name: "Shirts", subcategory: "Casual Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Yellow", rating: 4.7, stock: 35, created_at: new Date() },
        { id: 141, name: "Kiskintha Brown Full Hand T Shirt", description: "Kiskintha Brown Full Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Full sleeve premium cotton crewneck T-shirt in rich brown shade.", price: 599.00, original_price: 839.00, image: "T-Shirts/brown t shirt full hand.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.5, stock: 45, created_at: new Date() },
        { id: 142, name: "Kiskintha Contrast Full Hand T Shirt 3", description: "Kiskintha Contrast Full Hand T Shirt 3 from Kiskintha Mens Wear T-Shirts collection. Full Hand T-shirt with contrast sleeve design in soft premium cotton.", price: 649.00, original_price: 899.00, image: "T-Shirts/full hand shirt 3.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "White", rating: 4.7, stock: 38, created_at: new Date() },
        { id: 143, name: "Kiskintha Midnight Black Full Hand T Shirt 1", description: "Kiskintha Midnight Black Full Hand T Shirt 1 from Kiskintha Mens Wear T-Shirts collection. Solid black Full Hand T-shirt offering sleek minimalist looks and maximum comfort.", price: 599.00, original_price: 839.00, image: "T-Shirts/full hand t shirt 1.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.8, stock: 50, created_at: new Date() },
        { id: 144, name: "Kiskintha Charcoal Full Hand T Shirt 6", description: "Kiskintha Charcoal Full Hand T Shirt 6 from Kiskintha Mens Wear T-Shirts collection. Full Hand T-shirt in versatile charcoal grey crafted from stretchable ribbed cotton.", price: 649.00, original_price: 899.00, image: "T-Shirts/full hand t shirt 6.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Grey", rating: 4.6, stock: 36, created_at: new Date() },
        { id: 145, name: "Kiskintha Navy Full Hand T Shirt 5", description: "Kiskintha Navy Full Hand T Shirt 5 from Kiskintha Mens Wear T-Shirts collection. Deep navy blue Full Hand T-shirt with comfortable ribbed cuffs and tailored fit.", price: 649.00, original_price: 899.00, image: "T-Shirts/full hand t shirt5.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.7, stock: 42, created_at: new Date() },
        { id: 146, name: "Kiskintha Olive Green Full Hand T Shirt", description: "Kiskintha Olive Green Full Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Full Hand T-shirt in subtle olive green shade with superior stitching.", price: 599.00, original_price: 839.00, image: "T-Shirts/greeen t shirt full hand.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.5, stock: 40, created_at: new Date() },
        { id: 147, name: "Kiskintha Rose Pink Full Hand T Shirt", description: "Kiskintha Rose Pink Full Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Soft pink Full Hand T-shirt made with breathable combed cotton fabric.", price: 599.00, original_price: 839.00, image: "T-Shirts/pink full hand t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Full Hand", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.6, stock: 32, created_at: new Date() },
        { id: 148, name: "Kiskintha Ocean Blue Half Hand T Shirt", description: "Kiskintha Ocean Blue Half Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Premium quality Half Hand regular fit T-shirt in refreshing ocean blue.", price: 499.00, original_price: 699.00, image: "T-Shirts/blue t shirt  half hand.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Blue", rating: 4.5, stock: 45, created_at: new Date() },
        { id: 149, name: "Kiskintha Earth Brown Half Hand T Shirt", description: "Kiskintha Earth Brown Half Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Half Hand round neck T-shirt in rich earth brown tone with soft hand feel.", price: 499.00, original_price: 699.00, image: "T-Shirts/brown shirt  half hand.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.4, stock: 38, created_at: new Date() },
        { id: 150, name: "Kiskintha Classic Brown Half Hand T Shirt", description: "Kiskintha Classic Brown Half Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Durable Half Hand casual T-shirt designed for everyday versatility.", price: 499.00, original_price: 699.00, image: "T-Shirts/brown t shirt half hand.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Brown", rating: 4.6, stock: 40, created_at: new Date() },
        { id: 151, name: "Kiskintha Forest Green Half Hand T Shirt", description: "Kiskintha Forest Green Half Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Deep green Half Hand cotton T-shirt with comfortable ribbed collar.", price: 499.00, original_price: 699.00, image: "T-Shirts/green t shirt half hand.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Green", rating: 4.7, stock: 44, created_at: new Date() },
        { id: 152, name: "Kiskintha Pastel Pink Half Hand T Shirt", description: "Kiskintha Pastel Pink Half Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Light pink Half Hand T-shirt in breathable lightweight cotton fabric.", price: 499.00, original_price: 699.00, image: "T-Shirts/pink half hand t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Pink", rating: 4.5, stock: 36, created_at: new Date() },
        { id: 153, name: "Kiskintha Vibrant Yellow Half Hand T Shirt", description: "Kiskintha Vibrant Yellow Half Hand T Shirt from Kiskintha Mens Wear T-Shirts collection. Energetic yellow Half Hand T-shirt offering a trendy summer look.", price: 499.00, original_price: 699.00, image: "T-Shirts/yellow t shirt half hand.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Yellow", rating: 4.6, stock: 35, created_at: new Date() },
        { id: 154, name: "Kiskintha Floral Print Black T Shirt", description: "Kiskintha Floral Print Black T Shirt from Kiskintha Mens Wear T-Shirts collection. Modern black Half Hand graphic floral T-shirt with premium color fastness.", price: 549.00, original_price: 769.00, image: "T-Shirts/black floral t shirt.jpg", category_id: 1, category_name: "T-Shirts", subcategory: "Casual T-Shirts", sleeve_type: "Half Hand", size: "S,M,L,XL,XXL", color: "Black", rating: 4.8, stock: 50, created_at: new Date() }
    ],
    orders: [],
    order_items: []
};

// Force in-memory engine to guarantee 100% reliable execution
let useFallback = true;

// Custom query router that runs on memoryStore
const smartPool = {
    async query(sql, params = []) {
        const cleanSql = sql.trim().toUpperCase();

        // ORDER_ITEMS
        if (cleanSql.includes('SELECT') && cleanSql.includes('FROM ORDER_ITEMS')) {
            let list = memoryStore.order_items.map(oi => {
                const p = memoryStore.products.find(prod => prod.id == oi.product_id);
                const cat = p ? memoryStore.categories.find(c => c.id == p.category_id) : null;
                return {
                    ...oi,
                    product_name: oi.product_name || (p ? p.name : 'Kiskintha Apparel Item'),
                    image: oi.image || (p ? p.image : ''),
                    color: oi.color || (p ? p.color : 'Assorted'),
                    category_name: p ? (p.category_name || (cat ? cat.name : 'Men Wear')) : 'Men Wear',
                    category_id: p ? p.category_id : 1
                };
            });
            if (cleanSql.includes('WHERE ORDER_ID =') || cleanSql.includes('ORDER_ID = ?') || cleanSql.includes('WHERE OI.ORDER_ID =')) {
                list = list.filter(oi => oi.order_id == params[0]);
            }
            return [list, []];
        }

        // ORDERS
        if (cleanSql.includes('SELECT') && (cleanSql.includes('FROM ORDERS') || cleanSql.includes('FROM ORDERS O'))) {
            if (cleanSql.includes('COUNT(*)')) {
                let count = memoryStore.orders.length;
                if ((cleanSql.includes('WHERE USER_ID =') || cleanSql.includes('WHERE O.USER_ID =')) && params.length > 0) {
                    count = memoryStore.orders.filter(o => o.user_id == params[0]).length;
                }
                return [[{ count, total: count }], []];
            }

            if (cleanSql.includes('SUM(TOTAL)') || cleanSql.includes('SUM(')) {
                const totalSum = memoryStore.orders
                    .filter(o => o.status !== 'Cancelled' && !o.status.includes('Reject'))
                    .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                return [[{ total: totalSum }], []];
            }

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

            // Dynamic filter matching
            if (params.length > 0) {
                params.forEach(param => {
                    if (typeof param === 'string' && param.includes('%')) {
                        const searchTerm = param.replace(/%/g, '').toLowerCase();
                        list = list.filter(p =>
                            (p.name && p.name.toLowerCase().includes(searchTerm)) ||
                            (p.description && p.description.toLowerCase().includes(searchTerm)) ||
                            (p.subcategory && p.subcategory.toLowerCase().includes(searchTerm)) ||
                            (p.color && p.color.toLowerCase().includes(searchTerm))
                        );
                    } else if (typeof param === 'string' && (param === 'Full Hand' || param === 'Half Hand')) {
                        list = list.filter(p => p.sleeve_type === param);
                    } else if (typeof param === 'string' && ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Brown', 'Grey', 'Multi', 'Sandal'].some(c => c.toLowerCase() === param.toLowerCase())) {
                        list = list.filter(p => p.color && p.color.toLowerCase() === param.toLowerCase());
                    } else if (!isNaN(Number(param))) {
                        const catId = Number(param);
                        if ([1, 2, 3, 4, 7, 8].includes(catId)) {
                            list = list.filter(p => p.category_id == catId);
                        }
                    }
                });
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
                sleeve_type: params[7] || '',
                color: params[8] || 'Assorted',
                created_at: new Date()
            };
            memoryStore.products.unshift(newProd);
            return [{ insertId: newProd.id, affectedRows: 1 }, []];
        }

        if (cleanSql.includes('UPDATE PRODUCTS SET PRICE =') || cleanSql.includes('UPDATE PRODUCTS SET PRICE=?')) {
            const prod = memoryStore.products.find(p => p.id == params[1]);
            if (prod) {
                prod.price = parseFloat(params[0]);
                return [{ affectedRows: 1 }, []];
            }
            return [{ affectedRows: 0 }, []];
        }

        if (cleanSql.includes('UPDATE PRODUCTS SET')) {
            const prod = memoryStore.products.find(p => p.id == params[params.length - 1]);
            if (prod) {
                if (params.length >= 7) {
                    prod.name = params[0];
                    prod.description = params[1];
                    prod.price = parseFloat(params[2]);
                    prod.image = params[3] || prod.image;
                    prod.category_id = parseInt(params[4]);
                    prod.size = params[5];
                    prod.stock = parseInt(params[6]);
                } else if (params.length === 2) {
                    prod.price = parseFloat(params[0]);
                }
            }
            return [{ affectedRows: 1 }, []];
        }

        if (cleanSql.includes('DELETE FROM PRODUCTS')) {
            const idx = memoryStore.products.findIndex(p => p.id == params[0]);
            if (idx !== -1) {
                memoryStore.products.splice(idx, 1);
                return [{ affectedRows: 1 }, []];
            }
            return [{ affectedRows: 0 }, []];
        }

        // INSERT ORDER
        if (cleanSql.includes('INSERT INTO ORDERS')) {
            const newOrder = {
                id: memoryStore.orders.length + 1,
                user_id: params[0],
                total: parseFloat(params[1]),
                address: params[2],
                phone: params[3],
                payment_method: params[4] || 'Cash on Delivery (COD)',
                status: params[5] || 'Pending',
                created_at: new Date()
            };
            memoryStore.orders.unshift(newOrder);
            return [{ insertId: newOrder.id, affectedRows: 1 }, []];
        }

        // INSERT ORDER_ITEMS
        if (cleanSql.includes('INSERT INTO ORDER_ITEMS')) {
            const newItem = {
                id: memoryStore.order_items.length + 1,
                order_id: params[0],
                product_id: params[1],
                quantity: parseInt(params[2]) || 1,
                price: parseFloat(params[3]),
                size: params[4] || 'M',
                color: params[5] || '',
                product_name: params[6] || '',
                image: params[7] || ''
            };
            memoryStore.order_items.push(newItem);
            return [{ insertId: newItem.id, affectedRows: 1 }, []];
        }

        // UPDATE ORDERS STATUS
        if (cleanSql.includes('UPDATE ORDERS SET STATUS')) {
            const order = memoryStore.orders.find(o => o.id == params[1]);
            if (order) {
                order.status = params[0];
                return [{ affectedRows: 1 }, []];
            }
            return [{ affectedRows: 0 }, []];
        }

        return [[], []];
    }
};

module.exports = smartPool;
module.exports.memoryStore = memoryStore;
