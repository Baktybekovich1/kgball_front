import React, { useRef } from 'react';

import { SwiperNavigationButtons } from "~shared/ui/SwiperNavigationButtons";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import football from "~shared/assets/img/football2.webp"



export const HomeSwiper: React.FC = () => {
  const swiperRef = useRef(null);
  
  const images = [
    football,
    football,
    football,
  ];
  
  return (
    <>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1.2}
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 500,
          disableOnInteraction: false
        }}
        navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          1048: { slidesPerView: 1.4 },
        }}
        className="rounded-2xl shadow-lg"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-[400px] w-full">
                <img
                  src={src}
                  alt=''
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      <SwiperNavigationButtons
        onPrev={() => swiperRef.current?.slidePrev()}
        onNext={() => swiperRef.current?.slideNext()}
      />
    </>
  );
};

