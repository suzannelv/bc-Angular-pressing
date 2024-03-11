import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartProductSelectedInterface } from '../../model/productSelected.interface';
import { PaymentService } from '../../services/payment.service';
import { PaymentInterface } from '../../model/payment.interface';
import { ClickCollectFormComponent } from '../../components/click-collect-form/click-collect-form.component';
import { DeliveryFormComponent } from '../../components/delivery-form/delivery-form.component';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  @ViewChild(ClickCollectFormComponent)
  clickCollectFormComponent?: ClickCollectFormComponent;
  @ViewChild(DeliveryFormComponent)
  deliveryFormComponent?: DeliveryFormComponent;

  items: CartProductSelectedInterface[] = [];
  totalQuantity: number = 0;
  isDelivery: boolean = false;
  totalPrice: number = 0;
  paymentsOptions: PaymentInterface[] = [];
  selectedPaymentMethod: string = '';
  showLoginMessage = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
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

  // traiter le choix de paiement
  onPaymentMethodChange(event: any) {
    const selectdEl = event.target as HTMLInputElement;
    this.selectedPaymentMethod = selectdEl.value;
  }

  // Fonction pour vérifier si les champs requis sont remplis ; dans le cas contraire, le bouton pour passer la commande est désactivé.
  isFormValid(): boolean {
    const isPaymentMethodSelected = this.selectedPaymentMethod !== '';
    const clickCollect =
      (this.clickCollectFormComponent?.formData &&
        Object.keys(this.clickCollectFormComponent.formData).length > 0) ||
      false;
    // Vérifie si l'objet deliveryInfo a été défini et contient des clés;
    const delivery =
      (this.deliveryFormComponent?.deliveryInfo &&
        Object.keys(this.deliveryFormComponent.deliveryInfo).length > 0) ||
      false;
    return isPaymentMethodSelected && (clickCollect || delivery);
  }

  submitForms() {
    let clickCollectFormData;
    let deliveryFormData;

    if (!this.isDelivery) {
      clickCollectFormData = this.clickCollectFormComponent?.submitForm();
    } else {
      deliveryFormData = this.deliveryFormComponent?.submitForm();
    }

    if (!this.authService.isLoggedIn()) {
      this.showLoginMessage = true;
    } else {
      this.router.navigate(['/home']);
    }
    // console.log('Click & Collect Form Data:', clickCollectFormData);
    // console.log('Delivery Form Data:', deliveryFormData);
    // console.log('Selected Payment Method:', this.selectedPaymentMethod);
  }
}
