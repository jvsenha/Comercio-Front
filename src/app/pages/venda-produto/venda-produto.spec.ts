import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaProduto } from './venda-produto';

describe('VendaProduto', () => {
  let component: VendaProduto;
  let fixture: ComponentFixture<VendaProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
