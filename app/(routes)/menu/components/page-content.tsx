"use client"
import Box from '@/components/box'
import { PopularProducts } from '@/components/popular-content'
import { Combos, Products } from '@/type-db'
import { ChevronRight, Home, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'

interface PageContentProps {
    products: Products[]
    userDRI?: {
        calories: number
        protein: number
    }
}

const PageContent: React.FC<PageContentProps> = ({ products, userDRI: initialUserDRI }) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentParams = Object.fromEntries(searchParams.entries())
    const [userDRI, setUserDRI] = useState<any>(null)

    useEffect(() => {
        // Lấy DRI từ localStorage khi component mount
        const savedDRI = localStorage.getItem('userDRI')
        if (savedDRI) {
            setUserDRI(JSON.parse(savedDRI))
        }
    }, [])

    // Lọc sản phẩm theo DRI nếu có
    const filterProductsByDRI = (products: Products[]) => {
        if (!userDRI) return products

        return products.filter(product => {
            const calorieMatch = product.calories >= (userDRI.calories * 0.8) && 
                               product.calories <= (userDRI.calories * 1.2)
            const proteinMatch = product.protein >= (userDRI.protein * 0.8) && 
                               product.protein <= (userDRI.protein * 1.2)
            return calorieMatch && proteinMatch
        })
    }

    // Filter products by meal type và DRI
    const filteredProducts = {
        breakfast: filterProductsByDRI(products.filter(product => product.type === "Breakfast")),
        lunch: filterProductsByDRI(products.filter(product => product.type === "Lunch")),
        dinner: filterProductsByDRI(products.filter(product => product.type === "Dinner")),
    }

    const handleClick = (param: string) => {
        if (currentParams.hasOwnProperty(param)) {
            const newParams = { ...currentParams }
            delete newParams[param]
            const href = queryString.stringifyUrl({
                url: "/menu",
                query: newParams
            })
            router.push(href)
        }
    }
    const combos = [
        {
            id: "combo1",
            name: "Healthy Breakfast Combo",
            description: "Start your day with a nutritious breakfast with 20% cheaper.",
            price: 15.99,
            images: [
                { url: "https://via.placeholder.com/150x100.png?text=Breakfast+Combo" }
            ],
            products: [
                { id: "prod1", name: "Avocado Toast" },
                { id: "prod2", name: "Smoothie Bowl" },
                { id: "prod3", name: "Green Tea" }
            ]
        },
        {
            id: "combo2",
            name: "Classic Lunch Combo",
            description: "Enjoy a delicious and balanced lunch.",
            price: 20.99,
            images: [
                { url: "https://via.placeholder.com/150x100.png?text=Lunch+Combo" }
            ],
            products: [
                { id: "prod4", name: "Caesar Salad" },
                { id: "prod5", name: "Grilled Chicken Sandwich" },
                { id: "prod6", name: "Fresh Orange Juice" }
            ]
        },
        {
            id: "combo3",
            name: "Evening Dinner Combo",
            description: "Relax with a hearty and healthy dinner.",
            price: 25.99,
            images: [
                { url: "https://via.placeholder.com/150x100.png?text=Dinner+Combo" }
            ],
            products: [
                { id: "prod7", name: "Steak" },
                { id: "prod8", name: "Garlic Mashed Potatoes" },
                { id: "prod9", name: "Red Wine" }
            ]
        }
    ];
    const handleComboClick = (comboId: string) => {
        router.push(`/menu/combo/${comboId}`);
    };
    return (
        <>
            <Box className='pt-4 flex-col items-start'>
                <Box className='text-neutral-700 text-sm items-center'>
                    <Link href={"/"} className="flex items-center gap-2">
                        <Home className='w-4 h-4' />
                        Main Page
                    </Link>

                    <ChevronRight className='w-5 h-5 text-muted-foreground' />

                    <Link href={"/menu"} className="flex items-center gap-2">
                        Products
                    </Link>
                </Box>

                {/* Hiển thị thông báo DRI nếu có */}
                {userDRI && (
                    <div className="w-full bg-green-100 p-4 rounded-md mb-4">
                        <p className="text-green-800">
                            Showing meals matching your nutritional needs:
                            {userDRI.calories}kcal / {userDRI.protein}g protein
                        </p>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('userDRI')
                                setUserDRI(null)
                                router.refresh() // Refresh để hiển thị lại tất cả sản phẩm
                            }}
                            className="text-sm text-green-600 underline mt-2"
                        >
                            Show all products
                        </button>
                    </div>
                )}

                <Box className='gap-3 my-4 flex flex-wrap'>
                    {currentParams && (
                        Object.entries(currentParams).map(([key, value]) => (
                            <div key={key} onClick={() => handleClick(key)} className='px-4 py-1 cursor-pointer hover:shadow-md rounded-md bg-emerald-500/10 text-neutral-600 flex items-center gap-1'>
                                {value}
                                <X className='w-4 h-4' />
                            </div>
                        ))
                    )}
                </Box>
            </Box>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12 w-full'>
                {/* Combo Section */}
                <Box className='col-span-full mt-10 py-4'>
                    <h3 className='text-2xl font-semibold text-neutral-700 mb-6'>Combo Options</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {combos.length > 0 ? (
                            combos.map(combo => (
                                <div
                                    key={combo.id}
                                    className="p-4 border rounded-md shadow-sm cursor-pointer hover:shadow-md"
                                    onClick={() => handleComboClick(combo.id)}
                                >
                                    <img
                                        src={combo.images[0]?.url}
                                        alt={combo.name}
                                        className="w-full h-48 object-cover rounded-md mb-4"
                                    />
                                    <h4 className='text-xl font-semibold text-neutral-600'>{combo.name}</h4>
                                    <p className='text-neutral-700 mt-2'>${combo.price}</p>
                                </div>
                            ))
                        ) : (
                            <Box className='py-4 text-muted-foreground'>No combo items available</Box>
                        )}
                    </div>
                </Box>

                {/* Breakfast Section */}
                <Box className='col-span-full mt-10 py-4'>
                    <h3 className='text-2xl font-semibold text-neutral-700 mb-6 mr-4'>
                        Breakfast
                        {userDRI && <span className="text-sm text-gray-500 ml-2">
                            (Matching your nutritional needs)
                        </span>}
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10'>
                        {filteredProducts.breakfast.length > 0
                            ? filteredProducts.breakfast.map(product => (
                                <PopularProducts 
                                    data={product} 
                                    key={product.id}
                                    showNutrition={true} // Thêm prop để hiển thị thông tin dinh dưỡng
                                />
                            ))
                            : <Box className='py-12 text-muted-foreground text-xl font-bold col-span-full'>
                                No breakfast items available
                                {userDRI && " matching your nutritional needs"}
                            </Box>}
                    </div>
                </Box>

                {/* Lunch Section */}
                <Box className='col-span-full mt-10 py-4'>
                    <h3 className='text-2xl font-semibold text-neutral-700 mb-6 mr-14'>Lunch</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10'>
                        {filteredProducts.lunch.length > 0
                            ? filteredProducts.lunch.map(product => (
                                <PopularProducts 
                                    data={product} 
                                    key={product.id} 
                                    showNutrition={true} // Thêm thuộc tính showNutrition
                                />
                            ))
                            : <Box className='py-12 text-muted-foreground text-xl font-bold col-span-full'>No lunch items available</Box>}
                    </div>
                </Box>

                {/* Dinner Section */}
                <Box className='col-span-full mt-10 py-4'>
                    <h3 className='text-2xl font-semibold text-neutral-700 mb-6 mr-12'>Dinner</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10'>
                        {filteredProducts.dinner.length > 0
                            ? filteredProducts.dinner.map(product => (
                                <PopularProducts data={product} key={product.id} showNutrition={true} />
                            ))
                            : <Box className='py-12 text-muted-foreground text-xl font-bold col-span-full'>No dinner items available</Box>}
                    </div>
                </Box>
            </div>
        </>
    )
}

export default PageContent
