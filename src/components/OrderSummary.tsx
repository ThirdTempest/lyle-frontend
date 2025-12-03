import React from 'react';
import { useStore } from '@nanostores/react';
import { cartItems } from '../stores/cart';

export default function OrderSummary() {
    const $cartItems = useStore(cartItems);
    const items = Object.values($cartItems);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            <ul role="list" className="mt-4 divide-y divide-gray-200">
                {items.map((item) => (
                    <li key={item.id} className="flex py-4 space-x-4">
                        <img src={item.image_url} alt={item.name} className="flex-none w-16 h-16 rounded-md object-center object-cover bg-gray-100" />
                        <div className="flex-auto flex flex-col">
                            <div>
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                ))}
            </ul>
            <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between">
                <p className="text-base font-medium text-gray-900">Total</p>
                <p className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</p>
            </div>
        </div>
    );
}
