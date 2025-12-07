'use client';

import { useEffect, useState } from 'react';
import PromoCodeForm from '../../../components/PromoCodeForm';
import api from '../../../lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

export default function EditPromoCodePage() {
    const params = useParams();
    const [promoCode, setPromoCode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromoCode = async () => {
            try {
                const response = await api.get(`/promocodes/${params.id}`);
                setPromoCode(response.data);
            } catch (error) {
                console.error('Error fetching promo code:', error);
                toast.error('Failed to load promo code');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPromoCode();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!promoCode) {
        return <div className="text-center py-12 text-gray-500">Promo code not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <PromoCodeForm initialData={promoCode} isEdit={true} />
        </div>
    );
}
