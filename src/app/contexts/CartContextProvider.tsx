'use client';
import { CartObject } from '@/types/CartObject';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

type CartContextType = {
  cartItems: CartObject[];
  setCartItems: Dispatch<SetStateAction<CartObject[]>>;
  handleAddToCart: (cartObject: CartObject) => void;
  handleDeleteFromCart: (itemId: number) => void;
  changeCount: (itemId: number,side: number ) => void
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  setCartItems: () => undefined,
  handleAddToCart: () => undefined,
  handleDeleteFromCart: () => undefined,
  changeCount: () => undefined,
});

export function CartContextProvider({ children }: { children: any }) {
  const [cartItems, setCartItems] = useState([] as CartObject[]);

  useEffect(() => {
    if (!localStorage.getItem('cart')) {
      localStorage.setItem('cart', '[]');
    }
    setCartItems(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const handleAddToCart = (cartObject: CartObject) => {
    const tempCart = [...cartItems];
    const existingProductIndex = tempCart.findIndex((item: CartObject) => item.id === cartObject.id);

    if (existingProductIndex === -1) {
      tempCart.push(cartObject);
    }

    setCartItems(tempCart);
    localStorage.setItem('cart', JSON.stringify(tempCart));
  };

  const handleDeleteFromCart = (itemId: number) => {
    const tempCart = [...cartItems].filter((item) => item.id !== itemId);

    setCartItems(tempCart);
    localStorage.setItem('cart', JSON.stringify(tempCart));
  }

  const changeCount = (itemId: number,side: number ) => {
    const tempCart = [...cartItems];
    const existingProduct = tempCart.find((item: CartObject) => item.id === itemId);
    if (existingProduct && existingProduct.count + side > 0) {
    existingProduct.count += side;
    }

    setCartItems(tempCart);
    localStorage.setItem('cart', JSON.stringify(tempCart));
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        handleAddToCart,
        handleDeleteFromCart,
        changeCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
