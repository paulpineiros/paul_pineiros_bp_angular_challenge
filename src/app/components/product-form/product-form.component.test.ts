import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: ProductService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        ProductService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form for editing if id is in the route params', () => {
    const product = { 
   
      name: 'Product Name', 
      description: 'Product Description', 
      logo: 'product-logo.png', 
      date_release: '2023-01-01', 
      date_revision: '2023-02-01' 
    };
    /* @ts-ignore */
    jest.spyOn(productService, 'getProductById').mockReturnValue(of(product));

    component.ngOnInit();
    
    expect(component.isEdit).toBe(true);
    expect(component.productForm.value).toEqual(product);
  });

  it('should not submit form if form is invalid', () => {
    jest.spyOn(productService, 'createProduct');

    component.productForm.setValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });

    component.onSubmit();

    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  it('should show field error message for required fields', () => {
    const control = component.productForm.controls['name'];
    control.markAsTouched();
    control.setValue('');
    
    expect(component.getFieldError('name')).toBe('Este campo es requerido');
  });

  it('should reset form when onReset is called', () => {
    jest.spyOn(router, 'navigate');
    
    component.onReset();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.productForm.get('id')?.value).toBe('');
  });
});
