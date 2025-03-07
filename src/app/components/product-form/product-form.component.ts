import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Observable, of } from 'rxjs';
import { debounceTime, map, catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit{
  productForm: FormGroup;
  isEdit = false;
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ){
      this.productForm = this.formBuilder.group({
        id: new FormControl('', [Validators.required], [this.uniqueIdValidator(this.productService)]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        logo: new FormControl('', [Validators.required]),
        date_release: new FormControl('', [Validators.required]),
        date_revision: new FormControl('', [Validators.required]),
      });
  }
  isValidField(field: string) {
    return (
      this.productForm.controls[field].errors &&
      this.productForm.controls[field].touched
    );
  }

  getFieldError(field: string) {
    const errors = this.productForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
      }
    }

    return null;
  }
  

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEdit = true;
      
      this.productService.getProductById(id).subscribe(product => {
        if(product){
          this.productForm.patchValue(product);
        }
      });

      this.productForm.controls['id'].disable();
    }
  }

  onSubmit() {
    if(this.productForm.invalid){
      return
    }
    if (this.isEdit) {
      this.productService.updateProduct(this.productForm.getRawValue()).subscribe(() => this.router.navigate(['/']));
    } else {
      this.productService.createProduct(this.productForm.value).subscribe(() => this.router.navigate(['/']));
    }
  }

  uniqueIdValidator(productService: ProductService):AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ idExists: boolean } | null> => {
      if (!control.value || this.isEdit) {
        return of(null);
      }
  
      return productService.checkIfIdExists(control.value).pipe(
        debounceTime(500), // Espera 500ms para evitar múltiples llamadas seguidas
        switchMap((exists) => (exists ? of({ idExists: true }) : of(null))),
        catchError(() => of(null)) // Si hay error, no mostrar mensaje de error
      );;
    };
  }

  onReset(){
    if(this.isEdit){
      this.router.navigate(['/'])
    } else {
      this.productForm = this.formBuilder.group({
        id: new FormControl('', [Validators.required], [this.uniqueIdValidator(this.productService)]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        logo: new FormControl('', [Validators.required]),
        date_release: new FormControl('', [Validators.required]),
        date_revision: new FormControl('', [Validators.required]),
      });
    }
  }
}
