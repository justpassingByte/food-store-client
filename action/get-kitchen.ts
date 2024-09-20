import { Kitchens } from "@/type-db"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/kitchens`
const getKitchen = async () : Promise<Kitchens[]> =>{
    const res = await fetch(URL)
    return res.json()
}
export default getKitchen