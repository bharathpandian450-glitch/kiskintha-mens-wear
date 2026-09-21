// Utility for formatting customer-facing category and subcategory badges
export const getProductBadge = (product) => {
    if (!product) return 'Men Wear';
    const isPant = Number(product.category_id) === 3 || 
                   Number(product.category_id) === 4 || 
                   /pant|trouser/i.test(product.category_name || '') ||
                   /pant|trouser/i.test(product.subcategory || '');

    if (isPant) {
        const sub = (product.subcategory || '').toLowerCase();
        const name = (product.name || '').toLowerCase();

        // Check for Cotton Pants
        if (sub.includes('cotton') || name.includes('cotton')) {
            return 'Cotton';
        }
        // Check for Baggy / Jeans / Cargo Pants
        if (sub.includes('baggy') || name.includes('baggy') || sub.includes('cargo') || name.includes('cargo') || sub.includes('jeans') || name.includes('jeans') || name.includes('wide leg') || name.includes('packet')) {
            return 'Baggy';
        }
        // Check for Formal Pants / Formal Trousers
        if (sub.includes('formal') || name.includes('formal') || name.includes('suit') || name.includes('gurka') || name.includes('touser') || name.includes('trouser') || Number(product.category_id) === 4) {
            return 'Formal';
        }
        return 'Formal';
    }

    return product.subcategory || product.category_name || 'Men Wear';
};
