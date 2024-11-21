import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectElementsComponent } from './project-elements.component';

describe('ProjectElementsComponent', () => {
  let component: ProjectElementsComponent;
  let fixture: ComponentFixture<ProjectElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectElementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
