import { Component, OnInit, Input } from '@angular/core';
import { CaseEvent } from '../../classes/case-event.class';
import { Case } from '../../classes/case.class';
import { CaseEventDefinition } from '../../classes/case-event-definition.class';
import { _TRANSLATE } from 'src/app/shared/translation-marker';
import { DatePipe } from '@angular/common';
import * as moment from 'moment'
import { EventFormDefinition } from '../../classes/event-form-definition.class';
import { EventForm } from '../../classes/event-form.class';
import { CaseDefinition } from '../../classes/case-definition.class';



@Component({
  selector: 'app-event-form-list-item',
  templateUrl: './event-form-list-item.component.html',
  styleUrls: ['./event-form-list-item.component.css']
})
export class EventFormListItemComponent implements OnInit {

  @Input() case:Case
  @Input() caseDefinition:CaseDefinition
  @Input() caseEventDefinition:CaseEventDefinition
  @Input() caseEvent:CaseEvent
  @Input() eventFormDefinition:EventFormDefinition
  @Input() eventForm:EventForm

  defaultTemplateListItemIcon = `\${eventForm.complete ? 'assignment_turned_in' : 'assignment'}`
  defaultTemplateListItemPrimary = `
      <span>\${eventFormDefinition.name}</span> (\${eventForm.id.substr(0,6)})
  `
  defaultTemplateListItemSecondary = `
    \${TRANSLATE('Status')}: \${!eventForm.complete ? TRANSLATE('Incomplete') : TRANSLATE('Complete')}
  `
  renderedTemplateListItemIcon = ''
  renderedTemplateListItemPrimary = ''
  renderedTemplateListItemSecondary = ''

  constructor() { }

  ngOnInit() {
    const getVariable = (variableName) => {
      const variablesByName = this.case.items.reduce((variablesByName,item) => {
        for (let input of item.inputs) {
          variablesByName[input.name] = input.value
        }
        return variablesByName
      }, {})
      return variablesByName[variableName]
    }
    const caseInstance = this.case
    const caseDefinition = this.caseDefinition
    const caseEventDefinition = this.caseEventDefinition
    const caseEvent = this.caseEvent
    const eventForm = this.eventForm
    const eventFormDefinition = this.eventFormDefinition
    const formatDate = (unixTimeInMilliseconds, format) => moment(new Date(unixTimeInMilliseconds)).format(format)
    const TRANSLATE = _TRANSLATE
    eval(`this.renderedTemplateListItemIcon = this.caseEventDefinition.templateListItemIcon ? \`${this.caseEventDefinition.templateListItemIcon}\` : \`${this.defaultTemplateListItemIcon}\``)
    eval(`this.renderedTemplateListItemPrimary = this.caseEventDefinition.templateListItemPrimary ? \`${this.caseEventDefinition.templateListItemPrimary}\` : \`${this.defaultTemplateListItemPrimary}\``)
    eval(`this.renderedTemplateListItemSecondary = this.caseEventDefinition.templateListItemSecondary ? \`${this.caseEventDefinition.templateListItemSecondary}\` : \`${this.defaultTemplateListItemSecondary}\``)
  }

}