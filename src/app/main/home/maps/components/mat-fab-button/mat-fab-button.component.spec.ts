import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFabButtonComponent } from './mat-fab-button.component';

describe('MatFabButtonComponent', () => {
  let component: MatFabButtonComponent;
  let fixture: ComponentFixture<MatFabButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatFabButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatFabButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
