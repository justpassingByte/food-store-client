"use client"
import Box from '@/components/box'
import { PopularProducts } from '@/components/popular-content'
import { Combos, Products } from '@/type-db'
import { ChevronRight, Home, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react';
import { fetchUserData } from '@/action/user-data'; // Import hàm lấy dữ liệu người dùng
import useDRIStore from '@/hooks/useDRI'; // Thêm dòng này để import useDRIStore
import { usePathname } from 'next/navigation';

interface PageContentProps {
    products: Products[]
}

const PageContent: React.FC<PageContentProps> = ({ products }) => {
    const { user } = useUser();
    const { setDRI, clearDRI, calories, protein, allergies } = useDRIStore(); // Lấy calories, protein từ useDRIStore
    const userDRI = { calories, protein, allergies }; // Tạo userDRI từ store
    const [visibleBreakfast, setVisibleBreakfast] = useState(4);
    const [visibleLunch, setVisibleLunch] = useState(4);
    const [visibleDinner, setVisibleDinner] = useState(4);
    const [visibleOther, setVisibleOther] = useState(4);
    const currentParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        const loadUserDRI = async () => {
            if (user) {
                console.log('Fetching user data for:', user.id);
                try {
                    const userData = await fetchUserData(user.id);
                    const { calories: newCalories, protein: newProtein, allergies: newAllergies } = userData[0];
    
                    if (
                        newCalories !== calories ||
                        newProtein !== protein ||
                        JSON.stringify(newAllergies) !== JSON.stringify(allergies)
                    ) {
                        setDRI(newCalories, newProtein, newAllergies || []);
                    }
                } catch (error) {
                    console.error('Failed to load user data:', error);
                }
            }
        };
    
        loadUserDRI();
    }, [user]); // Chỉ phụ thuộc vào user
    
    
 
    const filterProductsByDRI = (products: Products[]) => {
        console.log('Products:', products); // Kiểm tra sản phẩm đầu vào
        console.log('User DRI:', userDRI); // Kiểm tra giá trị DRI của người dùng
    
        // Lọc sản phẩm để loại bỏ những sản phẩm có nguyên liệu dị ứng
        const filteredProducts = products.filter(product => {
            const hasAllergy = userDRI.allergies?.some(allergy => 
                product.ingredients.includes(allergy) // Kiểm tra nếu nguyên liệu có trong danh sách dị ứng
            );
            
            // Log để kiểm tra từng sản phẩm và tình trạng dị ứng
            console.log(`Product: ${product.name}, Has Allergy: ${hasAllergy}`);
            
            return !hasAllergy; // Chỉ giữ lại sản phẩm không có nguyên liệu dị ứng
        });
    
        console.log('Filtered Products:', filteredProducts); // Kiểm tra sản phẩm đã lọc
        return filteredProducts;
    }
    // Filter products by meal type và DRI
    const filteredProducts = {
        breakfast: filterProductsByDRI(products.filter(product => product.type === "Breakfast")),
        lunch: filterProductsByDRI(products.filter(product => product.type === "Lunch")),
        dinner: filterProductsByDRI(products.filter(product => product.type === "Dinner")),
    }
    const otherProducts = products.filter(product =>
        product.type !== "Breakfast" && product.type !== "Lunch" && product.type !== "Dinner"
    );
    const handleClick = (param: string) => {
        const newParams = new URLSearchParams(currentParams);
        newParams.delete(param);
    
        const href = queryString.stringifyUrl({
            url: "/menu",
            query: Object.fromEntries(newParams.entries()),
        });
    
        if (href !== window.location.pathname) {
            router.push(href); // Điều hướng nếu URL mới khác URL hiện tại
        }
    };
    
    
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
                           your nutritional needs per day:
                            {userDRI.calories}kcal / {userDRI.protein}g protein
                        </p>
                        <button
                            onClick={() => {
                                clearDRI(); // Xóa DRI
                                router.refresh(); // Refresh để hiển thị lại tất cả sản phẩm
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
                    <h3 className='text-2xl font-semibold text-neutral-700 mb-6'>Breakfast</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10'>
                        {filteredProducts.breakfast.slice(0, visibleBreakfast).map(product => (
                            <PopularProducts
                                data={product}
                                key={product.id}
                                showNutrition={true}
                            />
                        ))}
                    </div>
                    {visibleBreakfast < filteredProducts.breakfast.length && (
                        <button onClick={() => setVisibleBreakfast(visibleBreakfast + 4)} className="mt-4 text-blue-500">
                            Load More
                        </button>
                    )}
                </Box>

                {/* Lunch Section */}
                <Box className='col-span-full mt-10 py-4'>
                    <h3 className='text-2xl font-semibold text-neutral-700 mb-6'>Lunch</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10'>
                        {filteredProducts.lunch.slice(0, visibleLunch).map(product => (
                            <PopularProducts
                                data={product}
                                key={product.id}
                                showNutrition={true}
                            />
                        ))}
                    </div>
                    {visibleLunch < filteredProducts.lunch.length && (
                        <button onClick={() => setVisibleLunch(visibleLunch + 4)} className="mt-4 text-blue-500">
                            Load More
                        </button>
                    )}
                </Box>

                {/* Dinner Section */}
                <Box className='col-span-full mt-10 py-4'>
                    <h3 className='text-2xl font-semibold text-neutral-700 mb-6'>Dinner</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10'>
                        {filteredProducts.dinner.slice(0, visibleDinner).map(product => (
                            <PopularProducts data={product} key={product.id} showNutrition={true} />
                        ))}
                    </div>
                    {visibleDinner < filteredProducts.dinner.length && (
                        <button onClick={() => setVisibleDinner(visibleDinner + 4)} className="mt-4 text-blue-500">
                            Load More
                        </button>
                    )}
                </Box>

                {/* Other Products Section */}
                <Box className='col-span-full mt-10 py-4'>
                    <h3 className='text-2xl font-semibold text-neutral-700 mb-6'>Other Products</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10'>
                        {otherProducts.slice(0, visibleOther).map(product => (
                            <PopularProducts data={product} key={product.id} showNutrition={true} />
                        ))}
                    </div>
                    {visibleOther < otherProducts.length && (
                        <button onClick={() => setVisibleOther(visibleOther + 4)} className="mt-4 text-blue-500">
                            Load More
                        </button>
                    )}
                </Box>
            </div>
        </>
    )
}

export default PageContent
