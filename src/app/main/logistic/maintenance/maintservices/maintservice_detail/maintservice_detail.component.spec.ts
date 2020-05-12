import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintserviceDetailComponent } from './maintservice_detail.component';

describe('MaintserviceDetailComponent', () => {
  let component: MaintserviceDetailComponent;
  let fixture: ComponentFixture<MaintserviceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintserviceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintserviceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
