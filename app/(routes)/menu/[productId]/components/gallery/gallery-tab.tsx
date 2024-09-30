"use client"

import Image from "next/image"

interface GalleryTabProps{
    url:string
}
const GalleryTab = ({url} : GalleryTabProps) => {
  return (
    <div className="w-24 h-24 aspect-square sm:rounded-lg overflow-hidden relative">
      <Image
        src={url}
        alt={url}
        className="w-full h-full object-contain"
        fill
      />
    </div>
  )
}

export default GalleryTab
