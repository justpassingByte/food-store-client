import { Products } from "@/type-db";
import qs from "query-string"
const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

interface Query {
    size?: string,
    isFeature?: boolean,
    cuisine?: string,
    kitchen?: string,
}
const getProducts = async (query: Query): Promise<Products[]> => {
    const url = qs.stringifyUrl({
      url: URL,
      query: {
        size: query.size,
        isFeature: query.isFeature,
        cuisine: query.cuisine,
        kitchen: query.kitchen,
      },
    });
    
    console.log("Generated URL:", url);  
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        console.error(`API call failed with status: ${res.status}`);
        throw new Error(`Failed to fetch products: ${res.status}`);
      }
  
      const text = await res.text();  // Get the response as text
      console.log("Raw response text:", text);  // Log the raw response
  
      if (!text) {
        throw new Error("Empty response from server");
      }
  
      const data = JSON.parse(text);  // Parse the JSON response
      console.log("Parsed response:", data);  // Log the parsed response
  
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };
  export default getProducts