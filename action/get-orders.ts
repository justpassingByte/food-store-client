import { Orders } from "@/type-db"

// const URL = `${process.env.NEXT_PUBLIC_API_URL}/user`
const URL = 'http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/user';

const getOrders = async (): Promise<Orders[]> => {
    const res = await fetch(URL);
    if (!res.ok) {
        throw new Error(`Fetch failed with status: ${res.status}`);
    }
    return res.json();
};

export default getOrders;
