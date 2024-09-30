import { Categories } from "@/type-db"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`
// const URL = "http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/categories"
const getCategories = async () : Promise<Categories[]> =>{
    const res = await fetch(URL)
    return res.json()
}
export default getCategories