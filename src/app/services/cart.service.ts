import { Injectable } from '@angular/core';
import {
  CartProductSelectedInterface,
  CreateProductSelectedInterface,
} from '../model/productSelected.interface';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

const CART_STORAGE_KEY = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<CartProductSelectedInterface[]>(
    this.getProducts()
  );
  cart$ = this.cart.asObservable();

  constructor() {}

  addProduct(product: CreateProductSelectedInterface): void {
    // récupérer les produits dans le panier
    let currentCart = this.getProducts();

    const index = currentCart.findIndex((p) => p.uniqueId === product.uniqueId);

    if (index !== -1) {
      currentCart[index].quantity += product.quantity;
    } else {
      currentCart.push(product);
    }
    // Mise à jour les produits dans localStrage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
    // Mise à jour du BehaviorSubject pour informer les abonnés des modifications apportées au panier
    this.cart.next(currentCart);
  }

  getProducts(): CartProductSelectedInterface[] {
    const cartLocalStorage = localStorage.getItem(CART_STORAGE_KEY);

    // Panier vide : non défini dans le localStorage
    if (cartLocalStorage === null) {
      return [];
    }
    // console.log('Loaded cart items:', JSON.parse(cartLocalStorage));

    const cart = JSON.parse(cartLocalStorage) as CartProductSelectedInterface[];
    // console.log('Loaded cart items from localStorage:', cart);
    return cart;
  }

  removeProduct(uniqueId: string) {
    let currentCart = this.getProducts();
    const newCart = currentCart.filter((item) => item.uniqueId !== uniqueId);

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    this.cart.next(newCart);
  }

  getTotalQuantity(): number {
    let totalQuantity = 0;
    const currentCart = this.getProducts();
    currentCart.forEach((item) => {
      totalQuantity += item.quantity;
    });
    return totalQuantity;
  }

  calculateTotalPrice(items: CartProductSelectedInterface[]): number {
    let total = 0;
    items.forEach((item) => {
      // console.log(
      //   `服务中价格: ${item.productName}, Quantity: ${item.quantity}, Price: ${item.price}`
      // );
      total += item.price * item.quantity;
    });
    // console.log('Calculated cart total:', total);
    return parseFloat(total.toFixed(2));
  }
}
