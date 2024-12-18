"use client";
import { db } from '@/lib/firebase';
import { Orders, Products } from '@/type-db';
import { collection, doc, getDoc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios'
import { useRouter } from 'next/navigation';

import Container from "@/components/container"
const OrderDetail= ({
    params,
}: {
    params: { orderId: string };
}) => {
    if (!params.orderId) {
        console.error("Order ID is required");
        return <div>Order not found</div>;
    }

    const [currentOrder, setCurrentOrder] = useState<Orders | null>(null);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [loading, setLoading] = useState(true);
    const route = useRouter()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderDoc = await getDoc(
                    doc(db, 'stores', 'T5efehVuTKiOIPOhWgjq', 'orders', params.orderId)
                );

                const order = orderDoc.data() as Orders;
                setCurrentOrder(order);

                const ordersSnapshot = await getDocs(
                    collection(db, 'stores', 'T5efehVuTKiOIPOhWgjq', 'orders')
                );

                const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Orders[];

                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        console.log(orders);
        
        fetchData();
    }, [ params.orderId]);

    const calculateTotalPrice = (products: Products[]) => {
        return products.reduce((total, product) => {
            return total + (product.price || 0) * (product.qty || 0);
        }, 0);
    };

    const totalPrice = currentOrder ? calculateTotalPrice(currentOrder.orderItems) : 0;

    // const formattedDate = currentOrder?.createAt
    //     ? new Timestamp(currentOrder.createAt.seconds, currentOrder.createAt.nanoseconds).toDate().toLocaleDateString()
    //     : '';

    if (loading) {
        return <div>Loading...</div>;
    }
    const formattedDate = currentOrder?.createAt
        ? new Timestamp(currentOrder.createAt.seconds, currentOrder.createAt.nanoseconds).toDate().toLocaleDateString()
        : '';
  return (
    <Container className="pt-14  md:px-12">
   <h1 className="text-3xl font-bold mb-6">Order #{currentOrder?.id}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>currentOrder? Summary</CardTitle>
            <CardDescription> placed on {formattedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Status:</span>
              <Badge fontVariant={currentOrder?.order_status === "Delivered" ? "default" : "secondary"}>
                {currentOrder?.order_status}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span>$ {totalPrice}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><span className="font-semibold">Phone:</span> {currentOrder?.phone}</p>
            <p className="mb-2"><span className="font-semibold">Address:</span> {currentOrder?.address}</p>
           
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle> Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrder?.orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.qty}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(item.qty * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>

      </Container>
                  
  );
};

export default OrderDetail; 