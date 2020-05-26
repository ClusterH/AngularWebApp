import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankDetailComponent } from './tank_detail.component';

describe('TankDetailComponent', () => {
  let component: TankDetailComponent;
  let fixture: ComponentFixture<TankDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
