import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductInterface } from '../../model/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnChanges {
  @Input() categoryId: number | undefined;
  products: ProductInterface[] = [];
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const categoryIdChange = changes['categoryId'];
    if (categoryIdChange && categoryIdChange.currentValue !== undefined) {
      this.loadProductsByCategory(categoryIdChange.currentValue);
    }
    console.log('categoryId dans product:', this.categoryId);
  }

  loadProductsByCategory(categoryId: number | undefined): void {
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
        console.log('Filtered products:', this.products);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  trackByProductId(index: number, product: ProductInterface): number {
    return product.id; // 假设每个产品都有唯一的 ID
  }
}
