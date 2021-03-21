import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRouteOptionComponent } from './create-route-option.component';

describe('CreateRouteOptionComponent', () => {
  let component: CreateRouteOptionComponent;
  let fixture: ComponentFixture<CreateRouteOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRouteOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRouteOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
