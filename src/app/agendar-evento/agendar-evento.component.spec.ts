import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarEventoComponent } from './agendar-evento.component';

describe('AgendarEventoComponent', () => {
  let component: AgendarEventoComponent;
  let fixture: ComponentFixture<AgendarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
