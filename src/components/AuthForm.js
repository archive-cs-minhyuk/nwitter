import { authService } from "fbase";
import React, { useState } from "react";
//social 말고 일반적인 가입만 빼놓은 것

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    //email과 password의 onChange 함수 하나로 쓰고, 이 안에서 if 문 사용해 나눔
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    //createUserWithEmailAndPassword가 Promise라서 async 써야함
    //자세한 내용은 firebase/docs/reference/js의 공식 문서에서 확인 가능
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        //create Account
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        ); //async-await 한쌍
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
