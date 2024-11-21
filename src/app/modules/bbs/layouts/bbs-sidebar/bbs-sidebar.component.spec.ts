import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsSidebarComponent } from './bbs-sidebar.component';

describe('BbsSidebarComponent', () => {
  let component: BbsSidebarComponent;
  let fixture: ComponentFixture<BbsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
