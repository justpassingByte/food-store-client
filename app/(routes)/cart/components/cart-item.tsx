import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Products } from '@/type-db';
import useCarts from '@/hooks/usecart';
import { Input } from '@/components/ui/input';

interface CartItemProps {
    item: Products;
}

const CartItem = ({ item }: CartItemProps) => {
    const cart = useCarts();
    const [qty, setQty] = useState(item.qty ?? 1); // Initialize local qty state

    useEffect(() => {
        setQty(item.qty ?? 1); // Sync local qty with cart state
    }, [item.qty]);

    const handleIncrease = () => {
        setQty((prevQty) => prevQty + 1); // Update local state
        cart.increaseQuantity(item.id); 
    };

    const handleDecrease = () => {
        if (qty > 1) {
            setQty((prevQty) => prevQty - 1); 
            cart.decreaseQuantity(item.id); 
        }
    };
    const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQty = Math.max(1, parseInt(e.target.value) || 1); 
        setQty(newQty);
        cart.updateQuantity(item.id, newQty); 
    };
    return (
        <Card className="mb-4 border border-gray-300 shadow-md rounded-lg"> {/* Added border and shadow */}
        <CardContent className="p-4">
            <div className="flex items-center">
                <img src={item.images[0]?.url} alt={item.name} className="w-24 h-24 object-cover rounded mr-4" />
                <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                        <Button variant="outline" size="icon" onClick={handleDecrease}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={handleQtyChange}
                            className="w-16 mx-2 text-center"
                        />
                        <Button variant="outline" size="icon" onClick={handleIncrease}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => cart.removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </CardContent>
    </Card>
    );
};

export default CartItem;
