import React, {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";
import { updateProfile } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if(user){
        
        if(user.displayName === null) {
          const name = user.email.split("@")[0];
          user.displayName = name;
        }
        // setUserObj(user);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
        });
          
        // setUserObj({
        //   displayName: user.displayName,
        //   uid: user.uid,
        //   updateProfile: (args) => user.updateProfile(args),
        // });
      } else {
        setUserObj (null);
      }
      setInit(true);
    })
  },[]);
  const refreshUser = () => {
    console.log("refresh")
    const user = authService.currentUser;
    console.log(user)
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
      // updateProfile: (args) => user.updateProfile(args),
    });
  }
  return (
    <>
      {init ? (
        // <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)} 
          userObj={userObj} 
        />
      ) : (
        "Initializing..."
      )}
    </> 
  );
}

export default App;
 