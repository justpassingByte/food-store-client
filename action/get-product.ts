import { Products } from "@/type-db";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;
// const URL = "http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/products"
const getProduct = async (id: string) => {
  try {
    const res = await fetch(`${URL}/${id}`)
    console.log(`Generated URL: ${URL}/${id}`);
    
    if (!res.ok) {
      console.error(`API call failed with status: ${res.status} and statusText: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error(`Error fetching product with id: ${id}`, error);
    return null;
  }
};

export default getProduct;
