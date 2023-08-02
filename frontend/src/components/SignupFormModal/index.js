import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { Redirect } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal(); // consume context

  // if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();

    // check email
    if (!email.includes('@')) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: 'The provided email is invalid'
      }))
      return
    }

    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            if (data.errors.username === 'Username already taken') {
              setErrors(prevErrors => ({
                ...prevErrors,
                username: 'This username is already taken'
              }));
            }
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="signup-form">

        <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        {errors.firstName && <p>{errors.firstName}</p>}

        <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        {errors.lastName && <p>{errors.lastName}</p>}

          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        {errors.email && <p>{errors.email}</p>}

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          {errors.username && <p>{errors.username}</p>}


          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        {errors.password && <p>{errors.password}</p>}

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Comfirm Password"
            required
          />
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}

        <div className="signup-button">
          <button type="submit"
            disabled={!email || !username || !firstName || !lastName || !password || !confirmPassword || username.length < 4 || password.length < 6}
          >Sign Up</button>

        </div>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
