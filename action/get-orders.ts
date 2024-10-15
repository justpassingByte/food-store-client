import { Orders } from "@/type-db"
import { auth } from "@clerk/nextjs/server"

const userId = auth()
const URL = `${process.env.NEXT_PUBLIC_API_URL}/orders/${userId}`
const getOrders = async () : Promise<Orders[]> =>{
    const res = await fetch(URL)
    return res.json()
}
export default getOrders