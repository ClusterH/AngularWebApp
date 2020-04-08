import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonegroupDetailComponent } from './zonegroup_detail.component';

describe('ZonegroupDetailComponent', () => {
  let component: ZonegroupDetailComponent;
  let fixture: ComponentFixture<ZonegroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonegroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonegroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
