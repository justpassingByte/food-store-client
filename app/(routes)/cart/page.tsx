import Box from '@/components/box'
import Container from '@/components/container'
import { auth } from '@clerk/nextjs/server'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CartContent from './components/cart-content'

const CartPage = () => {
    const { userId } = auth()
    return (     
        <div className="flex flex-col min-h-screen"> {/* Set up flex column layout */}
        <Container className="bg-white py-12 my-4 pt-24 flex-grow "> {/* Allow it to grow and set max width */}
            <div className="w-full px-4 md:px-12 space-y-7">
                <Box className="text-neutral-700 text-sm items-center">
                    <Link href={"/"} className="flex items-center gap-2">
                        <Home className='w-4 h-4' />
                        Main Page
                    </Link>
                    <ChevronRight className='w-5 h-5 text-muted-foreground' />
                    <Link href={"/menu"} className="flex items-center gap-2">
                        Products
                    </Link>
                    <ChevronRight className='w-5 h-5 text-muted-foreground' />
                    <Link href={"/menu"} className="flex items-center gap-2">
                        Cart
                    </Link>
                </Box>
            <CartContent userId={userId} />
            </div>
        </Container>        
    </div>
       
    )
}

export default CartPage
