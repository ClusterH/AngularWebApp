import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvimporterComponent } from './csvimporter.component';

describe('CsvimporterComponent', () => {
  let component: CsvimporterComponent;
  let fixture: ComponentFixture<CsvimporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvimporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvimporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
