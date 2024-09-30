"use client"
import { Button } from "@/components/ui/button"
import useCarts from "@/hooks/usecart"
import { cn } from "@/lib/utils"
import { Products } from "@/type-db"
import { CookingPot, CreditCard, ShoppingCart, Soup, SquareActivity, Utensils } from "lucide-react"
import { useState } from "react"

interface InfoProps {
  product: Products
}
const Info = ({ product }: InfoProps) => {
  const [qty, setQty] = useState(1)
  const cart = useCarts()
  const handleQty = (num: number) => {
    setQty(num)
    cart.updateQuantity(product.id,num)
  }
  const addToCart = (data:Products)=>{
    cart.addItem({...data, qty:qty})
  }
  return (
    <div >
      <h1 className="text-3xl font-bold text-neutral-800"> {product.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-base text-left text-neutral-600">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint doloremque sed similique temporibus blanditiis qui, quaerat, culpa tenetur voluptate, dolor alias sunt iste! Quos ad doloremque, eius rem est enim?
        </p>
      </div>
      <div className="w-full flex items-center justify-start gap-2 flex-wrap px-4 py-4">
        {product.cuisine && (
          <div className="rounded-md bg-emerald-50 px-3 p-y-2 text-base font-semibold capitalize flex items-center gap-2">
            <CookingPot className="w-5 h-5" />
            {product.cuisine}
          </div>
        )}
        {product.category && (
          <div className="rounded-md bg-blue-50 px-3 p-y-2 text-base font-semibold capitalize flex items-center gap-2">
            <Soup className="w-5 h-5" />
            {product.category}
          </div>
        )}


        {product.size && (
          <div className="rounded-md bg-yellow-50 px-3 p-y-2 text-base font-semibold capitalize flex items-center gap-2">
            <SquareActivity className="w-5 h-5" />
            {product.size}
          </div>
        )}
        {product.kitchen && (
          <div className="rounded-md bg-yellow-50 px-3 p-y-3 text-base font-semibold capitalize flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            {product.kitchen}
          </div>
        )}
      </div>
      <div className="w-full grid grid-cols-4 my-12">
        <div className=" col-span-1 space-y-8">
          <p className="text-lg font-semibold text-neutral-700">
            Price
          </p>
          <p className="text-lg font-semibold text-neutral-700">
            Serves
          </p>
        </div>
        <div className=" col-span-3 space-y-8">
          <p className="text-xl font-bold text-black">
            ${product.price}
          </p>
          <div className="flex items-center gap-2">
            {
              [1, 2, 3, 4, 5].map(num => (
                <div
                  onClick={() => handleQty(num)}
                  key={num} className={cn("w-8 h-8 cursor-pointer rounded-full flex items-center justify-center border border-hero", qty === num ? "bg-hero shadow-md text-wrap" : "bg-transparent shadow-none")}>
                  {num}
                </div>
              ))
            }

          </div>
        </div>
      </div>
      <div className="flex justify-evenly">
        <Button
          onClick={() => addToCart(product)}
          className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
          size="lg"
        >
          <CreditCard className="h-4 w-4 mr-5" />
          Buy now
        </Button>
      </div>
            
    </div>
  )
}

export default Info
