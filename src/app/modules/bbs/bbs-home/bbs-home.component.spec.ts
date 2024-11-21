import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsHomeComponent } from './bbs-home.component';

describe('BbsHomeComponent', () => {
  let component: BbsHomeComponent;
  let fixture: ComponentFixture<BbsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
