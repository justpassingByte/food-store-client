
import getCategories from "@/action/get-categories"
import MenuClient from "./components/menu-client"
import getSizes from "@/action/get-size"
import getKitchen from "@/action/get-kitchen"
import getProducts from "@/action/get-products"
import getCuisines from "@/action/get-cuisine"

export const revalidate = 0

async function MenuPage() {
    const products = await getProducts({})    
    const categories = await getCategories()
    const sizes = await getSizes()
    const kitchens = await getKitchen()
    const cuisines = await getCuisines()

    return (
        <MenuClient 
            initialProducts={products}
            categories={categories}
            sizes={sizes}
            kitchens={kitchens}
            cuisines={cuisines}
        />
    )
}

export default MenuPage