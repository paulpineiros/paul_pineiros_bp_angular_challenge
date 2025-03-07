import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/interfaces/product.iterface';
import { ProductService } from '../../core/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements OnInit {
  constructor(private productService: ProductService, private router: Router){}
  products: Product[] = [];
  originalProducts: Product[] = [];
  recordsOptions = [5,10,20];
  recordsPerPage = 10;

  showModal = false;
  selectedProduct:Product|undefined;

  ngOnInit() {
      this.productService.getAllProducts().subscribe(data => {
        this.products = data;
        this.originalProducts = data;
      });
  }

  createProduct(){
    this.router.navigate(['/create']);
  }

  editProduct(id:string){
    this.router.navigate([`/product/${id}`]);
  }

  deleteProduct(){
    if(this.selectedProduct){
      this.productService.deleteProduct(this.selectedProduct.id).subscribe(() => this.products = this.products.filter(data=> data.id != this.selectedProduct!.id));
    }
    this.showModal = false;
  }

  searchProducts(event:Event){
    const inputElement = event.target as HTMLInputElement;
    const text = inputElement.value;
    if (!text) {
      this.products = [...this.originalProducts]; 
    } else {
      this.products = this.originalProducts.filter(data => 
        data.name.toLowerCase().includes(text.toLowerCase())
      );
    }
  }
  updateRecordsPerPage() {
    this.products = this.originalProducts.slice(0, this.recordsPerPage)
  }

  handleShowModal(product:Product|undefined= undefined) {
    this.selectedProduct= product;
    this.showModal = !this.showModal;
  }


}
