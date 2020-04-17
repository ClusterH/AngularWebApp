import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileDetailComponent } from './userprofile_detail.component';

describe('UserProfileDetailComponent', () => {
  let component: UserProfileDetailComponent;
  let fixture: ComponentFixture<UserProfileDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
