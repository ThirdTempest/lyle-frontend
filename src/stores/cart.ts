import { map } from 'nanostores';

export type CartItem = {
    id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
};

let savedCart = {};
if (typeof localStorage !== 'undefined') {
    try {
        savedCart = JSON.parse(localStorage.getItem('cart') || '{}');
    } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        localStorage.removeItem('cart');
    }
}
export const cartItems = map<Record<number, CartItem>>(savedCart);

if (typeof localStorage !== 'undefined') {
    cartItems.subscribe(value => {
        localStorage.setItem('cart', JSON.stringify(value));
    });
}

export function addCartItem(item: Omit<CartItem, 'quantity'>) {
    const existingEntry = cartItems.get()[item.id];
    if (existingEntry) {
        cartItems.setKey(item.id, {
            ...existingEntry,
            quantity: existingEntry.quantity + 1,
        });
    } else {
        cartItems.setKey(item.id, {
            ...item,
            quantity: 1,
        });
    }
}

export function removeCartItem(itemId: number) {
    const currentItems = cartItems.get();
    const { [itemId]: _, ...rest } = currentItems;
    cartItems.set(rest);
}
