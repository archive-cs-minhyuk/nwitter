import { authService } from "fbase";
import React from "react";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const history = useHistory(); //주소 돌아갈 수 있게 해주는 hook
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/"); //log out 이후 "/"로 돌아감
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
