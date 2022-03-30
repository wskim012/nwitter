import React, { useState } from "react";
import { authService } from "fbase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
} from 'firebase/auth';

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
      const {
        target: { name, value },
      } = event;
      if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      }
    };
    const onSubmit =  async(event) => {
      event.preventDefault();
      try {
        let data;
        if (newAccount){
            data = await createUserWithEmailAndPassword(authService,email,password)
          } else {
            data = await signInWithEmailAndPassword(authService,email,password)
          };
          // console.log(data)
      } catch(error){
        console.log(error)
        setError(error.message);
      }
    };

    const toggleAccount = () => {
        setNewAccount((prev)=>!prev)
    }

    return (
        <>
            <form onSubmit={onSubmit} className="container">
            <input
                className="authInput"   
                name="email"
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={onChange}
                
            />
            <input
                className="authInput"
                name="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={onChange}
            />
            <input
              className="authInput authSubmit"
              type="submit" 
              value={newAccount ? "Create Account" : "Sign in"} 
              />
            {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign In" : "Create Account"}
            </span>
        </>
    )
}

export default AuthForm;