"use client"

import { Products } from "@/type-db"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { Heart, HeartCrack, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface PopularProductsProps {
    data: Products
}
export const PopularProducts = ({ data }: PopularProductsProps) => {

    const [isLiked,setIsLiked] = useState(false)
    const IsLikedIcon = isLiked ? Heart : HeartCrack
    return (
        <Card className="w-full max-h-[340px] rounded-md bg-white shadow-lg border-none flex flex-col items-center justify-center relative py-6 pt-24 md:pt-36">
            <div className="absolute -top-[4%] md:-top-[20%] overflow-hidden w-24 md:w-40 h-24 md:h-40 rounded-full bg-hero 
            flex items-center justify-center p-1 md:p-2">
                <div className=" w-full h-full rounded-full bg-white relative">

                    <Image
                        className="w-full h-full object-contain"
                        fill
                        alt={data.name}
                        src={data.images[0].url}
                    />
                </div>
            </div>
            <Link
                href={`/menu/${data.id}`}
                className="w-full px-2 text-center"
            >
                <CardTitle className="text-neutral-700 truncate w-full"> {data.name} </CardTitle>
            </Link>
            <div className="w-full flex items-center justify-center gap-2 flex-wrap px-2 mt-4">
                {data.cuisine && (
                    <div className="rounded-md bg-emerald-50 px-2 p-y-[2px] text-[10px] font-semibold capitalize">
                        {data.cuisine}
                    </div>
                )}
                {data.category && (
                    <div className="rounded-md bg-blue-50 px-2 p-y-[2px] text-[10px] font-semibold capitalize">
                        {data.category}
                    </div>
                )}


                {data.size && (
                    <div className="rounded-md bg-yellow-50 px-2 p-y-[2px] text-[10px] font-semibold capitalize">
                        {data.size}
                    </div>
                )}
                {data.kitchen && (
                    <div className="rounded-md bg-yellow-50 px-2 p-y-[2px] text-[10px] font-semibold capitalize">
                        {data.kitchen}
                    </div>
                )}
            </div>
            <CardDescription className="text-center px-2 my-2">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit autem quos ut!
            </CardDescription>

            <div className="w-full flex items-center px-2 mt-4 gap-3">
                <Button className="rounded-full font-bold text-lg text-muted-foreground" variant={"outline"}>
                    ${data.price}
                </Button>
                <Link
                    href={`/menu/${data.id}`}
                    className="w-full"
                >
                    <Button className="bg-hero w-full rounded-full"> Buy now</Button>
                </Link>
            </div>
            <Button className="absolute top-0 right-0 rounded-tl-none rounded-tr-lg rounded-br-none p-2 px-3">
                <ShoppingCart
                    className="w-4 h-4"
                />
            </Button>
            <Button onClick={() => setIsLiked(prev => !prev)} variant={"ghost"} className="absolute top-0 left-0 rounded-tl-none rounded-tr-lg rounded-br-none p-2 px-3">             
                <IsLikedIcon
                className={`w-5 h-5 ${isLiked ? "text-red-600" : "text-black"}`}
                />
            </Button>
        </Card>
    )
}