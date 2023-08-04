import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal(); // consume context, close modal after form login submission

  // handle demo user link on login form
  const demoUserLogin = 'demo@user.io';
  const demoUserPassword = 'password';

  const handleDemoUser = (e) => {
    e.preventDefault();
    dispatch(sessionActions.login({ credential: demoUserLogin, password: demoUserPassword }))
      .then(closeModal)
      .catch((res) => {
        // Handle any errors from the demo login if needed
        console.error(res);
      });
  };

  // regular submit for user
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="username-box">
          {/* Username or Email */}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
          />
        </div>
        <div className="password-box">
          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <div className="login-button">
          <button type="submit"
            disabled={credential.length < 4 || password.length < 6}
          >Log In</button>
        </div>
          <Link to="#" onClick={handleDemoUser}>Demo User</Link>

      </form>
    </>
  );
}

export default LoginFormModal;
