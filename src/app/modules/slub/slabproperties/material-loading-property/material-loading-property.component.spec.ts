import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialLoadingPropertyComponent } from './material-loading-property.component';

describe('MaterialLoadingPropertyComponent', () => {
  let component: MaterialLoadingPropertyComponent;
  let fixture: ComponentFixture<MaterialLoadingPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialLoadingPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialLoadingPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
