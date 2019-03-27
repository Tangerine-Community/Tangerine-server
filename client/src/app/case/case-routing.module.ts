import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProfileGuardService } from '../shared/_guards/create-profile-guard.service';
import { LoginGuard } from '../shared/_guards/login-guard.service';
import { _TRANSLATE } from '../shared/translation-marker';
import { CasesComponent } from './components/cases/cases.component';
import { NewCaseComponent } from './components/new-case/new-case.component';
import { CaseComponent } from './components/case/case.component';
import { EventComponent } from './components/event/event.component'
import { EventFormComponent } from './components/event-form/event-form.component'

const routes: Routes = [
  {
    path: 'cases',
    component: CasesComponent,
    canActivate: [LoginGuard, CreateProfileGuardService]
  },
  {
    path: 'case/:id',
    component: CaseComponent,
    canActivate: [LoginGuard, CreateProfileGuardService]
  },
  {
    path: 'case/event/:caseId/:eventId',
    component: EventComponent,
    canActivate: [LoginGuard, CreateProfileGuardService]
  },
  {
    path: 'case/event/form/:caseId/:eventId/:eventFormId',
    component: EventFormComponent,
    canActivate: [LoginGuard, CreateProfileGuardService]
  },
  {
    path: 'new-case',
    component: NewCaseComponent,
    canActivate: [LoginGuard, CreateProfileGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CaseRoutingModule { }