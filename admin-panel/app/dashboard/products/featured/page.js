'use client';

import SortableProductList from '../components/SortableProductList';

export default function FeaturedProductsPage() {
    return (
        <SortableProductList
            title="Featured Products"
            type="featured"
            fetchEndpoint="/products/featured"
        />
    );
}
