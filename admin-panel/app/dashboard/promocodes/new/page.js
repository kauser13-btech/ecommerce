'use client';

import PromoCodeForm from '../../../components/PromoCodeForm';

export default function NewPromoCodePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <PromoCodeForm isEdit={false} />
        </div>
    );
}
