import { Element } from '../../node_modules/@polymer/polymer/polymer-element.js'

/**
 * `tangy-timed`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TangyGps extends Element {
  static get template() {
    return `
    <style>
      :host {
        display: block;
      }
      :host([required]:not([disabled])) label::before  { 
        content: "*"; 
        color: red; 
        position: absolute;
        top: 4px;
        right: 5px;
      }
    </style>
    <div>
      <b>Current Position</b>
      <div>
        Latitude: {{currentLatitude}} <br> Longitude: {{currentLongitude}}
      </div>
      <b>Recorded Position</b>
      <div>
        Latitude: {{recordedLatitude}} <br> Longitude: {{recordedLongitude}}
      </div>
      <paper-button raised="" on-click="clickedRecord">record position</paper-button>
      <slot></slot>
    </div>
`;
  }

  static get is() { return 'tangy-gps'; }
  static get properties() {
    return {
      
    };
  }

  // Element class can define custom element reactions
  // @TODO: Duplicating ready?
  connectedCallback() {
    super.connectedCallback();
  }

  ready() {
    super.ready();
    this.currentLatitude = 'Searching...'
    this.currentLongitude = 'Searching...'
    // window.gpsPosition may already be watched from another location. Allow for that.
    if (!window.gpsPosition) {
      navigator.geolocation.watchPosition((position) => {
        window.gpsPosition = {
          latitude: position.coords.latitude, 
          longitude: position.coords.longitude
        }
        this.updateWatchedPosition()
      })
    } else {
      this.updateWatchedPosition()
    }
  }

  updateWatchedPosition() {
    setInterval(() => {
      this.currentLatitude = window.gpsPosition.latitude
      this.currentLongitude = window.gpsPosition.longitude
    }, 2000)
  }

  clickedRecord() {
    this.recordedLatitude = this.currentLatitude
    this.recordedLongitude = this.currentLongitude
    let latitudeInput = this.querySelector('.latitude')
    latitudeInput.value = this.recordedLatitude
    let longitudeInput = this.querySelector('.longitude')
    longitudeInput.value = this.recordedLongitude
  }
}

window.customElements.define(TangyGps.is, TangyGps);
