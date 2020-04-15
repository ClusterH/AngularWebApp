import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyDetailComponent } from './insurancecompany_detail.component';

describe('InsuranceCompanyDetailComponent', () => {
  let component: InsuranceCompanyDetailComponent;
  let fixture: ComponentFixture<InsuranceCompanyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompanyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
