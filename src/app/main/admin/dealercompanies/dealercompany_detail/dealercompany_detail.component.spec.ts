import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DealerCompanyDetailComponent } from './dealercompany_detail.component';

describe('DealerCompanyDetailComponent', () => {
	let component: DealerCompanyDetailComponent;
	let fixture: ComponentFixture<DealerCompanyDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DealerCompanyDetailComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DealerCompanyDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
