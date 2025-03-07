import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.iterface';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseURL = 'http://localhost:3002/bp';
  constructor(private http: HttpClient) { }

  getAllProducts(){
    return this.http.get<Product[]>(`${this.baseURL}/products`);
  }

  checkIfIdExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseURL}/products/verification/${id}`).pipe(
      catchError(() => of(false)) 
    );
  }

  getProductById(id :string){
    return this.http.get<Product[]>(`${this.baseURL}/products`).pipe(
      map(products => products.find(product => product.id === id))
    );
  }

  createProduct(product: Product){
    return this.http.post(`${this.baseURL}/products`,product);
  }

  updateProduct(product: Product){
    return this.http.put(`${this.baseURL}/products/${product.id}`,product);
  }

  deleteProduct(id :string){
    return this.http.delete(`${this.baseURL}/products/${id}`);
  }
}
