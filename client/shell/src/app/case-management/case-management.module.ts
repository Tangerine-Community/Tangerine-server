import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCardModule, MdInputModule, MdListModule, MdTabsModule, MdTableModule } from '@angular/material';

import { CaseManagementService } from './_services/case-management.service';
import { CaseManagementRoutingModule } from './case-management-routing.module';
import { CaseManagementComponent } from './case-management.component';
import { FormListComponent } from './form-list/form-list.component';
import { FormResponsesListComponent } from './form-responses-list/form-responses-list.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementRoutingModule,
    MdTabsModule,
    MdInputModule,
    FormsModule,
    MdListModule,
    MdCardModule,
    MdTableModule,
    CdkTableModule,
    MdButtonModule

  ],
  declarations: [CaseManagementComponent, FormListComponent, FormResponsesListComponent],
  providers: [CaseManagementService]
})
export class CaseManagementModule { }
