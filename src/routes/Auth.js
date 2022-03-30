import React, { useState } from "react";
import { authService, firebaseInstance } from "fbase";
import { 
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth';
import AuthForm from "components/AuthForm";

const Auth = () => {
    const onSocialClick = async (event) => {
        const {
            target: {name},
        } = event;
        let provider;
        try{
            if(name === "google"){
                provider = new GoogleAuthProvider();
                const result = await signInWithPopup(authService, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
            }
        } catch (error){
            console.log(error);
        }
    }
     
    return (
      <div>
        <AuthForm/>
        <div>
            <button onClick={onSocialClick} name="google">
                Continue with Google
            </button>
        </div>
      </div>
    );
  };
  export default Auth;