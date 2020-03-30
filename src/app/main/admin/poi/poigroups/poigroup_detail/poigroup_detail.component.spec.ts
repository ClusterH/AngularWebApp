import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoigroupDetailComponent } from './poigroup_detail.component';

describe('PoigroupDetailComponent', () => {
  let component: PoigroupDetailComponent;
  let fixture: ComponentFixture<PoigroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoigroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoigroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
