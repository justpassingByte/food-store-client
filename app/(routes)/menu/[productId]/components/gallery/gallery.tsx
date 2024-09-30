"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import GalleryContentImage from "./gallery-contentimg";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
    images: {
        url: string;
    }[];
}

const Gallery = ({ images }: GalleryProps) => {
    if (!images || images.length === 0) {
        return <div>No images available</div>; 
    }
    console.log("image: " ,images);
    
    return (
        <Tabs defaultValue={images[0].url} className="w-full">
            {images.map(tab =>(
                <TabsContent key={tab.url} value={tab.url.toString()}>
                    <GalleryContentImage url={tab.url}/>
                </TabsContent>
            ))}
           
            <TabsList className="bg-transparent w-auto pt-24 pl-12">
            {images.map((tab) => (
                <TabsTrigger key={tab.url} value={tab.url.toString()}>
                    <GalleryTab url={tab.url} />
                </TabsTrigger>
               
            ))}
            </TabsList>
            
            
        </Tabs>
    );
};

export default Gallery;
