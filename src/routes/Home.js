import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]); //nweets 가져오기 위함
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
          /> //Nweet 표시하는 부분 길어질거라 따로 component로 뺌
        ))}
      </div>
    </div>
  );
};
export default Home;
