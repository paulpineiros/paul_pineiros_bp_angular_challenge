import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir onClose cuando se llame a close()', () => {
    jest.spyOn(component.onClose, 'emit');

    component.close();

    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('debería emitir onConfirm cuando se llame a confirm()', () => {
    jest.spyOn(component.onConfirm, 'emit');

    component.confirm();

    expect(component.onConfirm.emit).toHaveBeenCalled();
  });

  it('debería mostrar el título recibido por @Input()', () => {
    component.titulo = 'Test Modal';
    component.isOpen = true;
    fixture.detectChanges();

    const modalTitle = fixture.nativeElement.querySelector('p');
    expect(modalTitle.textContent).toContain('Test Modal');
  });
});
