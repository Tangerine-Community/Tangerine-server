import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../core/auth/_guards/login-guard.service';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupsComponent } from './groups.component';
import { NewGroupComponent } from './new-group/new-group.component';
import { ReleaseApkComponent } from './release-apk/release-apk.component';
import { ReleasePwaComponent } from './release-pwa/release-pwa.component';
import { ReleaseDatComponent } from './release-dat/release-dat.component';
import { DownloadCsvComponent } from './download-csv/download-csv.component';
import { AddUserComponent } from './add-users/add-user.component';
import { ManageLocationListLevelsComponent } from './manage-location-list-levels/manage-location-list-levels.component';
import { CreateLocationListMetadataComponent } from './create-location-list-metadata/create-location-list-metadata.component';

const groupsRoutes: Routes = [
  // { path: 'projects',  component: GroupsComponent },
  { path: '', component: GroupsComponent, canActivate: [LoginGuard] },
  { path: 'projects', component: GroupsComponent, canActivate: [LoginGuard] },
  { path: 'groups/new-group', component: NewGroupComponent, canActivate: [LoginGuard] },
  { path: 'groups/:groupName', component: GroupDetailsComponent, canActivate: [LoginGuard] },
  { path: 'groups/:groupName', component: GroupDetailsComponent, canActivate: [LoginGuard] },
  { path: 'groups/:groupName/addUser', component: AddUserComponent, canActivate: [LoginGuard] },
  { path: 'groups/:groupName/manage-location-list-levels', component: ManageLocationListLevelsComponent, canActivate: [LoginGuard] },
  {
    path: 'groups/:groupName/create-location-list-metadata/:locationLevel',
    component: CreateLocationListMetadataComponent, canActivate: [LoginGuard]
  },
  { path: 'groups/:groupName/download-csv/:formId', component: DownloadCsvComponent, canActivate: [LoginGuard] },
  { path: 'group/release-apk/:id/:releaseType', component: ReleaseApkComponent, canActivate: [LoginGuard] },
  { path: 'group/release-pwa/:id/:releaseType', component: ReleasePwaComponent, canActivate: [LoginGuard] },
  { path: 'group/release-dat/:id/:releaseType', component: ReleaseDatComponent, canActivate: [LoginGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(groupsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class GroupsRoutingModule { }
