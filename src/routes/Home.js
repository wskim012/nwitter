import React, { useState, useEffect } from "react";
import { dbService,storageService } from "fbase";
import { addDoc, collection, serverTimestamp, getDocs, query,onSnapshot,orderBy} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString,getDownloadURL } from "@firebase/storage";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

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
        let attachmentUrl = "";
        // console.log(attachment)
        if (attachment != "") {
          // const attachmentRef = storageService
          //   .ref()
          //   .child(`${userObj.uid}/${uuidv4()}`);
          const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
          const uploadFile = await uploadString(fileRef, attachment, "data_url");
          // const response = await attachmentRef.putString(attachment, "data_url");
          attachmentUrl = await getDownloadURL(uploadFile.ref);
        }
        // const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        // const response = await uploadString(fileRef, attachment, "data_url");
        // console.log(response);
        const nweetObj = {
          text: nweet,
          createdAt: serverTimestamp(),
          creatorId: userObj.uid,
          attachmentUrl,
        };
        await addDoc(collection(dbService, "nweets"),nweetObj); 
    } catch (error){
        console.log("Error adding document", error);
    }
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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