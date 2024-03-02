import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartProductSelectedInterface } from '../../model/productSelected.interface';
import { PaymentService } from '../../services/payment.service';
import { PaymentInterface } from '../../model/payment.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  items: CartProductSelectedInterface[] = [];
  totalQuantity: number = 0;
  isDelivery: boolean = false;
  totalPrice: number = 0;
  paymentsOptions: PaymentInterface[] = [];

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((newCart) => {
      console.log('购物车已更新', newCart);
      this.items = newCart;
      this.totalPrice = this.cartService.calculateTotalPrice(newCart);
      this.totalQuantity = this.cartService.getTotalQuantity();
    });
    // 初始加载购物车
    this.loadInitialCart();
    this.getPayments();
  }

  loadInitialCart() {
    this.items = this.cartService.getProducts();
    this.totalPrice = this.cartService.calculateTotalPrice(this.items);
    this.totalQuantity = this.cartService.getTotalQuantity();
  }

  getProducts() {
    this.items = this.cartService.getProducts();
    this.totalPrice = this.cartService.calculateTotalPrice(this.items);
  }
  getPayments() {
    this.paymentService.getPaymentMethods().subscribe((res) => {
      this.paymentsOptions = res['hydra:member'];
      console.log(this.paymentsOptions);
    });
  }

  handlePickupChoice() {
    this.isDelivery = false;
  }

  handleDeliveryChoice() {
    this.isDelivery = true;
  }

  private updateTotalQuantity(): void {
    this.totalQuantity = this.cartService.getTotalQuantity();
  }

  decrement(item: CartProductSelectedInterface) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  increment(item: CartProductSelectedInterface) {
    item.quantity++;
  }

  updateCart() {
    this.updateTotalQuantity();
    this.totalPrice = this.cartService.calculateTotalPrice(this.items);
    this.cartService.getProducts();
  }

  removeItem(uniqueId: string) {
    this.cartService.removeProduct(uniqueId);
    this.getProducts();
  }
}
