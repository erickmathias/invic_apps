import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementMembersComponent } from './element-members.component';

describe('ElementMembersComponent', () => {
  let component: ElementMembersComponent;
  let fixture: ComponentFixture<ElementMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
