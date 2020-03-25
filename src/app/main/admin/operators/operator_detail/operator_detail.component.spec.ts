import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorDetailComponent } from './operator_detail.component';

describe('OperatorDetailComponent', () => {
  let component: OperatorDetailComponent;
  let fixture: ComponentFixture<OperatorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
