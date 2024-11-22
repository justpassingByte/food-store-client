'use client'

import { useEffect, useState } from "react"
import { useUser } from '@clerk/clerk-react'
import Container from "@/components/container"
import Box from "@/components/box"
import FilterContainer from "@/components/fiter-contain"
import { fetchUserData } from '@/action/user-data'
import { Products } from '@/type-db'
import CategoryFilter from "./category-filter"
import SizeFilter from "./size-filter"
import KitchenFilter from "./kitchen-filter"
import CuisineFilter from "./cuisine-filter"
import PageContent from "./page-content"

interface MenuProps {
    categories: any[];
    sizes: any[];
    kitchens: any[];
    cuisines: any[];
    initialProducts: Products[];
    userData?: any;
}

const ALLERGEN_INGREDIENTS = {
    'peanut': ['đậu phộng', 'lạc', 'bơ đậu phộng'],
    'seafood': ['tôm', 'cua', 'sò', 'ốc', 'mực', 'cá'],
    'egg': ['trứng', 'lòng đỏ trứng', 'lòng trắng trứng'],
    'milk': ['sữa', 'phô mai', 'sữa chua', 'bơ sữa'],
} as const;

const DISEASE_RESTRICTIONS = {
    'diabetes': (product: Products) => product.carbs <= 30,
    'hypertension': (product: Products) => !product.ingredients.toLowerCase().includes('muối'),
    'kidney': (product: Products) => product.protein <= 20,
} as const;

function MenuClient({ initialProducts, categories, sizes, kitchens, cuisines, userData }: MenuProps) {
    const { user } = useUser()
    const [filteredProducts, setFilteredProducts] = useState<Products[]>(initialProducts)
    const [isLoading, setIsLoading] = useState(true)

    const filterProductsByUserPreferences = (
        products: Products[], 
        calories: number, 
        protein: number, 
        diseases: string[], 
        allergies: string[]
    ) => {
        return products.filter(product => {
            // Kiểm tra calories và protein
            const calorieMatch = product.calories >= (calories * 0.8) && 
                               product.calories <= (calories * 1.2)
            const proteinMatch = product.protein >= (protein * 0.8) && 
                               product.protein <= (protein * 1.2)

            // Kiểm tra dị ứng
            const hasAllergicIngredient = allergies.some(allergy => {
                const allergenList = ALLERGEN_INGREDIENTS[allergy as keyof typeof ALLERGEN_INGREDIENTS] || []
                return allergenList.some(ingredient => 
                    product.ingredients.toLowerCase().includes(ingredient.toLowerCase())
                )
            })

            // Kiểm tra bệnh
            const diseaseMatch = diseases.every(disease => {
                const restriction = DISEASE_RESTRICTIONS[disease as keyof typeof DISEASE_RESTRICTIONS]
                return restriction ? restriction(product) : true
            })

            return calorieMatch && proteinMatch && !hasAllergicIngredient && diseaseMatch
        })
    }

    useEffect(() => {
        const loadUserDataAndFilterProducts = async () => {
            try {
                setIsLoading(true)
                console.log('Initial Products:', initialProducts)
                
                if (!user) {
                    console.log('No user, showing all products')
                    setFilteredProducts(initialProducts)
                    return
                }

                const userPreferences = userData?.length ? userData[0] : await fetchUserData(user.id)
                console.log('User Preferences:', userPreferences)
                
                if (!userPreferences) {
                    console.log('No user preferences, showing all products')
                    setFilteredProducts(initialProducts)
                    return
                }

                const { calories, protein, diseases, allergies } = userPreferences
                console.log('User values:', { calories, protein, diseases, allergies })

                if (!calories || !protein || !diseases || !allergies) {
                    console.log('Missing some user preferences')
                    setFilteredProducts(initialProducts)
                    return
                }

                const filtered = filterProductsByUserPreferences(
                    initialProducts,
                    calories,
                    protein,
                    diseases,
                    allergies
                )
                console.log('Filtered Products:', filtered)

                setFilteredProducts(filtered)
            } catch (error) {
                console.error('Error filtering products:', error)
                setFilteredProducts(initialProducts)
            } finally {
                setIsLoading(false)
            }
        }

        loadUserDataAndFilterProducts()
    }, [user, initialProducts, userData])

    console.log('Current filteredProducts:', filteredProducts)

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>
    }

    if (!filteredProducts || filteredProducts.length === 0) {
        return <div className="flex items-center justify-center min-h-screen">
            Không tìm thấy sản phẩm phù hợp với chế độ ăn của bạn
        </div>
    }

    return (
        <Container className="px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 py-12 gap-2 pt-24 relative">
                <div className="relative hidden md:block col-span-2 border-r border-gray-100">
                    <FilterContainer>
                        <CategoryFilter categories={categories}/>
                    </FilterContainer>
                    <FilterContainer>
                        <SizeFilter sizes={sizes}/>
                    </FilterContainer>
                    <FilterContainer>
                        <KitchenFilter kitchens={kitchens}/>
                    </FilterContainer>
                    <FilterContainer>
                        <CuisineFilter cuisines={cuisines}/>
                    </FilterContainer>
                </div>
                <Box className="col-span-12 md:col-span-10 flex-col items-start justify-start w-full">
                    <PageContent 
                        products={filteredProducts}
                        userDRI={userData?.[0] ? {
                            calories: userData[0].calories,
                            protein: userData[0].protein
                        } : undefined}
                    />
                </Box>
            </div>
        </Container>
    )
}

export default MenuClient
