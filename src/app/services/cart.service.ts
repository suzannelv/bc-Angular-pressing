import { Injectable } from '@angular/core';
import {
  CartProductSelectedInterface,
  CreateProductSelectedInterface,
} from '../model/productSelected.interface';
import { BehaviorSubject, Observable } from 'rxjs';

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

  // addProduct(product: CreateProductSelectedInterface): void {
  //   const cartLocalStorage = localStorage.getItem(CART_STORAGE_KEY);

  //   let cart: CartProductSelectedInterface[];

  //   if (cartLocalStorage === null) {
  //     // Panier vide : non défini dans le localStorage
  //     cart = [];
  //   } else {
  //     // Panier existant : on transforme la chaîne de caractères en tableau de produits
  //     cart = JSON.parse(cartLocalStorage) as CartProductSelectedInterface[];
  //   }

  //   cart.push(product);
  //   localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  // }

  addProduct(product: CreateProductSelectedInterface): void {
    let currentCart = this.getProducts(); // 获取当前购物车的内容

    const index = currentCart.findIndex((p) => p.product === product.product);

    if (index !== -1) {
      currentCart[index].quantity += product.quantity;
    } else {
      currentCart.push(product);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart)); // 更新localStorage
    this.cart.next(currentCart); // 更新 BehaviorSubject 以通知订阅者购物车已更改
  }

  getProducts(): CartProductSelectedInterface[] {
    const cartLocalStorage = localStorage.getItem(CART_STORAGE_KEY);

    // Panier vide : non défini dans le localStorage
    if (cartLocalStorage === null) {
      return [];
    }
    console.log('Loaded cart items:', JSON.parse(cartLocalStorage));

    const cart = JSON.parse(cartLocalStorage) as CartProductSelectedInterface[];
    console.log('Loaded cart items from localStorage:', cart);
    return cart;
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
      const priceUni = item.price;
      const quantity = item.quantity;
      const optionCoeffTotal = item.serviceCoefficent.reduce(
        (acc, curr) => acc + curr,
        0
      );
      const materialCoeff = item.materialCoefficent;
      total +=
        (priceUni + priceUni * optionCoeffTotal + priceUni * materialCoeff) *
        quantity;
    });
    return total;
  }
}
