import { Component, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../shared/_services/user.service';
import { Router } from '@angular/router';
import PouchDB from 'pouchdb';
import { AppConfigService } from 'src/app/shared/_services/app-config.service';
import { AppConfig } from 'src/app/shared/_classes/app-config.class';
import { TwoWaySyncService } from 'src/app/two-way-sync/services/two-way-sync.service';

const STATE_SYNCING = 'STATE_SYNCING'
const STATE_INPUT = 'STATE_INPUT'

@Component({
  selector: 'app-import-user-profile',
  templateUrl: './import-user-profile.component.html',
  styleUrls: ['./import-user-profile.component.css']
})
export class ImportUserProfileComponent implements AfterContentInit {
  appConfig:AppConfig
  state = STATE_INPUT
  docs;

  @ViewChild('userShortCode') userShortCodeInput: ElementRef;

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private appConfigService: AppConfigService,
    private twoWaySyncService: TwoWaySyncService
  ) {  }

  ngAfterContentInit() {
  }

  async onSubmit() {
    const username = this.userService.getCurrentUser()
    const db = new PouchDB(username)
    const usersDb = new PouchDB('users')
    const userAccount = await this.userService.getUserAccount(this.userService.getCurrentUser())
    try {
      const profileToReplace = await db.get(userAccount.userUUID)
      await db.remove(profileToReplace)
    } catch(e) {
      // It's ok if this fails. It's probably because they are trying again and the profile has already been deleted.
    }
    this.state = STATE_SYNCING
    this.appConfig = await this.appConfigService.getAppConfig()
    const shortCode = this.userShortCodeInput.nativeElement.value
    if (this.appConfig.syncProtocol === 'two-way') {
      userAccount.userUUID = shortCode
      await usersDb.put(userAccount)
      await this.twoWaySyncService.sync(username, shortCode)
    } else {
      this.docs = await this.http.get(`${this.appConfig.serverUrl}api/${this.appConfig.groupName}/responsesByUserProfileShortCode/${shortCode}`).toPromise()
      const newUserProfile = this.docs.find(doc => doc.form && doc.form.id === 'user-profile')
      const usersDb = new PouchDB('users')
      await usersDb.put({...userAccount, userUUID: newUserProfile._id})
      this.docs.forEach(doc => delete doc._rev)
      await db.bulkDocs(this.docs);
    }
    this.router.navigate([`/${this.appConfig.homeUrl}`] );
  }

}
