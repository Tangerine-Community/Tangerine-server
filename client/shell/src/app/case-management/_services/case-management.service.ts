import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import PouchDB from 'pouchdb';

import { AuthenticationService } from '../../core/auth/_services/authentication.service';
import { UserService } from '../../core/auth/_services/user.service';
import { Loc } from '../../core/location.service';

function _window(): any {
  return window;
}

@Injectable()
export class CaseManagementService {
  userDB;
  loc: Loc;
  userService: UserService;
  constructor(
    authenticationService: AuthenticationService,
    loc: Loc,
    userService: UserService,
    private http: Http
  ) {
    this.loc = loc;
    this.userService = userService;
    this.userDB = new PouchDB
      (authenticationService.getCurrentUserDBPath());
  }
  async getMyLocationVisits() {

    const res = await fetch('/content/location-list.json');
    const locationList = await res.json();
    const userProfile = await this.userService.getUserProfile();

    // Calculate our locations by generating the path in the locationList object.
    let myLocations = locationList.locations;
    const location = userProfile.inputs.find(input => input.name === 'location');
    location.value.forEach(levelObject => myLocations = myLocations[levelObject.value].children);

    const locations = [];

    /** @TODO: Look up numnber of visits for each location
     * do not hardcode to 0. Visits is how many unique days we have with Form Responses for that location.
     *
     *  Check for ownProperty in myLocations
     * for ...in  iterate over all enumerable properties of the object
     * Also enumerates and those the object inherits from its constructor's prototype
     * You may get unexpected properties from the prototype chain
     */
    for (const locationId in myLocations) {
      if (myLocations.hasOwnProperty(locationId)) {
        locations.push({
          location: myLocations[locationId].label,
          visits: 0
        });
      }
    }
    return locations;
  }

  async getFormList() {
    return await this.http.get('/content/forms.json')
      .toPromise()
      .then(response => response.json()).catch(data => console.error(data));
  }
}


