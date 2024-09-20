"use client"
import Box from '@/components/box'
import { cn } from '@/lib/utils'
import { Sizes } from '@/type-db'
import { Check } from 'lucide-react'
import {  useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import React from 'react'
interface SizeFilterProps{
    sizes: Sizes[]
}
const SizeFilter = ({sizes}:SizeFilterProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const handleClick = (size:string) =>{
        const currentParams = Object.fromEntries(searchParams.entries())
        if(currentParams.size === size){
            delete currentParams.size
        }else{
            currentParams.size = size
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
        <h2 className='text-xl font-semibold text-neutral-700'> size</h2>
        <Box className='flex-col gap-2 mt-2'>
            {sizes?.map(size =>(
                <div
                onClick={()=>handleClick(size.name)} 
                key={size.id} className={cn("text-sm font-semibold text-neutral-500 flex items-center gap-2"
                    ,size.name === searchParams.get("size") && "text-hero"
                )}>
                    <p>{size.name}({size.value})</p>
                    {size.value === searchParams.get("size") && (
                        <Check className='w-4 h-4 text-hero'/>
                    )}
                </div>
            ))}
        </Box>
     </Box>
    </div>
  )
}

export default SizeFilter
