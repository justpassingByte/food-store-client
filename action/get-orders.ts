import { Orders } from "@/type-db"


// const URL = `${process.env.NEXT_PUBLIC_API_URL}/user`
const URL = 'http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/orders';

const getOrders = async (userId: string, dateParam?: string, statusParam?: string): Promise<Orders[]> => {
    const params = new URLSearchParams({ userId });
    if (dateParam) {
        params.append('date', dateParam);
    }
    // if (statusParam) {
    //     params.append('status', statusParam);
    // }

    const res = await fetch(`${URL}?${params.toString()}`);
    if (!res.ok) {
        throw new Error(`Fetch failed with status: ${res.status}`);
    }
    return res.json();
};

export default getOrders;
