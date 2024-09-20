import Container from "@/components/container"
import Box from "@/components/box"
import FilterContainer from "@/components/fiter-contain"
import getCategories from "@/action/get-categories"
import CategoryFilter from "./components/category-filter"
import getSizes from "@/action/get-size"
import getKitchen from "@/action/get-kitchen"
import getCuisines from "@/action/get-cuisine"
import SizeFilter from "./components/size-filter"
import KitchenFilter from "./components/kitchen-filter"
import CuisineFilter from "./components/cuisine-filter"
import Footer from "@/components/footer"
import PageContent from "./components/page-content"
import getProducts from "@/action/get-product"
export const revalidate = 0
interface MenuProps{
    searchParams:{
        size?:string
        isFeatrue?:boolean
        cuisine?:string
        category?:string
        kitchen?:string
    }
}

const MenuPage = async({searchParams}: MenuProps) => {
    const categories = await getCategories()
    const sizes = await getSizes()
    const kitchens = await getKitchen()
    const cuisines = await getCuisines()
    const products = await getProducts({
    size: searchParams?.size,
    isFeature:searchParams?.isFeatrue,
    cuisine: searchParams?.cuisine,
    kitchen: searchParams?.kitchen,
    })
  return (
    <Container className="px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 py-12 gap-2 pt-24 relative">
            <div className=" relative hidden md:block col-span-2 border-r border-gray-100">
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
            <Box className="col-span-12  md:col-span-10 flex-col items-start justify-start w-full">
                <PageContent products={products}/>
            </Box>
        </div>
        <Footer/>
    </Container>
   
  )
}

export default MenuPage
