import React, { useState } from "react";
import { dbService } from "fbase";
import { addDoc, collection, serverTimestamp} from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    try{
        const docRef = await addDoc(collection(dbService, "nweets"),{
            nweet,
            createdAt: serverTimestamp(),
        })
        console.log("Document written with ID: ", docRef.id);
    } catch (error){
        console.log("Error adding document", error);
    }
    setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Nweet" />
      </form>
    </div>
  );
};
export default Home;