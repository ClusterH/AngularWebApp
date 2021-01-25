import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutelistMapComponent } from './routelist-map.component';

describe('RoutelistMapComponent', () => {
  let component: RoutelistMapComponent;
  let fixture: ComponentFixture<RoutelistMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutelistMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutelistMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
