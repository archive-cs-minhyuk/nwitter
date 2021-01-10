import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
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

  return (
    <div>
      <NweetFactory userObj={userObj} />
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
