# Conflicts

The goal is to follow the [CRDT (conflict-free replicated data type)](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) pattern in resolving conflicts. When the app tries to merge two conflicting records, how should it sync the conflicting values: which value should win? The afore-mentioned Wikipedia page offers some guidance: "As an example, a one-way Boolean event flag is a trivial CRDT: one bit, with a value of true or false. True means some particular event has occurred at least once. False means the event has not occurred. Once set to true, the flag cannot be set back to false. (An event, having occurred, cannot un-occur.) The resolution method is "true wins": when merging a replica where the flag is true (that replica has observed the event), and another one where the flag is false (that replica hasn't observed the event), the resolved result is true — the event has been observed."

We have not yet reached this level of conflict resolution. We have first started with comparing data from Event Forms, detecting some basic conflicts such as missing `formResponseId`, `complete`, or `required` properties or detecting if there is a `new` event form and then merging according to rules specific to each difference. In general, the event form conflicts are resolved by adding the missing property or form. For metadata that are in conflict, the most recent metadata is merged (wins). There is also a check for new events.

Unit tests are available that test the conflicts mentioned above. You can also create scenarios on a tablet. 

# Testing Conflicts on a tablet

## Tips

After each scenario, it is useful to run Sync to make sure that no more docs need to be sync'd:
```
Status: Complete
   Pulled from the server: 0
   Pushed to the server: 0
```

## Supported Scenarios

### DiffType: EventForm - Tablet 1 opens but doesn't complete Event Form, Tablet 2 opens and completes Event Form

*Steps*

Setup:
- Create a new case with pwa1. Fill out "Registration for Role 1" - enter '0' for "How many participant of type Role 2 would you like to enroll in this case?", submit. Create a New Event of type "An Event with an event form you can delete". Sync.
- In PWA2, sync. 

