import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../core/services/product.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Usado para evitar errores con elementos desconocidos

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: Partial<ProductService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    // Mocking services
    mockProductService = {
      getAllProducts: jest.fn().mockReturnValue(of([{ id: '1', name: 'Product 1' }]))
    };

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignoramos elementos no reconocidos como 'app-modal'
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta cambios para que el componente se renderice
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    component.ngOnInit();
    expect(component.products.length).toBe(1); // Esperamos que haya un producto
    expect(component.products[0].name).toBe('Product 1');
  });

  it('should navigate to create product page on createProduct', () => {
    component.createProduct();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/create']);
  });

  it('should navigate to edit product page on editProduct', () => {
    component.editProduct('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/product/1']);
  });

  it('should filter products when searchProducts is called with text', () => {
    component.originalProducts = [
      { id: '1', name: 'Product 1', logo:'test', description:'test', date_release:'test', date_revision:'test' },
      { id: '2', name: 'Product 2', logo:'test', description:'test', date_release:'test', date_revision:'test' }
    ];
    component.searchProducts({ target: { value: 'Product 1' } } as any);
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Product 1');
  });

  it('should reset products when searchProducts is called with empty text', () => {
    component.originalProducts = [
      { id: '1', name: 'Product 1', logo:'test', description:'test', date_release:'test', date_revision:'test' },
      { id: '2', name: 'Product 2', logo:'test', description:'test', date_release:'test', date_revision:'test' }
    ];
    component.searchProducts({ target: { value: '' } } as any);
    expect(component.products.length).toBe(2); // Deberían mostrarse los dos productos
  });


  it('should not delete product if no product is selected', () => {
    component.selectedProduct = undefined;
    component.deleteProduct();
    expect(component.products.length).toBe(1); // No debe haber eliminación
  });
});
