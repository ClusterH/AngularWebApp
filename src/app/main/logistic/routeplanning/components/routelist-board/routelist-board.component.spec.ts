import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutelistBoardComponent } from './routelist-board.component';

describe('RoutelistBoardComponent', () => {
  let component: RoutelistBoardComponent;
  let fixture: ComponentFixture<RoutelistBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutelistBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutelistBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
