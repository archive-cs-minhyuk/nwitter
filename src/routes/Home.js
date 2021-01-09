import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]); //nweets 가져오기 위함
  const [attachment, setAttachment] = useState();
  useEffect(() => {
    dbService.collection("nweets").onSnapshot((snapshot) => {
      //database의 변화를 감지
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray); //array를 만든 후 setNweets로 한 번에 설정
    });
  }, []); //mount 될 때만
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("nweets").add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid, //누가 이 nweet을 만들었는가?
    });
    setNweet(""); //submit 이후 empty로 바꾸는 과정
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
  const onClearAttachmentClick = () => setAttachment(null);
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
            <button onClick={onClearAttachmentClick}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          /> //Nweet 표시하는 부분 길어질거라 따로 component로 뺌
        ))}
      </div>
    </div>
  );
};
export default Home;
