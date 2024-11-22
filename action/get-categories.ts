import { Categories } from "@/type-db"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`
// const URL = "http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/categories"
const getCategories = async (): Promise<Categories[]> => {
    try {
        const res = await fetch(URL, {
            cache: 'no-store',
            next: { revalidate: 0 }
        })
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        return res.json()
    } catch (error) {
        console.error('Error fetching categories:', error)
        window.location.reload() // Thử reload trang nếu fetch thất bại
        return []
    }
}
export default getCategories