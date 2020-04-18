import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevConfigDetailComponent } from './devconfig_detail.component';

describe('DevConfigDetailComponent', () => {
  let component: DevConfigDetailComponent;
  let fixture: ComponentFixture<DevConfigDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevConfigDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevConfigDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
