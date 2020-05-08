import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceitemDetailComponent } from './serviceitem_detail.component';

describe('ServiceitemDetailComponent', () => {
  let component: ServiceitemDetailComponent;
  let fixture: ComponentFixture<ServiceitemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceitemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceitemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
