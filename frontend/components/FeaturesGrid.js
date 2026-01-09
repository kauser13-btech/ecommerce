// app/components/FeaturesGrid.jsx

const FeatureCard = ({ iconSrc, iconAlt, title, description }) => {
    return (
        <div
            className="flex flex-col items-center text-center p-5 border border-gray-300 rounded-xl overflow-hidden w-full md:w-1/4"
        >
            <div className="flex flex-col items-center justify-center w-full gap-3">
                <div className="flex justify-center items-center gap-1">
                    <img
                        src={iconSrc}
                        alt={iconAlt}
                        className="w-12 h-12"
                        width="50"
                        height="50"
                    />
                </div>
                <p className="font-bold text-lg"><strong>{title}</strong></p>
            </div>
        </div>
    );
};

export default function FeaturesGrid() {
    const features = [
        {
            iconSrc: "//digital-world-shop.myshopify.com/cdn/shop/files/payment.gif?v=1752584280&width=1200",
            iconAlt: "Safe Payment Icon",
            title: "36 Months Installments"
        },
        {
            iconSrc: "//digital-world-shop.myshopify.com/cdn/shop/files/truck_1.gif?v=1752584523&width=1200",
            iconAlt: "Worldwide Delivery Icon",
            title: "Fastest Home Delivery"
        },
        {
            iconSrc: "//digital-world-shop.myshopify.com/cdn/shop/files/helpdesk.gif?v=1752584612&width=1200",
            iconAlt: "24/7 Help Center Icon",
            title: "After Sell Service"
        },
        {
            iconSrc: "//digital-world-shop.myshopify.com/cdn/shop/files/discount.gif?v=1752584707&width=1200",
            iconAlt: "Daily Promotion Icon",
            title: "Best Price in Bangladesh"
        },
    ];

    return (
        <div
            className="max-w-7xl mt-8 mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8"
            style={{ gap: 'max(24px, calc(1.0 * 30px))' }}
        >
            {features.map((feature, index) => (
                <FeatureCard
                    key={index}
                    iconSrc={feature.iconSrc}
                    iconAlt={feature.iconAlt}
                    title={feature.title}
                    description={feature.description}
                />
            ))}
        </div>
    );
}