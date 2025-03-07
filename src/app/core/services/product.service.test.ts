import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product.iterface';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo_url', date_release: '2023-01-01', date_revision: '2023-01-01' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica si hubo alguna solicitud pendiente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo_url', date_release: '2023-01-01', date_revision: '2023-01-01' },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo_url', date_release: '2023-01-02', date_revision: '2023-01-02' }
    ];

    service.getAllProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should check if id exists', () => {
    const mockResponse = true; // Supongamos que el ID existe

    service.checkIfIdExists('1').subscribe(response => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/verification/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return false when checkIfIdExists fails', () => {
    service.checkIfIdExists('999').subscribe(response => {
      expect(response).toBe(false); // En caso de error, debe devolver false
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/verification/999');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Server Error' });
  });

  it('should fetch a product by id', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo_url', date_release: '2023-01-01', date_revision: '2023-01-01' },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo_url', date_release: '2023-01-02', date_revision: '2023-01-02' }
    ];

    service.getProductById('1').subscribe(product => {
      expect(product).toEqual(mockProducts[0]);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should create a new product', () => {
    const newProduct: Product = { id: '3', name: 'Product 3', description: 'Description 3', logo: 'logo_url', date_release: '2023-03-01', date_revision: '2023-03-01' };

    service.createProduct(newProduct).subscribe(response => {
      expect(response).toBeTruthy(); // Esperamos que la respuesta sea válida (puede ajustarse según la respuesta real de la API)
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({}); // Simulamos una respuesta vacía (puede ajustarse según la respuesta real de la API)
  });

  it('should update a product', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Updated Description', logo: 'logo_url', date_release: '2023-01-01', date_revision: '2023-02-01' };

    service.updateProduct(updatedProduct).subscribe(response => {
      expect(response).toBeTruthy(); // La respuesta debería ser exitosa
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush({}); // Simulamos una respuesta vacía (puede ajustarse según la respuesta real de la API)
  });

  it('should delete a product', () => {
    const productId = '1';

    service.deleteProduct(productId).subscribe(response => {
      expect(response).toBeTruthy(); // La respuesta debería ser exitosa
    });

    const req = httpMock.expectOne(`http://localhost:3002/bp/products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Simulamos una respuesta vacía (puede ajustarse según la respuesta real de la API)
  });
});
