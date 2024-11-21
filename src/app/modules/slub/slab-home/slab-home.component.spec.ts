import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabHomeComponent } from './slab-home.component';

describe('SlabHomeComponent', () => {
  let component: SlabHomeComponent;
  let fixture: ComponentFixture<SlabHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
