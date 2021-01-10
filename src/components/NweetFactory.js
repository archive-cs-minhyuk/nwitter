import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid"; //random key 생성해줌 (npm install uuid 하고 썼음)
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
    let attachmentUrl = "";
    if (attachment !== "") {
      //attachment 있을때만 해줌 (사진 있을 때만)
      const atttachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`); //reference 만들고
      const response = await atttachmentRef.putString(attachment, "data_url"); //string 형태의 image url 넣기
      attachmentUrl = await response.ref.getDownloadURL(); //위의 response에서 public하게 사용가능한 url 불러온 것
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid, //누가 이 nweet을 만들었는가?
      attachmentUrl: attachmentUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet(""); //submit 이후 empty로 바꾸는 과정
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
    const reader = new FileReader(); //file name으로 file 읽어오는 API
    reader.onloadend = (finishedEvent) => {
      //file을 읽는게 끝나면 실행, finishedEvent에서 result -> 브라우저에 복붙하면 이미지를 보여줌
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result); //state에 result를 갖게 됨. => 이제 사용 가능!
    };
    reader.readAsDataURL(theFile); //file을 읽어옴
  };
  const onClearAttachmentClick = () => {
    setAttachment("");
  };
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
          <div className="factoryForm__clear" onClick={onClearAttachmentClick}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
