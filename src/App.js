import './App.css';
import firebase from 'firebase/app'
import 'firebase/analytics';
import 'firebase/firestore'

import React, { useEffect, useState } from 'react';



var firebaseConfig = {
  apiKey: "AIzaSyDszmIVrQ1DJ9LVXMoU0TZ-_FOsnRrtTjU",
  authDomain: "pangtack-e437a.firebaseapp.com",
  projectId: "pangtack-e437a",
  storageBucket: "pangtack-e437a.appspot.com",
  messagingSenderId: "197739815268",
  appId: "1:197739815268:web:f986fe1870265ee5111a71",
  measurementId: "G-LZTY15GCQG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db= firebase.firestore();


const Messages=({selectRoom})=>{
  
  const [events,setEevets]=useState([]);
  const[userId,setUserid]=useState('');
  const[messageText,setMessageText]=useState()

  const eventPath=selectRoom? `rooms/${selectRoom.id}/events`:'';

  useEffect(()=>{
    if(!selectRoom){
      return ;
    }
    
    db.collection(eventPath).orderBy('createdAt').get().then(querySnapshot =>{
      const events=[];
      
      querySnapshot.forEach((doc)=>{

        //  XXX
        const event={...doc.data()};
        events.push(event);
      });
      setEevets(events);
    });    
  },[selectRoom]); 
   
    const renderEevents=events.map(event=>{
      let rendered;
      switch(event.type){
        case "userEnter":
          rendered=<p key={event.id}><strong>{event.userid} </strong>has entered the room.</p>
          break;
        
        case 'message':
          rendered=<p key={event.id}><strong> {event.userid} </strong>:{event.messageText}</p>
          break;
        default:
          break;
      }
      return(
        rendered
      )
    })

    const sendMessage=()=>{

      if(!userId){
        window.alert('userId is necessary.')
        return ;
      }
      if(!messageText){
        window.alert('messageText is necessary.');
        return ;
      }
      const event={
        userid:userId,
        type:'message',
        messageType:'text',
        messageText:messageText,
        createdAt:new Date(),
      };
      db.collection(eventPath).doc().set(event);
    };
  return(
     <div id="messages">
         {selectRoom ? <h2>Messages ({selectRoom.id})</h2>:<h2>Messages</h2>}
         <div id="events">
         {renderEevents}
         </div>
         <div className="send-window">
          <input className="user-id" 
                 type="text"
                 name="messageText"
                 value={userId}
                 onChange={event=>{setUserid(event.target.value)}}
          />
          <input className="message-text"  
                 type="text"
                 name="messageText"
                 value={messageText}
                 onChange={event=>setMessageText(event.target.value)}
                 />
          <button onClick={sendMessage}>Send</button> 
         </div>
      </div>
  )
}

const Rooms=({rooms,setRooms,selectRoom,setSelectRoom})=>{

  const renderRooms=rooms.map(room=>{
    const handleRoomClick=()=>{
      setSelectRoom(room);
      
    }
    return (
          <button
          key={room.id}
             className={room === selectRoom ? 'selected-room' : undefined } 
            onClick={handleRoomClick}
          >
            {room.id}
          </button>
    );
  });

  return(
    <div id="rooms">
    <h2>Rooms</h2>
    <div>
     {renderRooms}
    </div>    
  </div>
  )
}

function App() {
  const [rooms,setRooms]=useState([]);
  const [selectRoom,setSelectRoom]=useState(null);



  useEffect(()=>{
    db.collection('rooms').get().then((querySnapshot)=>{
      console.log(querySnapshot);
      const rooms=[];
      querySnapshot.forEach((doc)=>{
        const room={
          id:doc.id,
        };
        rooms.push(room);
      });
      setRooms(rooms);
    });
  },1);

  return (
    <div id="app">
      <div id="header">
       <h1>PangTalk</h1>
      </div>
      <div id="main">
        <Rooms 
          rooms={rooms} 
          setRooms={setRooms}
          selectRoom={selectRoom}
          setSelectRoom={setSelectRoom}
        />
        <Messages
          selectRoom={selectRoom}
        />    
      </div>
          
    </div>
  )
}

export default App;
