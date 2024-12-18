"use client"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { format, isValid } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import getOrders from '@/action/get-orders'
import { Orders } from '@/type-db'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react'
import { db } from "@/lib/firebase";

interface OrdersPageProps {
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
}

const ordersPerPage = 5

const OrdersPage =({ searchTerm = '', statusFilter = 'All', currentPage = 1 }: OrdersPageProps) => {
  const { userId } = useAuth(); 
  const [order, setOrder] = useState<Orders[]>([]);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    if (!userId) {
      console.error("User ID is required");
      return;
    }

    const loadOrders = async () => {
      console.log('Loading orders for user:', userId);
      const orders = await getOrders(userId, dateFilter, statusFilter);
      setOrder(orders);
    };

    loadOrders();
  }, [userId, dateFilter, statusFilter]);

  const transformedData = order.map(order => {
    const totalPrice = order.orderItems.reduce((total: number, item: any) => {
      const price = item.price || 0;
      const quantity = item.qty || 1;
      return total + price * quantity;
    }, 0).toFixed(2);
    let date: Date | null = null;

    if (order.createAt && typeof order.createAt === 'object' && 'seconds' in order.createAt) {
      date = new Date((order.createAt as Timestamp).seconds * 1000);
    } else if (typeof order.createAt === 'string') {
      date = new Date(order.createAt);
    }

    if (!date || !isValid(date)) {
      console.error("Invalid date value:", date);
      return { ...order, createAt: 'Invalid date' };
    }

    const formattedDate = format(date, 'MM/dd/yyyy');
    return {
      ...order,
      totalPrice,
      createAt: formattedDate,
    } as Orders;
  });

  const filteredOrders = transformedData.filter(order =>
    (order.id.toLowerCase().includes(searchTerm.toLowerCase())
      || order.createAt?.includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'All' || order.order_status === statusFilter)
  )

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    if (value === 'today') {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const dateParam = JSON.stringify({ seconds: Math.floor(startOfDay.getTime() / 1000) });
      
      if (userId) {
        getOrders(userId, dateParam, statusFilter);
      } else {
        console.error("User ID is required");
      }
    } else {
      setDateFilter(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and manage your order history</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-8"
                  name="searchTerm"
                  defaultValue={searchTerm}
                />
              </div>
              <Select value={statusFilter} onValueChange={statusFilter} name="statusFilter">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={handleDateFilterChange} name="dateFilter">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Lọc theo ngày" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="this-week">Tuần này</SelectItem>
                  <SelectItem value="whole-time">Toàn bộ thời gian</SelectItem>
                </SelectContent>
              </Select>
            </div>
        
          </form>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/orders/${order.id}`}>{order.id}</Link>
                    </TableCell>
                    <TableCell>{order.createAt}</TableCell>
                    <TableCell>${order.totalPrice}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.order_status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.order_status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {order.order_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="link">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
            >
              <Link href={`?currentPage=${currentPage - 1}&searchTerm=${searchTerm}&statusFilter=${statusFilter}`}>
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(filteredOrders.length / ordersPerPage)}
            </div>
            <Button
              variant="outline"
              disabled={indexOfLastOrder >= filteredOrders.length}
            >
              <Link href={`?currentPage=${currentPage + 1}&searchTerm=${searchTerm}&statusFilter=${statusFilter}`}>
                Next
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrdersPage
