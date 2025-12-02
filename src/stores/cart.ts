import { map } from 'nanostores';

export type CartItem = {
    id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
};

export const cartItems = map<Record<number, CartItem>>({});

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
