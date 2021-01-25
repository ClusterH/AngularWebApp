import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriplistComponent } from './triplist.component';

describe('TriplistComponent', () => {
  let component: TriplistComponent;
  let fixture: ComponentFixture<TriplistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriplistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
