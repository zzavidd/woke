/* eslint-disable import/order */
import React from 'react';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';

/**
 * Constants for Cloudinary lazy transformations.
 * Size: s = small, m = medium
 * Shape: s = square, w = wide
 */
export const TRANSFORMATIONS = {
  ss: { width: 400, height: 400 },
  sw: { width: 640, height: 360 },
  ms: { width: 800, height: 800 },
  mw: { width: 1280, height: 720 }
};

export const CloudinaryImage = ({
  alt,
  className,
  lazy,
  ref,
  src,
  title
}) => {
  if (!src) return null;
  const { width, height } = lazy ? TRANSFORMATIONS[lazy] : {};
  return (
    <CloudinaryContext cloudName={'wokeweekly'} className={className}>
      <Image publicId={src} alt={alt} title={title} width={'100%'} ref={ref}>
        <Transformation width={width} height={height} crop={'scale'} />
      </Image>
    </CloudinaryContext>
  );
};
