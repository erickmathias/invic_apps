import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabFooterComponent } from './slab-footer.component';

describe('SlabFooterComponent', () => {
  let component: SlabFooterComponent;
  let fixture: ComponentFixture<SlabFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
