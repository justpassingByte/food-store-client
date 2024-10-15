"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import CartItem from './cart-item';
import Link from 'next/link';
import useCarts from '@/hooks/usecart';
import { Separator } from '@/components/ui/separator';
import axios from 'axios'
interface CartContentProps {
    userId: string | null;
}

const CartContent = ({ userId }: CartContentProps) => {
    const cart = useCarts();
    const searchParams = useSearchParams();

    const totalPrice = cart.items.reduce((total, item) => {
        return total + Number(item.price * item.qty);
    }, 0);

    useEffect(() => {
        if (searchParams.get("success")) {
            cart.removeAll()
            toast.success("Payment completed");
        }
        if (searchParams.get("cancel")) {
            toast.error("Something went wrong");
        }
    }, [searchParams]);

    const onCheckout =async ()=>{
        const response = await axios.post(
            // `${process.env.NEXT_PUBLIC_API_URL}/checkout`
            'http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/checkout'
            ,
            {
                products: cart.items,
                userId,
            }
        )
        window.location = response.data.url
    }
    return (
        <>
            {cart.items.length === 0 ? (
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="w-full max-w-3xl border-none shadow-none">
                        <CardContent className="flex flex-col items-center space-y-6 p-6">
                            <ShoppingCart className="w-24 h-24 text-gray-400" />
                            <h1 className="text-3xl font-bold text-gray-800">Your cart is empty</h1>

                            <p className="text-gray-600 text-center text-lg max-w-md">
                                Looks like you haven't added any items to your cart yet. Start shopping to add items to your cart.
                            </p>
                            <Link href={"/menu"}>
                                <Button className="mt-6" size="lg">
                                    <ArrowLeft className="mr-2 h-5 w-5" /> Continue Shopping
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="w-full flex items-start gap-4"> {/* Changed to items-start to align items at the start */}
                    <div className="w-full lg:grid lg:grid-cols-12 lg:gap-4">
                        <h1 className="text-3xl font-bold mb-8 col-span-12">Your Cart</h1> {/* Added col-span-12 to ensure the title spans full width */}
                        <div className="col-span-8"> {/* Adjusted column span for cart items */}
                            {cart.items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                        <div className="col-span-4">
                            <Card className="w-full max-w-md border border-gray-300 rounded-md shadow-md">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>$99.99</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>$9.99</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>$8.00</span>
                                    </div> */}
                                    <Separator className="my-4" />
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${totalPrice}</span>
                                    </div>
                                </CardContent>
                                <Separator className="mb-4" />
                                <CardFooter>
                                    <Button onClick={() => onCheckout()} className="w-full" size="lg">
                                        Proceed to Checkout
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
};

export default CartContent;
