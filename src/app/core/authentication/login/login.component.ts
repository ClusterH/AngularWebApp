import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as vehiclesEnglish } from '../i18n/en';
import { locale as vehiclesFrench } from '../i18n/fr';
import { locale as vehiclesPortuguese } from '../i18n/pt';
import { locale as vehiclesSpanish } from '../i18n/sp';
import { AuthService } from '../services/authentication.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { first, takeUntil, share } from 'rxjs/operators';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    userEmail: string;
    userPassword: string;
    userRemember: boolean;
    selectedLanguage: any;
    languages: any;

    // hiddenNavItem: boolean;
    isHideNavList: any = {};
    userObjectList: any = {};
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private _translateService: TranslateService,
    ) {
        // this.hiddenNavItem = false;
        this._unsubscribeAll = new Subject();

        // if (localStorage.getItem('user_info') && (localStorage.getItem('current_token').length != 0)) {
        if (localStorage.getItem('user_info')) {

            this.isHideNaveItem();
            // this.router.navigate(['/admin/vehicles/vehicles']);
        }
        //  else {
        //     this.router.navigate(['/login']);
        // }

        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: { hidden: true },
                toolbar: { hidden: true },
                footer: { hidden: true },
                sidepanel: { hidden: true }
            }
        };

        this.languages = [
            { id: 'en', title: 'English', flag: 'us' },
            { id: 'sp', title: 'Spanish', flag: 'sp' },
            { id: 'fr', title: 'French', flag: 'fr' },
            { id: 'pt', title: 'Portuguese', flag: 'pt' },
        ];
    }

    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            remember: null
        });
        if (localStorage.getItem('userInfo_email')) {
            this.loginForm.get('email').setValue(JSON.parse(localStorage.getItem('userInfo_email')));
            this.loginForm.get('password').setValue(JSON.parse(localStorage.getItem('userInfo_pwd')));
            this.loginForm.get('remember').setValue(true);
        }
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    userLogin() {
        // stop here if form is invalid
        if (this.loginForm.invalid) { return; }

        this.userEmail = this.loginForm.get('email').value;
        this.userPassword = this.loginForm.get('password').value;
        this.userRemember = this.loginForm.get('remember').value;

        if (this.userRemember) {
            localStorage.setItem('userInfo_email', JSON.stringify(this.userEmail));
            localStorage.setItem('userInfo_pwd', JSON.stringify(this.userPassword));
        } else {
            if (localStorage.getItem('userInfo_email')) {
                localStorage.removeItem('userInfo_email');
                localStorage.removeItem('userInfo_pwd');
            }
        }

        this.authService.userLogin(this.userEmail, this.userPassword)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {

                if (res.responseCode == 100) {

                    localStorage.setItem('user_info', JSON.stringify(res));

                    this.isHideNaveItem();
                }
            });
    }

    isHideNaveItem() {
        this.authService.getUserObject().pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {

            if (res.responseCode == 100) {
                this.isHideNavList = res.TrackingXLAPI.DATA1[0];
                this.userObjectList = res.TrackingXLAPI.DATA;
                localStorage.setItem('restrictValueList', JSON.stringify(this.isHideNavList));
                localStorage.setItem('userObjectList', JSON.stringify(this.userObjectList));

                for (let item in this.isHideNavList) {
                    if (Number(this.isHideNavList[item]) == 0) {
                        this._fuseNavigationService.updateNavigationItem(`${item}`, { hidden: true });
                    }
                }
                this.moveToStartPage(this.userObjectList[0].startpageid, this.userObjectList[0].startpagevalue);
            }
        });
    }

    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;
        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    moveToStartPage(id, value) {
        this.authService.getSystemPageClist().pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {

            const startPage = res.TrackingXLAPI.DATA.filter(item => item.id == id);

            // this.router.navigate(['/home/google']);
            switch (startPage[0].name) {
                case 'Google Map':
                    this.router.navigate(['/home/google/main']);
                    break;
                case 'OSM Map':
                    this.router.navigate(['/home/osm']);
                    break;
                case 'Dashboard':
                    this.router.navigate(['/home/analytics']);
                    break;
                case 'Fuel Management Tanks':
                    this.router.navigate(['/fuelmanagement/tanks/tanks']);
                    break;
                case 'Fueling Registry':
                    this.router.navigate(['/fuelmanagement/fuelregistries/fuelregistries']);
                    break;
                case 'Installations Jobs':
                    this.router.navigate(['/system/jobs/jobs']);
                    break;
                case 'Job Management Board':
                    this.router.navigate(['/logistic/scrumboard']);
                    break;
                case 'Job Management List':
                    this.router.navigate(['/logistic/todo']);
                    break;
                case 'Maintenance Dashboard':
                    this.router.navigate(['/logistic/pendings/pendings']);
                    break;
                case 'Monitoring':
                    this.router.navigate(['pages/logistics/monitoring']);
                    break;
                case 'Route Center':
                    this.router.navigate(['/logistic/routecenter/routecenter']);
                    break;
                case 'System Dashboard':
                    this.router.navigate(['/system/dashboards/dashboards']);
                    break;

                default:
                    this.router.navigate(['/home/google/main']);
                    break;
            }
        });

    }
}