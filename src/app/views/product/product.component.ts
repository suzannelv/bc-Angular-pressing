import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductInterface } from '../../model/product.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnChanges {
  @Input() categoryId: number | undefined;
  products: ProductInterface[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const categoryIdChange = changes['categoryId'];
    if (categoryIdChange && categoryIdChange.currentValue !== undefined) {
      this.loadProductsByCategory(categoryIdChange.currentValue);
    }
  }

  loadProductsByCategory(categoryId: number | undefined): void {
    if (!categoryId) return;

    this.isLoading = true;
    this.productService.getProductAll().subscribe({
      next: (products) => {
        if (products) {
          this.products = products.filter((product) => {
            return (
              product.category &&
              Number(product.category.id) === Number(categoryId)
            );
          });
        } else {
          this.products = [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError(
          'Une erreur est survenue lors de la récupération de la liste des produits.'
        );
        this.products = [];
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  trackByProductId(index: number, product: ProductInterface): number {
    return product.id;
  }
}
