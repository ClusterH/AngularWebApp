import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysCommandDetailComponent } from './syscommand_detail.component';

describe('SysCommandDetailComponent', () => {
  let component: SysCommandDetailComponent;
  let fixture: ComponentFixture<SysCommandDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysCommandDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysCommandDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
