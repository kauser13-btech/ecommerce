'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";

export default function HeroSlider({ offers }) {
    if (!offers || offers.length === 0) return null;

    return (
        <div className="h-full w-full min-h-[350px] md:min-h-[450px] lg:min-h-[600px] rounded-2xl overflow-hidden relative group">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade, Navigation]}
                effect="fade"
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="h-full w-full"
            >
                {offers.map((offer) => {
                    const href = offer.product ? `/products/${offer.product.slug}` : '#';
                    const isLink = !!offer.product;

                    const SlideContent = (
                        <div className="block h-full w-full relative group overflow-hidden">
                            {offer.image ? (
                                <Image
                                    src={offer.image}
                                    alt={offer.title}
                                    fill
                                    className="object-cover transition-transform duration-700"
                                    priority
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                    );

                    return (
                        <SwiperSlide key={offer.id} className="relative h-full w-full bg-black">
                            {isLink ? (
                                <Link href={href}>{SlideContent}</Link>
                            ) : (
                                SlideContent
                            )}
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="swiper-button-prev !text-black !w-12 !h-8 !bg-white/80 !rounded-full !shadow-xl !after:content-none flex justify-center items-center hover:!bg-gray-50 transition-colors">
                <ArrowLeftIcon className="p-3 w-4 h-4" />
            </div>
            <div className="swiper-button-next !text-black !w-12 !h-8 !bg-white/80 !rounded-full !shadow-xl !after:content-none flex justify-center items-center hover:!bg-gray-50 transition-colors">
                <ArrowRightIcon className="p-3 w-4 h-4" />
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                .swiper-pagination-bullet {
                background: white;
                opacity: 0.5;
                }
                .swiper-pagination-bullet-active {
                background: #ececec8a;
                opacity: 1;
                width: 24px;
                border-radius: 4px;
                transition: width 0.3s;
                }
            `}</style>
        </div>
    );
}
