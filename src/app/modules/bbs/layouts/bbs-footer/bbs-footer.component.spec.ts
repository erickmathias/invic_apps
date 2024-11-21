import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsFooterComponent } from './bbs-footer.component';

describe('BbsFooterComponent', () => {
  let component: BbsFooterComponent;
  let fixture: ComponentFixture<BbsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
