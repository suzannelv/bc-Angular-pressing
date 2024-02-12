import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import {
  ProductInterface,
  ProductResponse,
} from '../../model/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnChanges {
  @Input() categoryId?: number;
  products: ProductInterface[] = [];
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('Current categoryId in child:', this.categoryId);
    if (changes['categoryId'] && changes['categoryId'].currentValue) {
      this.loadProductsByCategory(changes['categoryId'].currentValue);
    }
  }

  loadProductsByCategory(categoryId: number): void {
    this.isLoading = true; // Start loading when the category changes
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
}
