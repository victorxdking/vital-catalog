import React from "react";

interface BannerVideoProps {
  fullScreen?: boolean;
}

const BannerVideo: React.FC<BannerVideoProps> = ({ fullScreen = false }) => (
  <div className={fullScreen ? "w-full h-screen overflow-hidden relative" : "w-full h-64 md:h-96 overflow-hidden relative"}>
    <video
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      src="/vital 1.mp4"
    />
    <div className="absolute inset-0 bg-[#183263] bg-opacity-60 pointer-events-none"></div>
  </div>
);

export default BannerVideo; 