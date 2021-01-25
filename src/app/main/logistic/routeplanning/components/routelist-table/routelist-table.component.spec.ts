import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutelistTableComponent } from './routelist-table.component';

describe('RoutelistTableComponent', () => {
  let component: RoutelistTableComponent;
  let fixture: ComponentFixture<RoutelistTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutelistTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutelistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
