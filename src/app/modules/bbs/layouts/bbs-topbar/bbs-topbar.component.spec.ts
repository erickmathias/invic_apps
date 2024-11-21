import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsTopbarComponent } from './bbs-topbar.component';

describe('BbsTopbarComponent', () => {
  let component: BbsTopbarComponent;
  let fixture: ComponentFixture<BbsTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
