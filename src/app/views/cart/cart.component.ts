import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartProductSelectedInterface } from '../../model/productSelected.interface';
import { PaymentService } from '../../services/payment.service';
import { PaymentInterface } from '../../model/payment.interface';
import { ClickCollectFormComponent } from '../../components/click-collect-form/click-collect-form.component';
import { DeliveryFormComponent } from '../../components/delivery-form/delivery-form.component';
import { AuthService } from '../../services/auth.service';
import { ClientInfo } from '../../model/clientInfo.interface';
import { OrderDetailService } from '../../services/order-detail.service';
import { OrderDetailInterface } from '../../model/orderDetail.interface';
import { NotificationService } from '../../services/notification.service';

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
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((newCart) => {
      this.items = newCart;
      this.totalPrice = this.cartService.calculateTotalPrice(newCart);
      this.totalQuantity = this.cartService.getTotalQuantity();
    });
    // initialiser toutes les données dans le panier
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
          this.isLoadingClientInfo = false;
        },
        error: () => {
          this.notificationService.showError(
            'Une erreur survenue lors de téléchargement les données du client.'
          );
          this.isLoadingClientInfo = false;
        },
      });
    } else {
      this.isLoadingClientInfo = false;
    }
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
      this.notificationService.showError(
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
      this.notificationService.showError("La date saisie n'est pas valide.");
      return;
    }

    const allProductsSelecte = this.items.map((item) => ({
      product: item.product,
      material: item.material,
      totalPrice: item.price,
      quantity: item.quantity,
    }));

    let ClientId = '/api/clients/' + this.clientInfo?.id;
    const orderDetail: OrderDetailInterface = {
      depositDate: depositDate,
      retrieveDate: retrieveDate,
      payment: this.selectedPaymentMethod,
      client: ClientId,
      emp: '/api/employees/677',
      orderStatus: '/api/order_statuses/169',
      delivery: this.isDelivery,
      productSelected: allProductsSelecte,
    };

    this.orderDetailService.createOrder(orderDetail).subscribe({
      next: () => {
        this.notificationService.showError('Merci pour votre commande.');
      },
      error: () => {
        this.notificationService.showError('Echouer à créer la commande.');
      },
    });
  }
}
