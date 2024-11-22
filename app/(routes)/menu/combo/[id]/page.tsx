// app/menu/combo/[id]/page.tsx
import React from 'react';

// Define the type for a product in a combo
interface Product {
    id: string;
    name: string;
}

// Define the type for a combo
interface Combo {
    id: string;
    name: string;
    description: string;
    price: number;
    images: { url: string }[];
    products: Product[];
}

// Test data
const mockCombos: Combo[] = [
    {
        id: "combo1",
        name: "Healthy Breakfast Combo",
        description: "Start your day with a nutritious breakfast with 20% cheaper.",
        price: 15.99,
        images: [{ url: "https://via.placeholder.com/150x100.png?text=Breakfast+Combo" }],
        products: [
            { id: "prod1", name: "Avocado Toast" },
            { id: "prod2", name: "Smoothie Bowl" },
            { id: "prod3", name: "Green Tea" }
        ]
    },
    {
        id: "combo2",
        name: "Classic Lunch Combo",
        description: "Enjoy a delicious and balanced lunch.",
        price: 20.99,
        images: [{ url: "https://via.placeholder.com/150x100.png?text=Lunch+Combo" }],
        products: [
            { id: "prod4", name: "Caesar Salad" },
            { id: "prod5", name: "Grilled Chicken Sandwich" },
            { id: "prod6", name: "Fresh Orange Juice" }
        ]
    },
    {
        id: "combo3",
        name: "Evening Dinner Combo",
        description: "Relax with a hearty and healthy dinner.",
        price: 25.99,
        images: [{ url: "https://via.placeholder.com/150x100.png?text=Dinner+Combo" }],
        products: [
            { id: "prod7", name: "Steak" },
            { id: "prod8", name: "Garlic Mashed Potatoes" },
            { id: "prod9", name: "Red Wine" }
        ]
    }
];

const ComboDetail = ({ params }: { params: { id: string } }) => {
    const { id } = params;

    // Find the combo by ID in the mock data
    const combo = mockCombos.find(combo => combo.id === id);

    if (!combo) {
        return <p>Combo not found.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{combo.name}</h1>
            <img
                src={combo.images[0]?.url}
                alt={combo.name}
                className="w-full h-60 object-cover rounded-md mb-4"
            />
            <p className="text-xl text-neutral-700 mb-4">${combo.price}</p>
            <p className="text-neutral-600 mb-6">{combo.description}</p>
            <h2 className="text-2xl font-semibold text-neutral-700 mb-4">Products in Combo:</h2>
            <ul className="list-disc list-inside">
                {combo.products.map(product => (
                    <li key={product.id} className="text-neutral-600">{product.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ComboDetail;
