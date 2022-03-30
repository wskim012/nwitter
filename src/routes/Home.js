import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import { addDoc, collection, serverTimestamp, getDocs, query,onSnapshot,orderBy} from "firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
//   const getNweets = async () => {
//     const q = query(collection(dbService, "nweets"));
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         const nweetObject = {
//         ...doc.data(), //doc.data() is an object, ...doc.data() is the content of that object
//         id: doc.id,
//         };
//         setNweets((prev) => [nweetObject, ...prev]);
//     });
//   };
  useEffect(() => {
    const q = query(
        collection(dbService, "nweets"),
        orderBy("createdAt", "desc")
        );
    onSnapshot(q, (snapshot) => {
        const nweetArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setNweets(nweetArr);
    });
  },[]);
  const onSubmit = async (event) => {
    event.preventDefault();
    try{
        const docRef = await addDoc(collection(dbService, "nweets"),{
            text: nweet,
            createdAt: serverTimestamp(),
            creatorId: userObj.uid,
        })
        // console.log("Document written with ID: ", docRef.id);
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
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
            />
        ))}
      </div>
    </div>
  );
};
export default Home;