/* jshint esversion: 6 */

export class TangyFormModel {
  constructor(props) {
    this._id = '' 
    this.collection = 'TangyForm'
    this.formId
    this.responseId = ''
    Object.assign(this, props)
  }
}