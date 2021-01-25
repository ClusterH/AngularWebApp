import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverlistTableComponent } from './driverlist-table.component';

describe('DriverlistTableComponent', () => {
  let component: DriverlistTableComponent;
  let fixture: ComponentFixture<DriverlistTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverlistTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverlistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
