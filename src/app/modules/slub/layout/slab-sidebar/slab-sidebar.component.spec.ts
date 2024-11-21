import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabSidebarComponent } from './slab-sidebar.component';

describe('SlabSidebarComponent', () => {
  let component: SlabSidebarComponent;
  let fixture: ComponentFixture<SlabSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
