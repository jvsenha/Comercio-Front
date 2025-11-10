import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepComponent } from './cep';

describe('Cep', () => {
  let component: CepComponent;
  let fixture: ComponentFixture<CepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
