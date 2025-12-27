import React, { useCallback, useRef } from 'react';
import * as backgrounds from "../data/backgrounds";
import { useSelector } from "react-redux";
import { Link } from 'react-router';

function ModelCard(props) {

  const { title, description, token, path, background, backgroundType, subtitle, id } = props;
  const user = useSelector(state => state.users.user);

  const videoRef = useRef(null);

  const play = useCallback(() => {
    try {
      const video = videoRef.current;
      if (!video) return;
      video.muted = true;
      video.currentTime = 0;
      video.play();
    } catch (e) {
      console.error(e)
    }
  }, [])

  const pause = useCallback(() => {
    try {
      const video = videoRef.current;
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    } catch (e) {
      console.error(e)
    }
  }, [])

  if (backgroundType === 'image') {
    return (
      <Link to={user.role !== 'admin' && user.tokens < token ? '' : `${path}/${id}`}>
        <div
          className="group relative flex aspect-[4/3] cursor-pointer flex-col items-start justify-end overflow-hidden rounded-2xl border border-default-100 transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110">
            <img alt="" loading="lazy" width="480" height="360" decoding="async" data-nimg="1"
                 className="h-full w-full object-cover"
                 srcSet={backgrounds[background]}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
          </div>
          <div
            className="relative flex w-full flex-col items-start justify-end px-4 py-2.5 transition duration-100 group-hover:-translate-y-4 group-hover:opacity-0">
            <div className="flex w-full items-center justify-start"><span
              className="text-xs font-medium text-gray-100">{subtitle}</span></div>
            <h3 className="mb-1 text-base font-semibold text-gray-50">{title}</h3>
            <div className="mb-2 flex w-full flex-col gap-1 rounded-lg bg-gray-50/10 p-2">
              <div className="flex w-full items-center gap-1"><span
                className="text-[10px] font-medium uppercase text-gray-400">{`${token} токенов за генерацию`}</span>
              </div>
            </div>
            {/*<div className="relative w-full">*/}
            {/*  <div className="flex gap-1.5 overflow-hidden"><span*/}
            {/*    className="flex-shrink-0 whitespace-nowrap rounded border border-gray-100/10 bg-gray-100/20 px-2 py-0.5 text-xs font-medium text-gray-200 backdrop-blur-sm">Text to Image</span><span*/}
            {/*    className="flex-shrink-0 whitespace-nowrap rounded border border-gray-100/10 bg-gray-100/20 px-2 py-0.5 text-xs font-medium text-gray-200 backdrop-blur-sm">Image to Image</span><span*/}
            {/*    className="flex-shrink-0 whitespace-nowrap rounded border border-gray-100/10 bg-gray-100/20 px-2 py-0.5 text-xs font-medium text-gray-200 backdrop-blur-sm">Image Editing</span>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          <div
            className="absolute inset-x-0 bottom-0 flex w-full translate-y-6 flex-col items-start justify-end px-4 py-2.5 opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex w-full items-center justify-between"><span
              className="text-xs font-medium text-gray-100">{subtitle}</span></div>
            <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-50">{title}</h3><p
            className="mb-1 line-clamp-2 text-xs leading-relaxed text-gray-100">{description}</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={user.role !== 'admin' && user.tokens < token ? '' : `${path}/${id}`}>
      <div
        onMouseEnter={play}
        onMouseLeave={pause}
        className="group relative flex aspect-[4/3] cursor-pointer flex-col items-start justify-end overflow-hidden rounded-2xl border border-default-100 transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110">
          <video
            muted
            ref={videoRef}
            src={backgrounds[background]}
            className="h-full w-full object-cover"
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
        </div>
        <div
          className="relative flex w-full flex-col items-start justify-end px-4 py-2.5 transition duration-100 group-hover:-translate-y-4 group-hover:opacity-0">
          <div className="flex w-full items-center justify-start"><span
            className="text-xs font-medium text-gray-100">{subtitle}</span></div>
          <h3 className="mb-1 text-base font-semibold text-gray-50">{title}</h3>
          <div className="mb-2 flex w-full flex-col gap-1 rounded-lg bg-gray-50/10 p-2">
            <div className="flex w-full items-center gap-1"><span
              className="text-[10px] font-medium uppercase text-gray-400">{`${token} токенов за генерацию`}</span></div>
          </div>
          {/*<div className="relative w-full">*/}
          {/*  <div className="flex gap-1.5 overflow-hidden"><span*/}
          {/*    className="flex-shrink-0 whitespace-nowrap rounded border border-gray-100/10 bg-gray-100/20 px-2 py-0.5 text-xs font-medium text-gray-200 backdrop-blur-sm">Text to Video</span><span*/}
          {/*    className="flex-shrink-0 whitespace-nowrap rounded border border-gray-100/10 bg-gray-100/20 px-2 py-0.5 text-xs font-medium text-gray-200 backdrop-blur-sm">Image to Video</span>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
        <div
          className="absolute inset-x-0 bottom-0 flex w-full translate-y-6 flex-col items-start justify-end px-4 py-2.5 opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex w-full items-center justify-between"><span
            className="text-xs font-medium text-gray-100">{subtitle}</span></div>
          <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-50">{title}</h3><p
          className="mb-1 line-clamp-2 text-xs leading-relaxed text-gray-100">{description}</p>
        </div>
      </div>
    </Link>
  )


}

export default ModelCard;
