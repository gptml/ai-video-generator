import { useState, useEffect } from "react";
import * as backgrounds from "../data/backgrounds";


export default function HeroCarousel({ models }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => (
      setIndex((i) => (i + 1) % models.lengqth)
    ), 5000);
    return () => clearInterval(timer);
  }, [models, index]);

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 flex flex-wrap mb-10">

      <div className="relative w-full h-[320px] overflow-hidden rounded-3xl ">

        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {models.map((slide, i) => (
            <div
              key={i}
              className="relative w-full h-full flex-shrink-0"
            >
              <img
                src={backgrounds[slide.background]}
                className="absolute inset-0 w-full h-full object-cover"
                alt=""
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              <div className="relative z-10 h-full flex flex-col justify-center px-10 max-w-2xl text-white">
                {/*<div className="flex gap-2 mb-4">*/}
                {/*  {slide.tags.map((tag) => (*/}
                {/*    <span*/}
                {/*      key={tag}*/}
                {/*      className="px-4 py-1 text-sm rounded-full border border-white/30 bg-white/10"*/}
                {/*    >*/}
                {/*    {tag}*/}
                {/*  </span>*/}
                {/*  ))}*/}
                {/*</div>*/}

                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>

                <p className="text-white/80 mb-6">
                  {slide.description}
                </p>


              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            setIndex((index - 1 + models.length) % models.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
        >
          ‹
        </button>

        <button
          onClick={() => setIndex((index + 1) % models.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
        >
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {models.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
