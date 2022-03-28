import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import { addDoc, collection, serverTimestamp, getDocs, query} from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const getNweets = async () => {
    const q = query(collection(dbService, "nweets"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const nweetObject = {
        ...doc.data(), //doc.data() is an object, ...doc.data() is the content of that object
        id: doc.id,
        };
        setNweets((prev) => [nweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getNweets();
  }, []);
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
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;