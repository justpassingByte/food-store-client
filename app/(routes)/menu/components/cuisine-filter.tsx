"use client"
import Box from '@/components/box'
import { cn } from '@/lib/utils'
import {  Cuisines } from '@/type-db'
import { Check } from 'lucide-react'
import {  useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import React from 'react'
interface CuisineFilterProps{
    cuisines: Cuisines[]
}
const CuisineFilter = ({cuisines}:CuisineFilterProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const handleClick = (cuisine:string) =>{
        const currentParams = Object.fromEntries(searchParams.entries())
        if(currentParams.cuisine === cuisine){
            delete currentParams.cuisine
        }else{
            currentParams.cuisine = cuisine
        }
        const href = queryString.stringifyUrl({
            url:"/menu",
            query: currentParams
        })
        router.push(href)
    }
  return (
    <div>
     <Box className='flex-col gap-2 border-b pb-4 cursor-pointer'>
        <h2 className='text-xl font-semibold text-neutral-700'> cuisine</h2>
        <Box className='flex-col gap-2 mt-2'>
            {cuisines?.map(cuisine =>(
                <div
                onClick={()=>handleClick(cuisine.name)} 
                key={cuisine.id} className={cn("text-sm font-semibold text-neutral-500 flex items-center gap-2"
                    ,cuisine.name === searchParams.get("cuisine") && "text-hero"
                )}>
                    <p>{cuisine.name}</p>
                    {cuisine.name === searchParams.get("cuisine") && (
                        <Check className='w-4 h-4 text-hero'/>
                    )}
                </div>
            ))}
        </Box>
     </Box>
    </div>
  )
}

export default CuisineFilter
