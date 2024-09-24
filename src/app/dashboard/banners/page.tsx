'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function BannersPage() {
  return (
    <section className="flex justify-center items-center flex-1">
      <section className="relative flex flex-col items-center w-[500px]">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={() => console.log('Mudei de slide')}
          onSwiper={(swiper) => console.log(swiper)}
          className="w-full"
        >
          {[1, 2, 3, 4].map((index) => (
            <SwiperSlide key={index}>
              <section className="bg-white w-full h-[300px] flex justify-center items-center text-black">
                Slide {index}
              </section>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </section>
  )
}
