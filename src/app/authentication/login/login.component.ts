import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { first } from 'rxjs/operators';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { AuthService } from 'app/authentication/services/authentication.service';

import { locale as vehiclesEnglish } from 'app/authentication/i18n/en';
import { locale as vehiclesSpanish } from 'app/authentication/i18n/sp';
import { locale as vehiclesFrench } from 'app/authentication/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/authentication/i18n/pt';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    userEmail: string;
    userPassword: string;
    checked_RememberMe: boolean = false;

    selectedLanguage: any;
    languages: any;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,

        private authService: AuthService,
        private _translateService: TranslateService,
    )
    {
        if (localStorage.getItem('user_info')) {
            this.router.navigate(['/home/analytics']);
        }
        
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'sp',
                title: 'Spanish',
                flag : 'sp'
            },
            {
                id   : 'fr',
                title: 'French',
                flag : 'fr'
            },
            {
                id   : 'pt',
                title: 'Portuguese',
                flag : 'pt'
            },
        ];
    }

    ngOnInit(): void
    {
        

        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

       

        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
    }

    userLogin() {
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.userEmail    = this.loginForm.get('email').value;
        this.userPassword = this.loginForm.get('password').value;

        this.authService.userLogin(this.userEmail, this.userPassword)
            .pipe(first())
            .subscribe((res: any) => {
                console.log(res);
                // localStorage.setItem('user_info', JSON.stringify(res));

                this.authService.checked_RememberMe = this.checked_RememberMe;
                console.log(this.checked_RememberMe);

                this.router.navigate(['/home/analytics']);
            },
            error => {
                alert(error);
            });

    }

    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }
}
