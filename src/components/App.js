import react, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false); // 시작할 때 firebase initialization을 기다려주기 위함
  const [userObj, setUserObj] = useState(null); //나중에 사용할 수 있도록 현재 유저 정보 저장
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      //onAuthStateChanged: Auth상태 변할 때마다. (event listener 같은것)
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []); //empty array: component mount될 때만 사용됨.
  const refreshUser = () => {
    //used in 5.2 Update Profile Bugfix. firebase 쪽의 user가 바뀌었을 때 모든 화면에서 반영될 수 있도록!
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
