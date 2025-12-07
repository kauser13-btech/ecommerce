'use client';

import { useEffect, useState } from 'react';
import ProductForm from '../../../components/ProductForm';
import api from '../../../lib/api';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id);
        }
    }, [params.id]);

    const fetchProduct = async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
}
