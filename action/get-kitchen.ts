import { Kitchens } from "@/type-db"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/kitchens`
// const URL = "http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/kitchens"
const getKitchen = async () : Promise<Kitchens[]> =>{
    const res = await fetch(URL)
    return res.json()
}
export default getKitchen