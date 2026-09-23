// Central Utility for Kiskintha Mens Wear Product Collections & Badges

export const getProductCollection = (product) => {
    if (!product) return 'Other';
    const catId = Number(product.category_id);
    const catName = (product.category_name || '').toLowerCase();
    const sub = (product.subcategory || '').toLowerCase();
    const name = (product.name || '').toLowerCase();

    // 1. Hoodies
    if (catId === 7 || catName.includes('hoodie') || name.includes('hoodie')) {
        return 'Hoodies';
    }

    // 2. Group Shirts
    if (catId === 8 || catName.includes('group') || sub.includes('group') || name.includes('group shirt')) {
        return 'Group Shirts';
    }

    // 3. T-Shirts
    if (catId === 1 || catName.includes('t-shirt') || catName.includes('tshirt') || name.includes('t-shirt') || name.includes('tshirt')) {
        return 'T-Shirts';
    }

    // 4. Trousers (Category 4 or name/category/subcategory matching trouser or touser)
    if (catId === 4 || catName.includes('trouser') || sub.includes('trouser') || /trouser|touser/i.test(name)) {
        return 'Trousers';
    }

    // 5. Pants (Formal, Cotton, Baggy)
    const isPant = catId === 3 || /pant/i.test(catName) || /pant/i.test(sub) || /pant/i.test(name);
    if (isPant) {
        if (sub.includes('cotton') || name.includes('cotton')) return 'Cotton Pants';
        if (sub.includes('baggy') || name.includes('baggy') || sub.includes('cargo') || name.includes('cargo') || sub.includes('jeans') || name.includes('jeans') || name.includes('wide leg') || name.includes('packet')) return 'Baggy Pants';
        return 'Formal Pants';
    }

    // 6. Shirts (Regular Shirts)
    if (catId === 2 || catName.includes('shirt') || name.includes('shirt')) {
        return 'Shirts';
    }

    return 'Other';
};

export const getProductBadge = (product) => {
    if (!product) return 'Men Wear';
    const collection = getProductCollection(product);
    if (collection === 'Trousers') return 'Trouser';
    if (collection === 'Cotton Pants') return 'Cotton';
    if (collection === 'Baggy Pants') return 'Baggy';
    if (collection === 'Formal Pants') return 'Formal';
    if (collection === 'Group Shirts') return 'Group Shirt';
    if (collection === 'T-Shirts') return 'T-Shirt';
    if (collection === 'Shirts') return 'Shirt';
    if (collection === 'Hoodies') return 'Hoodie';
    return product.subcategory || product.category_name || 'Men Wear';
};
