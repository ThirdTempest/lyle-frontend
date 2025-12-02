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
            onClick={() => addCartItem(product)}
            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
        >
            Add to bag
        </button>
    );
}
