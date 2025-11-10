import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cidade } from './cidade';

describe('Cidade', () => {
  let component: Cidade;
  let fixture: ComponentFixture<Cidade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cidade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cidade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
