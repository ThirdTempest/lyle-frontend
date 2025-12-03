import React from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, removeCartItem, type CartItem } from '../stores/cart';

export default function CartList() {
    const $cartItems = useStore(cartItems);
    const items = Object.values($cartItems);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-900">Your bag is empty</h2>
                <p className="mt-1 text-gray-500">Start shopping to add items to your bag.</p>
                <div className="mt-6">
                    <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        Continue Shopping
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul role="list" className="divide-y divide-gray-200">
                {items.map((item) => (
                    <li key={item.id} className="px-4 py-4 sm:px-6 flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                            <img src={item.image_url} alt={item.name} className="h-full w-full object-center object-cover" />
                        </div>
                        <div className="ml-4 flex-1 flex flex-col">
                            <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                        <a href={`/products/${item.id}`}>{item.name}</a>
                                    </h3>
                                    <p className="ml-4">${item.price * item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                                <p className="text-gray-500">Qty {item.quantity}</p>

                                <div className="flex">
                                    <button
                                        type="button"
                                        onClick={() => removeCartItem(item.id)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                    <a href="/checkout" className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Checkout
                    </a>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                        or{' '}
                        <a href="/" className="text-indigo-600 font-medium hover:text-indigo-500">
                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
