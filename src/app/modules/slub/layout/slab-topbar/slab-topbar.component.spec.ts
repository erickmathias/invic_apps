import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabTopbarComponent } from './slab-topbar.component';

describe('SlabTopbarComponent', () => {
  let component: SlabTopbarComponent;
  let fixture: ComponentFixture<SlabTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
