import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesaPallOrderRequestComponent } from './pesa-pall-order-request.component';

describe('PesaPallOrderRequestComponent', () => {
  let component: PesaPallOrderRequestComponent;
  let fixture: ComponentFixture<PesaPallOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PesaPallOrderRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PesaPallOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
