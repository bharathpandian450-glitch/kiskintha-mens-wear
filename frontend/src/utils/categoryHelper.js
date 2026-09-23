// Central Utility for Kiskintha Mens Wear Product Collections & Badges

export const getProductCollection = (product) => {
    if (!product) return 'Other';
    const catId = Number(product.category_id);
    const catName = (product.category_name || '').toLowerCase();
    const sub = (product.subcategory || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    const img = (product.image || '').toLowerCase();
    const baseImg = img.split('/').pop().split('\\').pop();

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

    // 4. Shirts (Regular Shirts)
    if ((catId === 2 || catName.includes('shirt') || name.includes('shirt')) && !/pant|trouser|touser/i.test(name)) {
        return 'Shirts';
    }

    // 5. PANTS: Any item with 'pant' in its name or image is STRICTLY A PANT (NEVER a Trouser!)
    if (/pant/i.test(name) || /pant/i.test(baseImg)) {
        if (sub.includes('cotton') || name.includes('cotton') || baseImg.includes('cotton')) return 'Cotton Pants';
        if (sub.includes('baggy') || name.includes('baggy') || sub.includes('cargo') || name.includes('cargo') || sub.includes('jeans') || name.includes('jeans') || name.includes('wide leg') || name.includes('packet') || baseImg.includes('jeans') || baseImg.includes('cargo')) return 'Baggy Pants';
        return 'Formal Pants';
    }

    // 6. TROUSERS: ONLY products where name or base image contains 'trouser', 'touser', or 'touoser' (and NOT pant)
    if (/trouser|touser|touoser/i.test(name) || /trouser|touser|touoser/i.test(baseImg)) {
        return 'Trousers';
    }

    // 7. Remaining Pants (e.g. Jeans, Model, Suit)
    if (catId === 3 || catId === 4 || /pant|jeans|suit/i.test(catName) || /jeans|baggy|cargo/i.test(sub)) {
        if (sub.includes('cotton') || name.includes('cotton')) return 'Cotton Pants';
        if (sub.includes('baggy') || name.includes('baggy') || /jeans|cargo|packet|model/i.test(name)) return 'Baggy Pants';
        return 'Formal Pants';
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
