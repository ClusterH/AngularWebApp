import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegeDetailComponent } from './privilege_detail.component';

describe('PrivilegeDetailComponent', () => {
  let component: PrivilegeDetailComponent;
  let fixture: ComponentFixture<PrivilegeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivilegeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
