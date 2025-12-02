import React from 'react';
import { useStore } from '@nanostores/react';
import { cartItems } from '../stores/cart';

export default function CartCounter() {
    const $cartItems = useStore(cartItems);
    const count = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);

    if (count === 0) return null;

    return (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count}
        </span>
    );
}
