import React from 'react';
import Image from 'next/image';

interface ComponentProps {
  width: number;
  height: number;
  altText: string;
}

export function FNLogo({width, height, altText}: ComponentProps): JSX.Element {
  return (
    <>
      <Image
        src="/images/FN_LOGO_final.svg"
        alt={altText}
        width={width}
        height={height}
      />
    </>
  );
}
