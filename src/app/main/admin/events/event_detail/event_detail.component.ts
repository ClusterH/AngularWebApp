import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as eventsEnglish } from 'app/main/admin/events/i18n/en';
import { locale as eventsFrench } from 'app/main/admin/events/i18n/fr';
import { locale as eventsPortuguese } from 'app/main/admin/events/i18n/pt';
import { locale as eventsSpanish } from 'app/main/admin/events/i18n/sp';
import { EventDetail } from 'app/main/admin/events/model/event.model';
import { EventDetailDataSource } from "app/main/admin/events/services/event_detail.datasource";
import { EventDetailService } from 'app/main/admin/events/services/event_detail.service';
import { BehaviorSubject, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
	selector: 'app-event-detail',
	templateUrl: './event_detail.component.html',
	styleUrls: ['./event_detail.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations
})

export class EventDetailComponent implements OnInit {
	public event: any;
	pageType: string;
	evType: string = 'new';
	userConncode: string;
	userID: number;
	userObjectList: any;

	eventForm: FormGroup;
	event_detail: EventDetail = {};

	eventConditionList: string[];

	displayedColumns: string[] = ['name'];
	displayedConditionColumns: string[] = ['id', 'description'];
	displayedUnitColumns: string[] = ['id', 'name'];

	pageIndex = 0;
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 25, 100];

	disable_condition: boolean = true;

	ev_condition: string = '';
	speed_condition: string = '';
	speed_unit: string = '';
	longstop_unit: string = '';
	idle_unit: string = '';
	noreporton_unit: string = '';
	noreportoff_unit: string = '';
	fuel_tank: string = '';
	fuel_condition: string = '';
	fuel_unit: string = '';
	temp_sensor: string = '';
	temp_condition: string = '';
	temp_unit: string = '';
	tempmin: number = 0;
	tempmax: number = 5;
	poi_condition: string = '';
	zone_condition: string = '';

	dataSource: EventDetailDataSource;

	dataSourceEvCondition: EventDetailDataSource;
	dataSourceCompany: EventDetailDataSource;
	dataSourceGroup: EventDetailDataSource;
	dataSourceUnit: EventDetailDataSource;
	dataSourcePoi: EventDetailDataSource;
	dataSourceZone: EventDetailDataSource;
	dataSourceDigitalInput1: EventDetailDataSource;
	dataSourceDigitalInput2: EventDetailDataSource;

	selectionAmount: any;

	filter_string: string = '';
	method_string: string = '';

	loadUnitList_flag: boolean = false;
	private flag = new BehaviorSubject<boolean>(false);

	unitSelection = new SelectionModel<Element>(false, []);

	@ViewChild(MatPaginator, { static: true })
	paginatorCompany: MatPaginator;
	@ViewChild('paginatorGroup', { read: MatPaginator })
	paginatorGroup: MatPaginator;
	@ViewChild('paginatorUnit', { read: MatPaginator })
	paginatorUnit: MatPaginator;
	@ViewChild('paginatorPoi', { read: MatPaginator })
	paginatorPoi: MatPaginator;
	@ViewChild('paginatorZone', { read: MatPaginator })
	paginatorZone: MatPaginator;
	// @ViewChild('paginatorDigitalInput', {read: MatPaginator})
	//   paginatorDigitalInput: MatPaginator;

	constructor(
		public eventDetailService: EventDetailService,
		private _fuseTranslationLoaderService: FuseTranslationLoaderService,

		private _formBuilder: FormBuilder,
		public _matDialog: MatDialog,
		private router: Router,
	) {
		this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);

		this.event = localStorage.getItem("event_detail") ? JSON.parse(localStorage.getItem("event_detail")) : '';

		this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
		this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
		this.userObjectList = JSON.parse(localStorage.getItem('userObjectList'));

		if (this.event != '') {
			this.pageType = 'edit';
			this.eventDetailService.current_eventID = this.event.id;
			this.event_detail = this.event;

			this.event_detail.conncode = this.userConncode;
			this.event_detail.userid = this.userID.toString();

			delete this.event_detail.company;
			delete this.event_detail.group;
		}
		else {
			this.pageType = 'new';
			this.eventDetailService.current_eventID = 0;
			this.event_detail = new EventDetail;
			this.event_detail.conncode = this.userConncode;
			this.event_detail.userid = this.userID.toString();

			delete this.event_detail.company;
			delete this.event_detail.group;

			this.event = this.event_detail;
		}

		this.filter_string = '';
	}

	ngOnInit(): void {

		this.eventForm = this._formBuilder.group({
			name: [null, Validators.required],
			company: [null],
			group: [null],
			unit: [null],
			poiandgroup: [null],
			zoneandgroup: [null],
			ev_condition: [null],
			speedinput: [null],
			offhourstart: [null],
			offhourend: [null],
			latestart: [null],
			longstopinput: [null],
			idleinput: [null],
			noreportoninput: [null],
			noreportoffinput: [null],
			fuelinput: [null],
			tempinput: [null],
			deviceinput: [null],
			digitalinput1: [null],
			digitalinput2: [null],
			filterstring: [null],
			wholeCompany: [null],
		});

		this.dataSourceEvCondition = new EventDetailDataSource(this.eventDetailService);
		this.dataSourceCompany = new EventDetailDataSource(this.eventDetailService);
		this.dataSourceGroup = new EventDetailDataSource(this.eventDetailService);
		this.dataSourceUnit = new EventDetailDataSource(this.eventDetailService);
		// this.dataSourcePoi = new EventDetailDataSource(this.eventDetailService);
		// this.dataSourceZone = new EventDetailDataSource(this.eventDetailService);

		if (this.event_detail.id != '0') {
			this.dataSourceEvCondition.loadEventCondition(this.userConncode, this.userID, this.event_detail.id);
		}

		this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.event_detail.company, "company_clist");
		this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, this.event_detail.group, this.event_detail.companyid, "group_clist");

		if ((this.event_detail.isfullcompany == 'false') && (this.event_detail.isfullgroup == 'false')) {
			this.loadUnitList_flag = false;
			this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, 0, 20, this.event_detail.companyid, this.event_detail.groupid, this.event_detail.id);
		}

		this.unitSelection.isSelected = this.isCheckedRow.bind(this);

		this.setValues();
	}

	isCheckedRow(row: any): boolean {
		// 
		const found = this.unitSelection.selected.find(el => el.id === row.id);
		// 
		if (found) { return true; }
		return false;
	}

	ngAfterViewInit() {


		merge(this.paginatorCompany.page)
			.pipe(
				tap(() => {
					this.loadEventDetail("company")
				})
			)
			.subscribe((res: any) => {

			});

		merge(this.paginatorGroup.page)
			.pipe(
				tap(() => {
					this.loadEventDetail("group")
				})
			)
			.subscribe((res: any) => {

			});
	}

	loadEventDetail(method_string: string) {
		if (method_string == 'company') {
			this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)

		} else if (method_string == 'group') {
			let companyid = this.eventForm.get('company').value;
			this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)

		} else if (method_string == 'unit') {
			if (this.eventForm.get('wholeCompany').value == false) {
				this.loadUnitList_flag = false;
				this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, this.paginatorUnit.pageIndex, this.paginatorUnit.pageSize, this.event.companyid, this.event.groupid, this.event.id);
			}
		} else if (method_string == 'poiandgroup') {
			this.dataSourcePoi.loadPoiZoneDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, this.event.companyid, this.event.groupid, `${method_string}_clist`)

		} else if (method_string == 'zoneandgroup') {
			this.dataSourceZone.loadPoiZoneDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, this.event.companyid, this.event.groupid, `${method_string}_clist`)

		} else if (method_string == 'digitalinput1') {
			this.dataSourceDigitalInput1.loadDigitalInputDetail(this.userConncode, this.userID, 0, 1000, this.filter_string, 'digitalinput1_clist')

		} else if (method_string == 'digitalinput2') {
			this.dataSourceDigitalInput2.loadDigitalInputDetail(this.userConncode, this.userID, 0, 1000, this.filter_string, 'digitalinput2_clist')
		}
	}

	managePageIndex(method_string: string) {
		switch (method_string) {
			case 'company':
				this.paginatorCompany.pageIndex = 0;
				break;

			case 'group':
				this.paginatorGroup.pageIndex = 0;
				break;

			case 'unit':
				this.paginatorUnit.pageIndex = 0;
				break;

			case 'poiandgroup':
				this.paginatorPoi.pageIndex = 0;
				break;

			case 'zoneandgroup':
				this.paginatorZone.pageIndex = 0;
				break;

			// case 'digitalinput':
			//   this.paginatorZone.pageIndex = 0;
			// break;
		}
	}

	showCompanyList(item: string) {
		let methodString = item;
		this.method_string = item.split('_')[0];

		let selected_element_id = this.eventForm.get(`${this.method_string}`).value;
		let clist = this.eventDetailService.unit_clist_item[methodString];

		for (let i = 0; i < clist.length; i++) {
			if (clist[i].id == selected_element_id) {
				this.eventForm.get('filterstring').setValue(clist[i].name);
				this.filter_string = clist[i].name;
			}
		}

		this.managePageIndex(this.method_string);
		this.loadEventDetail(this.method_string);
	}

	onConditionChange(selected: any) {
		let checkedCondition = this.eventDetailService.eventConditionList.find((event: any) => event.evcode == selected.value);
		if (checkedCondition !== undefined) {
			alert("This Event already exist. Please choose another new one!");
			this.eventForm.get('ev_condition').setValue('none');
			this.ev_condition = 'none';
			this.evType = 'new';

		} else {
			this.ev_condition = selected.value;
			if (this.ev_condition == 'EV_POI') {
				this.dataSourcePoi = new EventDetailDataSource(this.eventDetailService);
				this.dataSourcePoi.loadPoiZoneDetail(this.userConncode, this.userID, 0, 10, this.event.poi, this.event.companyid, this.event.groupid, "poiandgroup_clist");
				this.eventForm.get('poiandgroup').setValue(this.event_detail.poiid);

			} else if (this.ev_condition == 'EV_ZONE') {
				this.dataSourceZone = new EventDetailDataSource(this.eventDetailService);
				this.dataSourceZone.loadPoiZoneDetail(this.userConncode, this.userID, 0, 10, this.event.zone, this.event.companyid, this.event.groupid, "zoneandgroup_clist");
				this.eventForm.get('zoneandgroup').setValue(this.event_detail.zoneid);
			} else if (this.ev_condition == 'EV_SENSOR') {
				this.dataSourceDigitalInput1 = new EventDetailDataSource(this.eventDetailService);
				this.dataSourceDigitalInput2 = new EventDetailDataSource(this.eventDetailService);

				this.dataSourceDigitalInput1.loadDigitalInputDetail(this.userConncode, this.userID, 0, 1000, '', "digitalinput1_clist");
				this.dataSourceDigitalInput2.loadDigitalInputDetail(this.userConncode, this.userID, 0, 1000, '', "digitalinput2_clist");
				let inputon1: number;
				let inputon2: number;

				let count: number
				count = 0
				for (let i = 0; i < 64; i++) {
					if ((Number(this.event.inputon) & Math.pow(2, i)) == Math.pow(2, i)) {
						count++;
						if (count == 1) {
							inputon1 = i + 1;

							this.eventForm.get('digitalinput1').setValue(inputon1.toString());

						}
						else {
							inputon2 = i + 1;

							this.eventForm.get('digitalinput2').setValue(inputon2.toString());

							return true;
							// exit for
						}
					}
				}
			}

			this.evType = 'new';
		}
	}

	editEvCondition(evcondition: any) {

		this.disable_condition = false;
		this.evType = 'old';

		this.eventForm.get('ev_condition').setValue(evcondition.evcode);
		this.ev_condition = evcondition.evcode;

		if (this.ev_condition == 'EV_POI') {

			this.dataSourcePoi = new EventDetailDataSource(this.eventDetailService);
			this.dataSourcePoi.loadPoiZoneDetail(this.userConncode, this.userID, 0, 10, this.event.poi, this.event.companyid, this.event.groupid, "poiandgroup_clist");
			this.eventForm.get('poiandgroup').setValue(this.event_detail.poiid);

		} else if (this.ev_condition == 'EV_ZONE') {
			this.dataSourceZone = new EventDetailDataSource(this.eventDetailService);
			this.dataSourceZone.loadPoiZoneDetail(this.userConncode, this.userID, 0, 10, this.event.zone, this.event.companyid, this.event.groupid, "zoneandgroup_clist");
			this.eventForm.get('zoneandgroup').setValue(this.event_detail.zoneid);

		} else if (this.ev_condition == 'EV_SENSOR') {

			this.dataSourceDigitalInput1 = new EventDetailDataSource(this.eventDetailService);
			this.dataSourceDigitalInput2 = new EventDetailDataSource(this.eventDetailService);

			this.dataSourceDigitalInput1.loadDigitalInputDetail(this.userConncode, this.userID, 0, 1000, '', "digitalinput1_clist");
			this.dataSourceDigitalInput2.loadDigitalInputDetail(this.userConncode, this.userID, 0, 1000, '', "digitalinput2_clist");
			let inputon1: number;
			let inputon2: number;

			let count: number
			count = 0
			for (let i = 0; i < 64; i++) {
				if ((Number(this.event.inputon) & Math.pow(2, i)) == Math.pow(2, i)) {
					count++;
					if (count == 1) {
						inputon1 = i + 1;

						this.eventForm.get('digitalinput1').setValue(inputon1.toString());

					}
					else {
						inputon2 = i + 1;


						this.eventForm.get('digitalinput2').setValue(inputon2.toString());

						return true;
						// exit for
					}
				}
			}
		}

	}

	deleteEvCondition(evcondition: any) {
		let deleteCondition = this.eventDetailService.eventConditionList.findIndex((event: any) => event.evcode == evcondition.evcode);
		if (deleteCondition > -1) {
			this.eventDetailService.eventConditionList.splice(deleteCondition, 1);

			this.dataSourceEvCondition.eventsSubject.next(this.eventDetailService.eventConditionList);

			switch (evcondition.evcode) {
				//EV_SPEED
				case 'EV_SPEED':
					this.event_detail.isspeed = 'false';
					this.event_detail.speed = '0';
					this.event_detail.speedcondition = '0';

					break;

				// EV_OFFHOURS
				case 'EV_OFFHOURS':
					this.event_detail.isoffhours = 'false';
					this.event_detail.offhourstart = '0';
					this.event_detail.offhourend = '0';

					break;

				// EV_OFFHOURS
				case 'EV_LATESTART':
					this.event_detail.islatestart = 'true';
					this.event_detail.startofday = '0';

					break;

				// EV_LONGSTOP
				case 'EV_LONGSTOP':
					this.event_detail.islongstop = 'false';
					this.event_detail.stoplength = '0';

					break;

				// EV_IDLE
				case 'EV_IDLE':
					this.event_detail.isidle = 'false';
					this.event_detail.idletime = '0';

					break;

				// EV_NODATA
				case 'EV_NODATA':
					this.event_detail.isnodata = '0';
					this.event_detail.nodataintervalon = '0';
					this.event_detail.nodataintervaloff = '0';

					break;

				// EV_FUEL
				case 'EV_FUEL':
					this.event_detail.isfuel = '0';
					this.event_detail.fuelvalue = '0';
					this.event_detail.fuelcondition = '0';
					this.event_detail.fueltank = '0';

					break;

				// EV_TEMP
				case 'EV_TEMP':
					this.event_detail.istemp = 'false';
					this.event_detail.tempchange = '0';
					this.event_detail.tempcondition = '0';
					this.event_detail.tempsensor = '0';

					break;

				// EV_POI
				case 'EV_POI':
					this.event_detail.ispoi = 'false';
					this.event_detail.poiid = '0';
					this.event_detail.poicondition = '0';

					break;

				// EV_ZONE
				case 'EV_ZONE':
					this.event_detail.iszone = '0';
					this.event_detail.zoneid = '0';
					this.event_detail.zonecondition = '0';

					break;

				case 'EV_DEVICE':
					this.event_detail.ishardware = 'false';
					this.event_detail.devicecode = '';

					break;

				// EV_SENSOR
				case 'EV_SENSOR':
					this.event_detail.isdigitalin = 'false';
					this.event_detail.inputon = '0';
					this.event_detail.inputoff = '0';

					break;

				case 'EV_ROUTE':
					this.event_detail.isroute = 'false';

					break;

				case 'EV_TOW':
					this.event_detail.istow = 'false';

					break;
			}
		}
	}

	onCompanyChange(event: any) {

		let current_companyID = this.eventForm.get('company').value;

		this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, "", current_companyID, "group_clist");
		if (this.loadUnitList_flag == false) {
			this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, 0, 20, current_companyID, '0', this.event.id);
		}
	}

	onGroupChange(event: any) {

		let current_companyID = this.eventForm.get('company').value;
		let current_groupID = this.eventForm.get('group').value;

		if (this.loadUnitList_flag == false) {
			this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, 0, 20, current_companyID, current_groupID, this.event.id);
		}
	}

	selectWholeCompany(event: any) {


		let current_companyID = this.eventForm.get('company').value;
		let current_groupID = this.eventForm.get('group').value;

		if (event.checked == false) {
			this.loadUnitList_flag = false;

			this.dataSourceUnit = new EventDetailDataSource(this.eventDetailService);
			this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, 0, 20, current_companyID, current_groupID, this.event.id);

		} else {
			this.loadUnitList_flag = true;


			if (current_groupID > 0) {
				this.event_detail.isfullcompany = 'false';
				this.event_detail.isfullgroup = 'true';

			} else {
				this.event_detail.isfullcompany = 'true';
				this.event_detail.isfullgroup = 'false';
			}
		}
		// event.checked
	}

	clearFilter() {
		this.filter_string = '';
		this.eventForm.get('filterstring').setValue(this.filter_string);

		this.managePageIndex(this.method_string);
		this.loadEventDetail(this.method_string);
	}

	onKey(event: any) {
		this.filter_string = event.target.value;

		if (this.filter_string.length >= 3 || this.filter_string == '') {

			this.managePageIndex(this.method_string);
			this.loadEventDetail(this.method_string);
		}
	}

	setValues() {
		this.eventForm.get('name').setValue(this.event.name);

		// Speed Condition
		if (this.event.isspeed == 'true') {
			this.speed_condition = this.event.speedcondition;
			this.eventForm.get('speedinput').setValue(this.event.speed);
			if (this.userObjectList.lengthunitid == "4") {
				this.speed_unit = 'mph';
			} else {
				this.speed_unit = 'km'
			}
		}

		//OffHourActivity Condition
		if (this.event.isoffhours == 'true') {
			this.eventForm.get('offhourstart').setValue(this.convertNumberToTime(this.event.offhourstart));
			this.eventForm.get('offhourend').setValue(this.convertNumberToTime(this.event.offhourend));
		}

		//LateStart Condition
		if (this.event.islatestart == 'true') {
			this.eventForm.get('latestart').setValue(this.convertNumberToTime(this.event.startofday));
		}

		//LongStop Condition
		if (this.event.islongstop == 'true') {

			this.eventForm.get('longstopinput').setValue(this.checkMinHourDay(this.event.stoplength).split('-')[0]);
			this.longstop_unit = this.checkMinHourDay(this.event.stoplength).split('-')[1];
		}

		//IDLE Condition
		if (this.event.isidle == 'true') {
			this.eventForm.get('idleinput').setValue(this.checkMinHourDay(this.event.idletime).split('-')[0]);
			this.idle_unit = this.checkMinHourDay(this.event.idletime).split('-')[1];
		}

		//NoReporting Condition
		if (this.event.isnodata !== '0') {
			this.eventForm.get('noreportoninput').setValue(this.event.nodataintervalon);
			this.eventForm.get('noreportoffinput').setValue(this.event.nodataintervaloff);
			this.noreporton_unit = 'minute';
			this.noreportoff_unit = 'minute';
		}

		//Fuel Condition
		if (this.event.isfuel == 'true') {
			this.fuel_tank = this.event.fueltank;
			this.fuel_condition = this.event.fuelcondition;
			this.eventForm.get('fuelinput').setValue(this.event.fuelvalue);

			if (this.userObjectList.fuelunitid == "1") {
				this.speed_unit = 'liters';
			} else {
				this.speed_unit = 'gallons'
			}
		}

		//Temp Condition
		if (this.event.istemp == 'true') {
			this.temp_sensor = this.event.tempsensor;
			this.temp_condition = this.event.tempcondition;
			this.tempmin = this.event.tempmin;
			this.tempmax = this.event.tempmax;
			this.eventForm.get('fuelinput').setValue(this.event.tempchange);

			if (this.userObjectList.tempunitid == "1") {
				this.temp_unit = 'celsius';
			} else {
				this.temp_unit = 'fahrenheit';
			}
		}

		//Zone Condition
		if (this.event.iszone !== '0') {
			this.zone_condition = this.event.zonecondition;
			// this.dataSourceZone = new EventDetailDataSource(this.eventDetailService);
			// this.dataSourceZone.loadPoiZoneDetail(this.userConncode, this.userID, 0, 10, this.event.zone, this.event.companyid, this.event.groupid, "zoneandgroup_clist");
			// this.eventForm.get('zoneandgroup').setValue(this.event_detail.zoneid);
		}

		//POI Condition
		if (this.event_detail.ispoi == 'true') {

			this.poi_condition = this.event.poicondition;
			// this.dataSourcePoi = new EventDetailDataSource(this.eventDetailService);
			// this.dataSourcePoi.loadPoiZoneDetail(this.userConncode, this.userID, 0, 10, this.event.poi, this.event.companyid, this.event.groupid, "poiandgroup_clist");
			// this.eventForm.get('poiandgroup').setValue(this.event_detail.poiid);
		}

		//Device Condition
		if (this.event.ishardware == 'true') {
			this.eventForm.get('deviceinput').setValue(this.event.devicecode);
		}

		//Sensor Condition
		if (this.event_detail.isdigitalin == 'true') {
			// this.dataSourcePoi = new EventDetailDataSource(this.eventDetailService);
			// this.dataSourcePoi.loadPoiZoneDetail(this.userConncode, this.userID, 0, 10, this.event.poi, this.event.companyid, this.event.groupid, "poiandgroup_clist");
			// this.eventForm.get('poiandgroup').setValue(this.event_detail.poiid);
		}

		this.eventForm.get('company').setValue(this.event.companyid);
		this.eventForm.get('group').setValue(this.event.groupid);
		let wholeCompany = this.event.isfullcompany ? this.event.isfullcompany : this.event.isfullgroup;
		if (wholeCompany == 'true') {
			this.eventForm.get('wholeCompany').setValue(true);

		} else {
			this.eventForm.get('wholeCompany').setValue(false);
		}
	}

	checkMinHourDayUnit(time: number, unit: string) {

		if (unit == 'minute') {
			return time;

		} else if (unit == 'hour') {

			return time * 60;

		} else if (unit == 'day') {
			return time * 60 * 24;
		}
	}

	checkMinHourDay(time: any) {
		if (Number(time) >= 1440) {
			let days = Math.ceil(Number(time) / (60 * 24));
			return days.toString() + '-day';

		} else if (Number(time) >= 60) {
			let hours = Math.ceil(Number(time) / 60);
			return hours.toString() + '-hour';

		} else {
			return time + '-minute';
		}
	}

	convertNumberToTime(input: string) {
		let hours = (Math.floor(Number(input) / 60)).toString();
		let minutes = (Math.floor(Number(input) - Number(hours) * 60)).toString();

		if (Number(hours) < 10) { hours = "0" + hours };
		if (Number(minutes) < 10) { minutes = "0" + minutes };

		return hours + ':' + minutes;
	}

	convertTimeToNumber(input: string) {
		let time = Number(input.split(':')[0]) * 60 + Number(input.split(':')[1]);

		return time;
	}

	onSensor1Change(event: any) {

		let sensor2ID = this.eventForm.get('digitalinput2').value;
		if (sensor2ID && sensor2ID == event.value) {
			alert('Please choose another with sensor2');
			this.eventForm.get('digitalinput1').setValue('');
			this.filter_string = '';
		}
	}

	onSensor2Change(event: any) {

		let sensor1ID = this.eventForm.get('digitalinput1').value;
		if (sensor1ID && sensor1ID == event.value) {
			alert('Please choose another with sensor1');
			this.eventForm.get('digitalinput2').setValue('');
			this.filter_string = '';
		}
	}

	addNewCondition() {

		this.disable_condition = false;
	}

	getValues(mode: string) {
		this.event_detail.name = this.eventForm.get('name').value || '';

		if (mode == "save") {
			this.event_detail.id = this.event.id;
		} else if (mode == "add") {
			this.event_detail.id = '0';
		}
	}

	addEvCondition(type: string) {
		let selectedCondition = this.eventForm.get('ev_condition').value;
		let lang: string;
		if (this.userObjectList[0].languageid == '1') { lang = 'en' }
		else if (this.userObjectList[0].languageid == '2') { lang = 'es' }
		else if (this.userObjectList[0].languageid == '3') { lang = 'fr' }
		else if (this.userObjectList[0].languageid == '4') { lang = 'pt' }

		switch (selectedCondition) {
			//EV_SPEED
			case 'EV_SPEED':
				let param_speed = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'speed': (this.eventForm.get('speedinput').value).toString(),
					'speedcondition': this.speed_condition.toString(),
					'lengthunitid': (this.userObjectList[0].lengthunitid).toString(),
					'method': 'GetSpeedEventDescription'
				}

				this.saveEvCondition('EV_SPEED', param_speed, type);

				if (this.flag) {

					this.event_detail.isspeed = 'true';
					this.event_detail.speed = (this.eventForm.get('speedinput').value).toString();
					this.event_detail.speedcondition = this.speed_condition;

					this.evType = 'old';
				} else {

				}

				break;

			// EV_OFFHOURS
			case 'EV_OFFHOURS':
				let param_offhours = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'offhourstart': this.convertTimeToNumber(this.eventForm.get('offhourstart').value).toString(),
					'offhourend': this.convertTimeToNumber(this.eventForm.get('offhourend').value).toString(),
					'method': 'GetOffHoursEventDescription'
				}
				this.saveEvCondition('EV_OFFHOURS', param_offhours, type);
				if (this.flag) {
					this.event_detail.isoffhours = 'true';
					this.event_detail.offhourstart = this.convertTimeToNumber(this.eventForm.get('offhourstart').value).toString();
					this.event_detail.offhourend = this.convertTimeToNumber(this.eventForm.get('offhourend').value).toString();

					this.evType = 'old';
				}

				break;

			// EV_OFFHOURS
			case 'EV_LATESTART':
				let param_latestart = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'startofday': this.convertTimeToNumber(this.eventForm.get('latestart').value).toString(),
					'method': 'GetLateStartEventDescription'
				}
				this.saveEvCondition('EV_LATESTART', param_latestart, type);
				if (this.flag) {
					this.event_detail.islatestart = 'true';
					this.event_detail.startofday = this.convertTimeToNumber(this.eventForm.get('latestart').value).toString();

					this.evType = 'old';
				}

				break;

			// EV_LONGSTOP
			case 'EV_LONGSTOP':
				let param_longstop = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'stoplength': this.checkMinHourDayUnit(this.eventForm.get('longstopinput').value, this.longstop_unit).toString(),
					'method': 'GetLongStopEventDescription'
				}
				this.saveEvCondition('EV_LONGSTOP', param_longstop, type);
				if (this.flag) {
					this.event_detail.islongstop = 'true';
					this.event_detail.stoplength = this.checkMinHourDayUnit(this.eventForm.get('longstopinput').value, this.longstop_unit).toString();

					this.evType = 'old';
				}

				break;

			// EV_IDLE
			case 'EV_IDLE':
				let param_idle = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'idletime': this.checkMinHourDayUnit(this.eventForm.get('idleinput').value, this.idle_unit).toString(),
					'method': 'GetIdleEventDescription'
				}
				this.saveEvCondition('EV_IDLE', param_idle, type);
				if (this.flag) {
					this.event_detail.isidle = 'true';
					this.event_detail.idletime = this.checkMinHourDayUnit(this.eventForm.get('idleinput').value, this.idle_unit).toString();

					this.evType = 'old';
				}

				break;

			// EV_NODATA
			case 'EV_NODATA':
				let param_nodata = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'nodataintervalon': this.checkMinHourDayUnit(this.eventForm.get('noreportoninput').value, this.noreporton_unit).toString(),
					'nodataintervaloff': this.checkMinHourDayUnit(this.eventForm.get('noreportoffinput').value, this.noreportoff_unit).toString(),
					'method': 'GetNoDataEventDescription'
				}
				this.saveEvCondition('EV_NODATA', param_nodata, type);
				if (this.flag) {
					this.event_detail.isnodata = '1';
					this.event_detail.nodataintervalon = this.checkMinHourDayUnit(this.eventForm.get('noreportoninput').value, this.noreporton_unit).toString();
					this.event_detail.nodataintervaloff = this.checkMinHourDayUnit(this.eventForm.get('noreportoffinput').value, this.noreportoff_unit).toString();

					this.evType = 'old';
				}

				break;

			// EV_FUEL
			case 'EV_FUEL':
				let param_fuel = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'fuelvalue': (this.eventForm.get('fuelinput').value).toString(),
					'fuelcondition': this.fuel_condition,
					'fueltank': this.fuel_tank,
					'fuelunitid': (this.userObjectList[0].fuelunitid).toString(),
					'method': 'GetFuelEventDescription'
				}
				this.saveEvCondition('EV_FUEL', param_fuel, type);
				if (this.flag) {
					this.event_detail.isfuel = '1';
					this.event_detail.fuelvalue = this.eventForm.get('fuelinput').value;
					this.event_detail.fuelcondition = this.fuel_condition;
					this.event_detail.fueltank = this.fuel_tank;

					this.evType = 'old';
				}

				break;

			// EV_TEMP
			case 'EV_TEMP':
				let param_temp = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'tempchange': '0',
					'tempmin': (this.eventForm.get('tempinput').value).toString(),
					'tempmax': '0',
					'tempcondition': this.temp_condition,
					'tempsensor': this.temp_sensor,
					'tempunitid': (this.userObjectList[0].tempunitid).toString(),
					'method': 'GetTempEventDescription'
				}
				this.saveEvCondition('EV_TEMP', param_temp, type);
				if (this.flag) {
					this.event_detail.istemp = 'true';
					this.event_detail.tempchange = '0';
					this.event_detail.tempmax = '0';
					this.event_detail.tempmin = this.eventForm.get('tempinput').value;
					this.event_detail.tempcondition = this.temp_condition;
					this.event_detail.tempsensor = this.temp_sensor;

					this.evType = 'old';
				}

				break;

			// EV_POI
			case 'EV_POI':

				// const poiname = (this.eventForm.get('poiandgroup').value).name;
				const poiid = (this.eventForm.get('poiandgroup').value);



				let param_poi = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'poiid': poiid.toString(),
					'poicondition': this.poi_condition,
					'method': 'GetPoiEventDescription'
				}
				this.saveEvCondition('EV_POI', param_poi, type);
				if (this.flag) {
					this.event_detail.ispoi = 'true';
					this.event_detail.poiid = poiid;
					this.event_detail.poicondition = this.poi_condition;

					this.evType = 'old';
				}

				break;

			// EV_POI
			case 'EV_ZONE':

				// const zonename = (this.eventForm.get('zoneandgroup').value).name;
				const zoneid = (this.eventForm.get('zoneandgroup').value);

				let param_zone = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'zoneid': zoneid.toString(),
					'zonecondition': this.zone_condition,
					'method': 'GetZoneEventDescription'
				}
				this.saveEvCondition('EV_ZONE', param_zone, type);
				if (this.flag) {
					this.event_detail.iszone = '1';
					this.event_detail.zoneid = zoneid;
					this.event_detail.zonecondition = this.zone_condition;

					this.evType = 'old';
				}

				break;

			case 'EV_DEVICE':
				let param_device = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'devicecode': (this.eventForm.get('deviceinput').value).toString(),
					'method': 'GetHardwareEventDescription'
				}
				this.saveEvCondition('EV_DEVICE', param_device, type);
				if (this.flag) {
					this.event_detail.ishardware = 'true';
					this.event_detail.devicecode = this.eventForm.get('deviceinput').value;

					this.evType = 'old';
				}

				break;

			// EV_SENSOR
			case 'EV_SENSOR':
				let input1id = (this.eventForm.get('digitalinput1').value);
				let input2id = (this.eventForm.get('digitalinput2').value);

				if (input1id == null) {
					alert('Sensor1 should be selected!');
					break;

				} else if ((input2id == null || input2id == 'none') && input1id != null) {
					let param_digitalinput = {
						'conncode': this.userConncode.toString(),
						'userid': this.userID.toString(),
						'lang': `${lang}`,
						'inputon': (Math.pow(2, Number(input1id) - 1)).toString(),
						'inputoff': '0',
						'method': 'GetSensorEventDescription'
					}

					this.saveEvCondition('EV_SENSOR', param_digitalinput, type);

					if (this.flag) {
						this.event_detail.isdigitalin = 'true';
						this.event_detail.inputon = (Math.pow(2, Number(input1id) - 1)).toString();
						this.event_detail.inputoff = '0';

						this.evType = 'old';
					}

				} else if ((input2id != null && input2id != 'none') && input1id != null) {
					let param_digitalinput = {
						'conncode': this.userConncode.toString(),
						'userid': this.userID.toString(),
						'lang': `${lang}`,
						'inputon': (Math.pow(2, Number(input1id) - 1) + Math.pow(2, Number(input2id) - 1)).toString(),
						'inputoff': '0',
						'method': 'GetSensorEventDescription'
					}

					this.saveEvCondition('EV_SENSOR', param_digitalinput, type);

					if (this.flag) {
						this.event_detail.isdigitalin = 'true';
						this.event_detail.inputon = (Math.pow(2, Number(input1id) - 1) + Math.pow(2, Number(input2id) - 1)).toString();
						this.event_detail.inputoff = '0';

						this.evType = 'old';
					}
				}

				break;

			case 'EV_ROUTE':
				let param_route = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					// 'routedeviation': (this.eventForm.get('deviceinput').value).toString(),
					'method': 'GetRouteEventDescription'
				}
				this.saveEvCondition('EV_ROUTE', param_route, type);
				if (this.flag) {
					this.event_detail.isroute = 'true';

					this.evType = 'old';
				}

				break;

			case 'EV_TOW':
				let param_tow = {
					'conncode': this.userConncode.toString(),
					'userid': this.userID.toString(),
					'lang': `${lang}`,
					'method': 'GetTowEventDescription'
				}
				this.saveEvCondition('EV_TOW', param_tow, type);
				if (this.flag) {
					this.event_detail.istow = 'true';

					this.evType = 'old';
				}

				break;

		}

		// this.eventForm.get('ev_condition').setValue('none');
		// this.ev_condition = 'none';
	}

	saveEvCondition(evcode: string, param: any, type: string) {
		this.flag.next(false);

		if (evcode != '') {
			this.eventDetailService.saveEvCondition(param)
				.subscribe((res: any) => {

					if (res.responseCode == 100 || res.responseCode == 200) {

						this.eventForm.get('ev_condition').setValue('none');
						this.ev_condition = 'none';
						this.evType = 'new';
						this.disable_condition = true;

						if (type == 'new') {
							this.eventDetailService.eventConditionList = this.eventDetailService.eventConditionList.concat(res.TrackingXLAPI.DATA);
						} else if (type == 'old') {
							let selectedCondition = this.eventDetailService.eventConditionList.findIndex((event: any) => event.evcode == evcode);

							this.eventDetailService.eventConditionList[selectedCondition].description = res.TrackingXLAPI.DATA[0].description;
						}

						if (this.pageType == 'new') {
							this.event_detail.name = this.eventForm.get('name').value;

							if (this.event_detail.name == '') {
								alert('Please enter Detail Name')
							} else {
								this.event_detail.method = 'event_save';

								this.eventDetailService.saveEventDetail(this.event_detail)
									.subscribe((result: any) => {

										if ((result.responseCode == 200) || (result.responseCode == 100)) {


											this.dataSourceEvCondition.loadEventCondition(this.userConncode, this.userID, result.TrackingXLAPI.DATA[0].id);

											this.dataSourceEvCondition.eventsSubject.next(this.eventDetailService.eventConditionList);

											this.flag.next(true);
											// this.router.navigate(['admin/events/events']);
										}
									});
							}

						} else if (this.pageType == 'edit') {
							// this.dataSourceEvCondition.loadEventCondition(this.userConncode, this.userID, this.event.id);
							this.dataSourceEvCondition.eventsSubject.next(this.eventDetailService.eventConditionList);

							this.flag.next(true);

						}
					} else {
						alert('Please check entered condition detail again');

						this.flag.next(false);
					}
				});
		}
	}

	saveEvent(): void {

		this.getValues("save");

		if (this.event_detail.name == '') {
			alert('Please enter Detail Name')
		} else {
			this.event_detail.name = this.eventForm.get('name').value;
			this.event_detail.method = 'event_save';
			this.event_detail.companyid = this.eventForm.get('company').value;
			this.event_detail.groupid = this.eventForm.get('group').value;

			this.eventDetailService.saveEventDetail(this.event_detail)
				.subscribe((result: any) => {

					if ((result.responseCode == 200) || (result.responseCode == 100)) {
						alert("Success!");
						this.router.navigate(['admin/events/events']);
					}
				});
		}
	}

	addEvent(): void {

		this.getValues("add");

		if (this.event_detail.name == '') {
			alert('Please enter Detail Name')
		} else {
			this.eventDetailService.saveEventDetail(this.event_detail)
				.subscribe((result: any) => {

					if ((result.responseCode == 200) || (result.responseCode == 100)) {
						alert("Success!");
						this.router.navigate(['admin/events/events']);
					}
				});
		}
	}

	goBackUnit() {
		const dialogConfig = new MatDialogConfig();
		let flag = 'goback';

		dialogConfig.disableClose = true;

		dialogConfig.data = {
			event: "", flag: flag
		};

		dialogConfig.disableClose = false;

		const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {


			} else {

			}
		});
	}

	paginatorClick(paginator) {
		this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.event.companyid, this.event.groupid, this.event.id);
	}

	locationPagenation(paginator) {
		if (this.ev_condition == 'EV_POI') {
			this.dataSourcePoi.loadPoiZoneDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.event.poi, this.event.companyid, this.event.groupid, "poiandgroup_clist");

		} else if (this.ev_condition == 'EV_ZONE') {
			this.dataSourceZone.loadPoiZoneDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.event.zone, this.event.companyid, this.event.groupid, "zoneandgroup_clist");

		} else if (this.ev_condition == 'EV_SENSOR') {
			this.dataSourceZone.loadDigitalInputDetail(this.userConncode, this.userID, 0, 1000, '', "digitalinput_clist");
		}
	}
}
