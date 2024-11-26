import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarEventoComponent } from './consultar-evento.component';

describe('ConsultarEventoComponent', () => {
  let component: ConsultarEventoComponent;
  let fixture: ComponentFixture<ConsultarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
