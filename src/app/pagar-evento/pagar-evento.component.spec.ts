import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarEventoComponent } from './pagar-evento.component';

describe('PagarEventoComponent', () => {
  let component: PagarEventoComponent;
  let fixture: ComponentFixture<PagarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagarEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
