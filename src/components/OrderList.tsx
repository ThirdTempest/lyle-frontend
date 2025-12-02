import React, { useEffect, useState } from 'react';

interface Order {
    id: number;
    total_amount: string;
    status: string;
    created_at: string;
    items: {
        id: number;
        product: {
            name: string;
            image_url: string;
        };
        quantity: number;
        price: string;
    }[];
}

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center py-12">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-900">No orders found</h2>
                <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
                <div className="mt-6">
                    <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        Start Shopping
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <li key={order.id}>
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                    Order #{order.id}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Total: ${order.total_amount}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <p>
                                        Placed on <time dateTime={order.created_at}>{new Date(order.created_at).toLocaleDateString()}</time>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-900">Items</h4>
                                <ul className="mt-2 divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="py-2 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500">{item.quantity}x</span>
                                                <span className="ml-2 text-sm text-gray-900">{item.product.name}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">${item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
