import { Cuisines } from "@/type-db"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/cuisines`
// const URL = "http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/cuisines"
const getCuisines = async () : Promise<Cuisines[]> =>{
    const res = await fetch(URL)
    return res.json()
}
export default getCuisines