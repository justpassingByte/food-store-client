import { Kitchens } from "@/type-db"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/kitchens`

const getKitchen = async (): Promise<Kitchens[]> => {
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
        console.error('Error fetching kitchen:', error)
        window.location.reload() // Thử reload trang nếu fetch thất bại
        return []
    }
}

export default getKitchen