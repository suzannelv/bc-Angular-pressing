import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartProductSelectedInterface } from '../../model/productSelected.interface';
import { PaymentService } from '../../services/payment.service';
import { PaymentInterface } from '../../model/payment.interface';
import { ClickCollectFormComponent } from '../../components/click-collect-form/click-collect-form.component';
import { DeliveryFormComponent } from '../../components/delivery-form/delivery-form.component';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';
import { ClientInfo } from '../../model/clientInfo.interface';
import { OrderDetailService } from '../../services/order-detail.service';
import { OrderDetailInterface } from '../../model/orderDetail.interface';

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
  clientInfo: ClientInfo | null = null;
  isLoadingClientInfo: boolean = true;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private orderDetailService: OrderDetailService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((newCart) => {
      // console.log('购物车已更新', newCart);
      this.items = newCart;
      console.log(this.items);
      this.totalPrice = this.cartService.calculateTotalPrice(newCart);
      this.totalQuantity = this.cartService.getTotalQuantity();
    });
    // 初始加载购物车
    this.loadInitialCart();
    this.getPayments();
    this.getClientInfo();
  }

  getClientInfo() {
    if (this.authService.isLoggedIn()) {
      this.isLoadingClientInfo = true;
      this.authService.getCurrentUser().subscribe({
        next: (data) => {
          this.clientInfo = data;
          console.log('购物车中客人信息：', this.clientInfo);
          this.isLoadingClientInfo = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoadingClientInfo = false;
        },
      });
    } else {
      console.log("Utilisateur n'est pas connecté");
      this.isLoadingClientInfo = false;
    }
  }

  loadInitialCart() {
    this.items = this.cartService.getProducts();
    console.log(this.items);
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
      // console.log(this.paymentsOptions);
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
    this.updateCart();
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

  submitOrder() {
    let clickCollectFormData;
    let deliveryFormData;
    if (!this.isDelivery) {
      clickCollectFormData = this.clickCollectFormComponent?.submitForm();
    } else {
      deliveryFormData = this.deliveryFormComponent?.submitForm();
    }

    if (!this.authService.isLoggedIn()) {
      this.showLoginMessage = true;
      this.cdRef.detectChanges();
      return;
    }

    if (this.isLoadingClientInfo || !this.clientInfo) {
      console.error(
        'Les informations du client sont encore en cours de chargement ou manquantes.'
      );
      return;
    }
    // Convertissez les chaînes de caractères en objets Date avec une valeur par défaut si undefined
    const depositDateString: string =
      this.deliveryFormComponent?.deliveryInfo.depositDate ?? '';
    const retrieveDateString: string =
      this.deliveryFormComponent?.deliveryInfo.retrieveDate ?? '';

    // Créez les objets Date à partir des chaînes de caractères
    const depositDate: Date = depositDateString
      ? new Date(depositDateString)
      : new Date();
    const retrieveDate: Date = retrieveDateString
      ? new Date(retrieveDateString)
      : new Date();

    // Vérifiez que les conversions sont valides (non NaN)
    if (isNaN(depositDate.getTime()) || isNaN(retrieveDate.getTime())) {
      console.error('Invalid date');
      return;
    }

    const allProductsSelecte = this.items.map((item) => ({
      product: item.product,
      material: item.material,
      totalPrice: item.price,
      quantity: item.quantity,
    }));
    console.log('allProductsSelected:', allProductsSelecte);

    let ClientId = '/api/clients/' + this.clientInfo?.id;
    const orderDetail: OrderDetailInterface = {
      depositDate: depositDate,
      retrieveDate: retrieveDate,
      payment: this.selectedPaymentMethod,
      client: ClientId,
      emp: '/api/employees/652',
      orderStatus: '/api/order_statuses/162',
      delivery: this.isDelivery,
      productSelected: allProductsSelecte,
    };
    console.log(orderDetail);

    this.orderDetailService.createOrder(orderDetail).subscribe({
      next: (response) => {
        console.log('order created successfully', response);
        // this.router.navigate(['/order-success']);
      },
      error: (error) => {
        console.error('Failed to create order', error);
      },
    });
  }
}
