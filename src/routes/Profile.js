import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

export default ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = async () => {
      const status = await authService.signOut();
      history.push("/");
    }
    const getMyNweets = async () =>{
      const q = query(collection(dbService,"nweets"),where("creatorId","==",userObj.uid));
      const querySnapShot = await getDocs(q);
      // querySnapShot.forEach((doc)=>{
      //   console.log(doc.id,"=>",doc.data());
      // })
    };
    const onChange = (event) => {
      const {
        target: {value},
      } = event;
      setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
      event.preventDefault();
      console.log(userObj)
      if(userObj.displayName !== newDisplayName){
        await updateProfile(authService.currentUser,{
          displayName: newDisplayName,
        })
        refreshUser();
      }
    }
    useEffect(()=>{
      getMyNweets();
    },[]);
    return (
      <>
        <form onSubmit={onSubmit}>
          <input
            onChange={onChange}
            type="text"
            placeholder="Display name"
            value={newDisplayName}
          />
          <input type="submit" value="Update Profile" />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
      </>
    );
  };  