import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsLayoutComponent } from './bbs-layout.component';

describe('BbsLayoutComponent', () => {
  let component: BbsLayoutComponent;
  let fixture: ComponentFixture<BbsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
