import {Timestamp} from 'firebase/firestore'
export interface Store {
    id:string,
    name: string,
    userId: string,
    createAt: Timestamp,
    updateAt: Timestamp
}
export interface Billboards {
    id:string,
    label: string,
    imageUrl: string,
    createAt?: Timestamp,
    updateAt?: Timestamp
}
export interface Categories {
    id:string,
    billboardId:string,
    billboardLabel:string,
    name:string,
    createAt?: Timestamp,
    updateAt?: Timestamp
}
export interface Sizes {
    id:string,
    name:string,
    value:string,
    createAt?: Timestamp,
    updateAt?: Timestamp
}
export interface Kitchens {
    id:string,
    name:string,
    value:string,
    createAt?: Timestamp,
    updateAt?: Timestamp
}
export interface Cuisines {
    id:string,
    name:string,
    value:string,
    createAt?: Timestamp,
    updateAt?: Timestamp
}
export interface Products {
    id: string; 
    name: string; 
    price: number; 
    qty: number; 
    images: {url: string}[]; 
    isFeature: boolean; 
    isArchieve: boolean; 
    category: string; 
    size:string,
    kitchen:string,
    cuisine: string,
    date: string,
    description:string,
    ingredients:string,
    calories:number,
    protein:number,
    carbs:number,
    fat:number,
    type:string,
    createAt?:Timestamp,
    updateAt?:Timestamp,
  }
  export interface Orders{
    id:string,
    isPaid:boolean,
    phone: string,
    orderItems: Products[],
    address:string,
    order_status: string,
    createAt?:string,
    updateAt?:Timestamp,
    totalPrice?: string;
  }
  export interface Combos {
    id: string; 
    name: string; 
    price: number; 
    products:Products[],
    images: {url: string}[]; 
    description:string,
    createAt?:Timestamp,
    updateAt?:Timestamp,
  }
  export interface HealthProfile {
    activityLevel: string;
    age: string;
    allergies?: Array<{ingredient: string; severity: string}>;
    calories: number;
    createdAt: Date;
    diseases: string[];
    gender: string;
    height: string;
    protein: number;
    userId: string;
    weight: string;
  }
  