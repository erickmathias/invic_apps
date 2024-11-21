import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabLayoutComponent } from './slab-layout.component';

describe('SlabLayoutComponent', () => {
  let component: SlabLayoutComponent;
  let fixture: ComponentFixture<SlabLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
