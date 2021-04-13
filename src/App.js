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

  console.log(selectRoom);
  return(
     <div id="messages">
         {selectRoom ? <h2>Messages ({selectRoom.id})</h2>:<h2>Messages</h2>}
        <p><strong>annoymous1</strong>:hello</p>
        <p><strong>pangdae</strong>:hi</p>
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
  });

  return (
    <div id="app">
       <h1>PangTalk</h1>
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
