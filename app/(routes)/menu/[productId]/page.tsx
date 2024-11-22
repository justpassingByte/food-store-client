import Box from '@/components/box'
import Container from '@/components/container'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Gallery from './components/gallery/gallery'
import getProduct from '@/action/get-product'
import getProducts from '@/action/get-products'
import Info from './components/info'
import SuggestedProducts from './components/suggested-products'

interface ProductPageProps {
  params: {
    productId: string
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const product = await getProduct(params.productId)
  const suggestedProducts = await getProducts({ category: product?.category }) 

  return (
    <div>
      <Container className='bg-white rounded-lg my-4 px-4 '>
        <Box className='text-neutral-700 text-sm items-center mt-12'>
          <Link href={"/"} className='flex items-center gap-2'>
            <Home className='w-5 h-5' /> Main Page
          </Link>
          <ChevronRight className='w-5 h-5 text-muted-foreground' />
          <Link href={"/menu"} className='flex items-center gap-2 text-muted-foreground'>
            Products
          </Link>
        </Box>
        <div className='px-4 py-10 sm:px-6 lg:px-8 space-y-10'>
          <div className='lg:grid lg:grid-cols-12 lg:gap-x-8'>
            {/* Gallery section - 5 columns */}
            <div className='lg:col-span-5'>
              <Gallery images={product.images} />
            </div>

            {/* Info section - 7 columns */}
            <div className='mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 lg:col-span-7'>
              <Info product={product} />
            </div>
          </div>
          <SuggestedProducts products={suggestedProducts}/>
        </div>
      </Container>
    </div>
  )
}

export default ProductPage
