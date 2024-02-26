import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepositPageRoutingModule } from './deposit-routing.module';

import { DepositPage } from './deposit.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DepositPageRoutingModule,
        DepositPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DepositPageModule { }
