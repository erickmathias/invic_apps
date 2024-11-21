import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpropertiesComponent } from './sproperties.component';

describe('SpropertiesComponent', () => {
  let component: SpropertiesComponent;
  let fixture: ComponentFixture<SpropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
