import firebase from '../firebase.config';
import {observable} from 'mobx';
import moment from 'moment';

class dbData{
    @observable loaded = false;
    @observable CSUSBEvents = [];   
    users = {};
    eventSnap = {};
    JSONobjToJSobj(jsonO,jsO)
    {
        for (let objKey in jsonO){
            jsO.push(jsonO[objKey]);
        }
    }
    constructor(props){
        firebase.database()
          .ref('/')
          .on('value', function(snapshot) {
            this.CSUSBEvents.length=0;
            let snap = snapshot.val();
            this.users = snap['users'];
            this.eventSnap = snap['events'];
            this.JSONobjToJSobj(this.eventSnap,this.CSUSBEvents);
            this.loaded = true;
          }.bind(this));
    }
    isLoaded()
    {
        //console.log(this.loaded);
        return this.loaded;
    }
    getEvents() {
        return this.CSUSBEvents;
    }
    getUsers() {
        return this.users;
    }
    getEncryptedUID()
    {
        return firebase.auth().currentUser.uid;
    }
    getCoID()
    {
        return firebase.auth().currentUser.email.split("@")[0];
    }
    getUserName()
    {
        return this.users[parseInt(this.getCoID())].name;
    }
    addUserToAttendees(e,exec)
    {
        let newAttendeeKey = firebase.database().ref().child('events/'+e.code+'/attendees').push().key;
        firebase.database()
        .ref('events/'+e.code+'/attendees/' + newAttendeeKey)
        .set(this.getCoID()).then(()=>{exec()});
    }
    
    addUserToAttended(e,exec)
    {
        if(!this.hasUserAttended(e))
        {
            let newAttendeeKey = firebase.database().ref().child('events/'+e.code+'/attended').push().key;
            firebase.database()
            .ref('events/'+e.code+'/attended/' + newAttendeeKey)
            .set(this.getCoID()).then(()=>{exec()});
        }
        
    }

    isUserAttending(e)
    {
        e = this.eventSnap[e.code];
        let cid = this.getCoID();
        for (let objKey in e.attendees){
            if(e.attendees[objKey] == cid)
            {
                return objKey;
            }
        }
        return null;
    }

    hasUserAttended(e)
    {
        e = this.eventSnap[e.code];
        let cid = this.getCoID();
        for (let objKey in e.attended){
            if(e.attended[objKey] == cid)
            {
                return true;
            }
        }
        return false;
    }
    
    isUserCreator(e)
    {
        let cid = this.getCoID();
        if(e.creatorId == cid)
        {
            return true;
        }
        return false;
    }

    isUserModerator()
    {
        return this.users[parseInt(this.getCoID())].moderator;
    }

    removeUserFromAttendees(e,exec)
    {
        let stat = this.isUserAttending(e);
        if(stat!=null)
        {
            firebase.database().ref().child('events/'+e.code+'/attendees/'+stat).remove().then(()=>{exec()});
        }
    }

    addEvent(value)
    {
        let userID = firebase.auth().currentUser.email.split("@")[0];
        let newEventKey = firebase.database().ref().child('events').push().key;
        let newEvent = {
            name: value.name,
            organizer: value.organizer,
            when: {
                date:moment(value.date).format('MM-DD-YYYY'),
                fromTime:moment(value.fromTime).format('HH:mm'),
                toTime:moment(value.toTime).format('HH:mm')
            },
            where: value.location,
            desc: value.description,
            creatorId: userID,
            moderators: [userID],
            attendees: [userID],
            attended: [userID],
            code: newEventKey,
        }
        
        firebase.database()
        .ref('/events/' + newEventKey)
        .set(newEvent);
    }
    deleteEvent(e)
    {
        firebase.database().ref().child('events/'+e.code).remove();
        //console.log('events/'+e.code);
    }
    signOut()
    {
        firebase.auth().signOut().then(function() {
            //console.log('Signed Out');
          }, function(error) {
            console.error('Sign Out Error', error);
          });
    }
}

export default new dbData;