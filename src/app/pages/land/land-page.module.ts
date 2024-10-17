import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { LandPageRoutingModule } from "./land-page-routing.module";
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from "ng-apexcharts";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import { LandPageComponent } from "./land/land-page.component";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { SafePipe } from 'app/shared/services/safe.pipe';
import { CitationTooltipDirective } from 'app/shared/directives/citation-tooltip.directive';

@NgModule({
    exports: [
        TranslateModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SafePipe
    ],
    imports: [
        CommonModule,
        LandPageRoutingModule,
        FormsModule,
        TranslateModule,
        CustomFormsModule,
        NgbModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatSelectModule,
        MatRadioModule,
        NgApexchartsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSlideToggleModule 
    ],
    declarations: [
        LandPageComponent,
        SafePipe,
        CitationTooltipDirective
    ]
})
export class LandPageModule { }
