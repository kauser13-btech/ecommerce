'use client';

import SortableProductList from '../components/SortableProductList';

export default function NewArrivalsPage() {
    return (
        <SortableProductList
            title="New Arrivals"
            type="new"
            fetchEndpoint="/products/new-arrivals"
        />
    );
}
