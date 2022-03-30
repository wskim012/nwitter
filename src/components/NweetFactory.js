import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadString,getDownloadURL } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (nweet === "") {
          return;
        }
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
      const onClearAttachment = () => setAttachment("");

      return (
        <form onSubmit={onSubmit} className="factoryForm">
          <div className="factoryInput__container">
            <input
              className="factoryInput__input"
              value={nweet}
              onChange={onChange}
              type="text"
              placeholder="What's on your mind?"
              maxLength={120}
            />
            <input type="submit" value="&rarr;" className="factoryInput__arrow" />
          </div>
          <label for="attach-file" className="factoryInput__label">
            <span>Add photos</span>
            <FontAwesomeIcon icon={faPlus} />
          </label>
          <input
            id="attach-file"
            type="file" 
            accept="image/*" 
            onChange={onFileChange}
            style={{
              opacity: 0,
            }}
          />
          {attachment && (
          <div className="factoryForm__attachment"> 
              <img 
                src={attachment} 
                style={{
                  backgroundImage: attachment,
                }}
              />
              <div className="factoryForm__clear" onClick={onClearAttachment}>
                <span>Remove</span>
                <FontAwesomeIcon icon={faTimes} />
              </div>
          </div>
          )}
        </form>
      )
}
export default NweetFactory;