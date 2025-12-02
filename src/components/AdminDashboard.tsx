import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Stats {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    total_users: number;
    recent_orders: any[];
    monthly_sales: { sums: number; months: string }[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/admin/stats')
            .then((res) => res.json())
            .then((data) => setStats(data));
    }, []);

    if (!stats) return <div>Loading stats...</div>;

    const chartData = {
        labels: stats.monthly_sales.map((item) => item.months),
        datasets: [
            {
                label: 'Monthly Sales',
                data: stats.monthly_sales.map((item) => item.sums),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    };

    return (
        <div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">${stats.total_revenue}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total_orders}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total_products}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total_users}</dd>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Sales Overview</h3>
                <div className="h-64">
                    <Bar options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Orders</h3>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                        {stats.recent_orders.map((order) => (
                            <li key={order.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">Order #{order.id}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            ${order.total_amount}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
