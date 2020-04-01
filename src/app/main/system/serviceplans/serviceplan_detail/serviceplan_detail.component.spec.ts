import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceplanDetailComponent } from './serviceplan_detail.component';

describe('ServiceplanDetailComponent', () => {
  let component: ServiceplanDetailComponent;
  let fixture: ComponentFixture<ServiceplanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceplanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceplanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
