"use client"
import Box from '@/components/box'
import { cn } from '@/lib/utils'
import {  Kitchens } from '@/type-db'
import { Check } from 'lucide-react'
import {  useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import React from 'react'
interface KitchenFilterProps{
    kitchens: Kitchens[]
}
const KitchenFilter = ({kitchens} : KitchenFilterProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const handleClick = (kitchen:string) =>{
        const currentParams = Object.fromEntries(searchParams.entries())
        if(currentParams.kitchen === kitchen){
            delete currentParams.kitchen
        }else{
            currentParams.kitchen = kitchen
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
        <h2 className='text-xl font-semibold text-neutral-700'> kitchen</h2>
        <Box className='flex-col gap-2 mt-2'>
            {kitchens?.map(kitchen =>(
                <div
                onClick={()=>handleClick(kitchen.name)} 
                key={kitchen.id} className={cn("text-sm font-semibold text-neutral-500 flex items-center gap-2"
                    ,kitchen.name === searchParams.get("kitchen") && "text-hero"
                )}>
                    <p>{kitchen.name}</p>
                    {kitchen.name === searchParams.get("kitchen") && (
                        <Check className='w-4 h-4 text-hero'/>
                    )}
                </div>
            ))}
        </Box>
     </Box>
    </div>
  )
}

export default KitchenFilter
