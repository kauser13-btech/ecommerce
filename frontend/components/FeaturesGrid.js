// app/components/FeaturesGrid.jsx

const FeatureCard = ({ iconSrc, iconAlt, title, description }) => {
    return (
        <div
            className="flex flex-col items-center text-center p-5 border border-gray-300 rounded-xl overflow-hidden w-full h-full"
        >
            <div className="flex flex-col items-center justify-center w-full gap-3 h-full">
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
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
        </div>
    );
};

export default function FeaturesGrid() {
    const features = [
        {
            iconSrc: "gifs/payment.gif",
            iconAlt: "Safe Payment Icon",
            title: "36 Months Installments"
        },
        {
            iconSrc: "gifs/truck_1.gif",
            iconAlt: "Worldwide Delivery Icon",
            title: "Fastest Home Delivery"
        },
        {
            iconSrc: "gifs/helpdesk.gif",
            iconAlt: "24/7 Help Center Icon",
            title: "After Sell Service"
        },
        {
            iconSrc: "gifs/discount.gif",
            iconAlt: "Daily Promotion Icon",
            title: "Best Price in Bangladesh"
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
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