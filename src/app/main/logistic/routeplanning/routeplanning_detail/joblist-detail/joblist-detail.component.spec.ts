import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoblistDetailComponent } from './joblist-detail.component';

describe('JoblistDetailComponent', () => {
  let component: JoblistDetailComponent;
  let fixture: ComponentFixture<JoblistDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoblistDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoblistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
