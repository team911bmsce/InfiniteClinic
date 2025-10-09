import React from 'react';

type PreloaderProps = {
  logoRef: React.RefObject<HTMLHeadingElement | null>;
};


const Preloader: React.FC<PreloaderProps> = ({ logoRef }) => {
  return (
    <div className="bg-white h-screen flex items-center justify-center">
      <h1 ref={logoRef} className="text-5xl font-bold text-black">
        Infinite Clinic
      </h1>
    </div>
  );
};

export default Preloader;
