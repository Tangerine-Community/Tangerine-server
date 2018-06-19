import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatListModule, MatInputModule, MatButtonModule } from '@angular/material';
import { GroupComponent } from './group/group.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { NewGroupComponent } from './new-group/new-group.component';
import { ReleaseApkComponent } from './release-apk/release-apk.component';
import { ReleasePwaComponent } from './release-pwa/release-pwa.component';
import { GroupsService } from './services/groups.service';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupDetailsComponent } from './group-details/group-details.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    GroupsRoutingModule,
    MatCardModule,
    MatListModule,
    SharedModule
  ],
  declarations: [GroupsComponent, GroupComponent, NewGroupComponent, ReleaseApkComponent, ReleasePwaComponent, GroupDetailsComponent],
  providers: [GroupsService]
})
export class GroupsModule { }
