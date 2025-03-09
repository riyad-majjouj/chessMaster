
import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

const SplineScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<LoadingFallback />}>
        <Spline 
          scene="https://prod.spline.design/yP7rOxi-KK5cDtRx/scene.splinecode"
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      <p className="mt-4 text-gold">Loading 3D scene...</p>
    </div>
  </div>
);

export default SplineScene;
