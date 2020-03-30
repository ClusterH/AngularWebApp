import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierDetailComponent } from './carrier_detail.component';

describe('CarrierDetailComponent', () => {
  let component: CarrierDetailComponent;
  let fixture: ComponentFixture<CarrierDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
