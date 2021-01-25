import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoblistTableComponent } from './joblist-table.component';

describe('JoblistTableComponent', () => {
  let component: JoblistTableComponent;
  let fixture: ComponentFixture<JoblistTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoblistTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoblistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
