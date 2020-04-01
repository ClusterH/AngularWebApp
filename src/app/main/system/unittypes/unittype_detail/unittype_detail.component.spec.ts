import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnittypeDetailComponent } from './unittype_detail.component';

describe('UnittypeDetailComponent', () => {
  let component: UnittypeDetailComponent;
  let fixture: ComponentFixture<UnittypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnittypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnittypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
