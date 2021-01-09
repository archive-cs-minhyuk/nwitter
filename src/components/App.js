import react, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false); // 시작할 때 firebase initialization을 기다려주기 위함
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      //onAuthStateChanged: Auth상태 변할 때마다. (event listener 같은것)
      if (user) {
        setIsLoggedIn(true);
      } else {
        //log out 될 경우도 있으니!
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []); //empty array: component mount될 때만 사용됨.
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
