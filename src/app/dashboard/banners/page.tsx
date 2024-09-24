'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
// import 'swiper/css/navigation'
import '../../../styles/global.css'
import { ArrowFatLeft, ArrowFatRight } from '@phosphor-icons/react'

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
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
          }}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
        >
          {[1, 2, 3, 4].map((index) => (
            <SwiperSlide key={index}>
              <section className="bg-white w-full h-[300px] flex justify-center items-center text-black">
                Slide {index}
              </section>
            </SwiperSlide>
          ))}
        </Swiper>
        <section className="swiper-pagination absolute bottom-0 w-full flex justify-center mt-6" />
        <section className="swiper-button-prev absolute -left-6 top-1/2 transform -mt-4 -translate-y-1/2 z-10 cursor-pointer bg-emerald-600 p-4 rounded-full">
          <ArrowFatLeft size={20} />
        </section>
        <section className="swiper-button-next absolute -right-6 top-1/2 transform -mt-4 -translate-y-1/2 z-10 cursor-pointer bg-emerald-600 p-4 rounded-full">
          <ArrowFatRight size={20} />
        </section>
      </section>
    </section>
  )
}
