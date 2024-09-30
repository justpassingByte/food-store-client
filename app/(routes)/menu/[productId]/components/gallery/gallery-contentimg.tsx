"use client";

import Image from "next/image";

interface GalleryContentImageProps {
  url: string;
}

const GalleryContentImage = ({ url }: GalleryContentImageProps) => {
  return (
    <div className="w-full max-w-[400px] max-h-[400px] sm:rounded-lg overflow-hidden flex justify-center items-center">
      <Image
        src={url}
        alt={url}
        width={300}
        height={300}
        className="object-contain w-full h-full"
      />
    </div>
  );
};

export default GalleryContentImage;
