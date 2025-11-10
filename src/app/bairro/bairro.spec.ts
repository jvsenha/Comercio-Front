import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bairro } from './bairro';

describe('Bairro', () => {
  let component: Bairro;
  let fixture: ComponentFixture<Bairro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bairro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bairro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
