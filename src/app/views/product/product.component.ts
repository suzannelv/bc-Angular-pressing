import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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

  constructor(private productService: ProductService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryId'] && changes['categoryId'].currentValue) {
      this.loadProductsByCategory(changes['categoryId'].currentValue);
    }
  }

  loadProductsByCategory(categoryId: number): void {
    this.productService.getProductAll().subscribe((products) => {
      this.products = products.filter((product: any) => {
        return Number(product.category.id) === Number(categoryId);
      });
      console.log(this.products);
    });
  }
}
