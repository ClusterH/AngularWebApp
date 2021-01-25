import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutelistHeaderComponent } from './routelist-header.component';

describe('RoutelistHeaderComponent', () => {
  let component: RoutelistHeaderComponent;
  let fixture: ComponentFixture<RoutelistHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutelistHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutelistHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
