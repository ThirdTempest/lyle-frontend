import React from 'react';
import { addCartItem, type CartItem } from '../stores/cart';

interface Props {
    product: {
        id: number;
        name: string;
        price: number;
        image_url: string;
    };
}

export default function AddToCartButton({ product }: Props) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    addCartItem(product);
                    window.location.href = '/cart';
                } catch (err) {
                    console.error('Failed to add item to cart:', err);
                    alert('Failed to add item to cart. Please try again.');
                }
            }}
            className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
        >
            Add to bag
        </button>
    );
}