Create a divergence: 
- In PWA1, open the form and exit (don't submit form). This should create a diverging tree in the revisions.
- In PWA2, Enter the case you just synced. Enter the event of type "An Event with an event form you can delete" and complete the form in "An Event with an Event Form you can delete."  Sync.

Syncing to create the conflict:
- In PWA1, Sync. *This should create a conflict.* Note that Sync status displays "Conflicts detected." This conflict is resolved on the client and sync'd to the server.
- Check data/issues on server. There should be a new issue, which should display the following:
```
Merged: true
DiffTypes:
    (1) DIFF_TYPE__METADATA
```
- In PWA2, sync. This should *NOT* create a conflict. 
- Check to see that data is identical on both PWA's.
  
### DiffType: Event - Tablet 1 creates an new Event and Tablet 2 creates a new Event

*Steps*

Setup:
- Create a new case with PWA1. Fill out "Registration for Role 1" - enter '0' for "How many participant of type Role 2 would you like to enroll in this case?", submit. Sync
- In PWA2, sync. Enter the case you just synced. Create a New Event of type "An Event with an event form you can delete" and complete the form in "An Event with an Event Form you can delete." Sync.

Create a divergence: 
- In PWA1, enter the same case (don't sync yet) and create a New Event of type "An Event with an event form you can delete". Complete the form in "An Event with an Event Form you can delete." 

Syncing to create the conflict:
- In PWA1, sync. *This should create a conflict.* Note that Sync status displays "Conflicts detected." This conflict is resolved on the client and sync'd to the server.
- Check data/issues on server. There should be a new issue, which should display the following:
```
Merged: true
DiffTypes:

    (1) DIFF_TYPE__EVENT
    (1) DIFF_TYPE__EVENT_FORM
    (1) DIFF_TYPE__METADATA
```
  
  - Check the case on PWA1. There should be 2 instances of "An Event with an Event Form you can delete" - one from PWA1, and another from PWA2.
- In PWA2, sync. *This should create a conflict.* Note that Sync status displays "Conflicts detected."  This conflict is resolved on the client and sync'd to the server.
- Check data/issues on server. There should be a new issue, which should display the following:
```
Merged: true
DiffTypes:

    (1) DIFF_TYPE__EVENT
    (1) DIFF_TYPE__EVENT_FORM
    (1) DIFF_TYPE__METADATA
```
  - Check the case on PWA2. There should be 2 instances of "An Event with an Event Form you can delete" - one from PWA1, and another from PWA2.

### DiffType: EventForm - Tablet 1 creates a new Event Form and Tablet 2 makes some other change
*Steps*

Setup:
- Create a new case with PWA1. Fill out "Registration for Role 1" - enter '0' for "How many participant of type Role 2 would you like to enroll in this case?", submit. Create a New Event of type "An Event with an event form you can delete"." Open that new event but *do not* click on the form "An Event Form you can delete". Sync.
- In PWA2, sync. Enter the case you just synced. View the "Registration for Role 1" form. Sync.

Create a divergence: 
- In PWA1, Enter the same case (don't sync yet) and enter a New Event of type "An Event with an event form you can delete". Complete the form in "An Event with an Event Form you can delete." 

Syncing to create the conflict:
- In PWA1, sync. *This should create a conflict.* Note that Sync status displays "Conflicts detected." This conflict is resolved on the client and sync'd to the server.
- Check data/issues on server. There should be a new issue, which should display the following:
```
Merged: true
DiffTypes:

(1) DIFF_TYPE__METADATA
```
- In PWA2, sync. *This should create a conflict.* Note that Sync status displays "Conflicts detected."  This conflict is resolved on the client and sync'd to the server.
- Check data/issues on server. There should be a new issue, which should display the following:
```
Merged: true
DiffTypes:

    (1) DIFF_TYPE__METADATA
```
  - Check the case on PWA2. There should be 1 instances of "An Event with an Event Form you can delete" - with the form completed from PWA1

### DiffType: Metadata - Change location on Tablet 1 and Tablet 2

Steps:
- In PWA1, pull up the case you just created. Submit a "Change Location of Case" form, setting it for Facility 1. *Don't Sync.*
- In PWA2, pull up the same case. Submit a "Change Location of Case" form, setting it for Facility 2. Sync.
- In PWA1, sync. Note the error displayed:
```
Status: Error
4 docs synced; 0 pending; ERROR: "Document update conflict"
```
   Sync again. Note that Sync status displays "Conflicts detected."  This conflict is resolved on the client and sync'd to the server. 
   
- In PWA1, pull up the case. Note that there are two "Change location of case" forms, one for Facility 1 and another for Facility 2. In the js console, enter `T.case._case.location.facility`. It should display "K0xhy1Su".
- In PWA2, sync. Note the error displayed:
```
Status: Error
4 docs synced; 0 pending; ERROR: "Document update conflict"
```
   Sync again. Note that Sync status displays "Conflicts detected."  This conflict is resolved on the client and sync'd to the server. 
   
- In PWA2, pull up the case. Note that there are two "Change location of case" forms, one for Facility 1 and another for Facility 2. In the js console, enter `T.case._case.location.facility`. It should display "K0xhy1Su".

  
### DiffType: Metadata - Modify Case variables on Tablet 1 and Tablet 2

TODO: Create a form in the Case Module that uses setVariable and getVariable function

## Scenarios not yet supported

### DiffType: EventForm - Tablet 1 removes an Event Form and Tablet 2 makes some other change

### DiffType: EventForm - Tablet 1 makes an Event Form required and Tablet 2 makes some other change

### DiffType: EventForm - Tablet 1 makes adds an Event Form variable and Tablet 2 makes some other change

### DiffType: EventForm - Tablet 1 makes modifies existing Event Form variable and Tablet 2 makes some other change

### DiffType: EventForm - Tablet 1 makes modifies existing Event Form variable and Tablet 2 modifies the same Event Form variable with same value

### DiffType: EventForm - Tablet 1 makes modifies existing Event Form variable and Tablet 2 modifies the same Event Form variable with different value


## Exploring unexpected sync conflicts

### DiffType: Metadata - Two cases view the same case but make no modification 

A metadata conflict is easy to create: whenever a case is viewed, its metadata is modified. 

Steps:
- launch 2 PWA's with the group, based on the case module - `docker exec tangerine create-group "Test Auto-merge 1" case-module`
- consider editing the "Registration for Role 1" "Registration" section by changing the QR code into an input, just to make testing easier.
- Create a new case with pwa1. Fill out "Registration for Role 1" - enter '0' for "How many participant of type Role 2 would you like to enroll in this case?", submit, and sync.
- in PWA2, sync, and open the new case. Create a New Event of type "An Event with an event form you can delete" . Go into the event and form and submit the "An Event Form you can delete" form. Sync. Notice that so far, no new conflicts have been created.
- In PWA1, sync. Note that Sync status displays "Conflicts detected." Check data/issues on server - should be type (1) DIFF_TYPE__METADATA. Merged: true.
- In PWA2, sync. Note that Sync status displays "Pulled from the server: 1".



### DiffType: EventForm - data conflict 1 - Don't touch the event 
So far, this has not made a conflict for me...

Steps:
- Create a new case with pwa1. Fill out "Registration for Role 1" - enter '0' for "How many participant of type Role 2 would you like to enroll in this case?", submit. On the same case, create a New Event of type "An Event with an event form you can delete". Don't view that event or enter data in its form. Sync. 
- In PWA2, sync. Enter the case you just synced and complete the form in "An Event with an Event Form you can delete." Sync.
- In PWA1, sync. The new form does not appear. Do a hard refresh. The new form should now appear in the case. Sync.
- In PWA2, sync. Conflicts arise. Or not. Check data/issues on server - should be type (1) DIFF_TYPE__METADATA. Merged: true. There is a 50/50 chance this record won't have a conflict...


### DiffType: EventForm - data conflict 2 - Touch the event 
So far, this has not made a conflict for me...

Steps:
- Create a new case with pwa1. Fill out "Registration for Role 1" - enter '0' for "How many participant of type Role 2 would you like to enroll in this case?", submit. On the same case, create a New Event of type "An Event with an event form you can delete". View the event, but don't view the form. Sync. 
- In PWA2, sync. Enter the case you just synced and complete the form in "An Event with an Event Form you can delete." Sync.
- In PWA1, sync. The new form does not appear. Do a hard refresh. The new form should now appear in the case. Sync.
- In PWA2, sync. Conflicts arise. Or not. Check data/issues on server - should be type (1) DIFF_TYPE__METADATA. Merged: true. There is a 50/50 chance this record won't have a conflict...


### DiffType: EventForm - data conflict 3 - Open but don't save the form 

Steps:
- Create a new case with pwa1. Fill out "Registration for Role 1" - enter '0' for "How many participant of type Role 2 would you like to enroll in this case?", submit. On the same case, create a New Event of type "An Event with an event form you can delete". View the event, then view the form, but don't submit it. Sync. 
- In PWA2, sync. Enter the case you just synced and complete the form in "An Event with an Event Form you can delete." Sync.
- In PWA1, sync. The new form does not appear. Do a hard refresh. The new form should now appear in the case. Sync.
- In PWA2, sync. Conflicts arise. Or not. Check data/issues on server - should be type (1) DIFF_TYPE__METADATA. Merged: true. There is a 50/50 chance this record won't have a conflict...
- So far, this has not made a conflict for me...

