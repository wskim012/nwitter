import React, {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      user ? setUserObj(user) : setUserObj (null);
      setInit(true);
    })
  },[]);
  return (
    <>
      {init ? (
        // <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
    </> 
  );
}

export default App;
 