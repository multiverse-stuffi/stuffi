import {deleteCookie} from 'cookies-next';
import {useState} from 'react';
import Modal from 'react-modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "10px",
  },
};

const buttonStyles = {
    width: "min-content",
    whiteSpace: "nowrap",
    backgroundColor: "#508CA4",
    color: '#fff',
    '&:hover': {
      backgroundColor: '#91AEC1',
    }
  }

Modal.setAppElement("#__next");

function logButton({refreshData, isLoggedIn, setIsLoggedIn, setHeaderUsername}) {
  const defaultPasswordRules = {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [passwordRules, setPasswordRules] = useState(defaultPasswordRules);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setIsNew(false);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setErrorText("");
    setPasswordRules(defaultPasswordRules);
  }

  const clickHandler = () => {
    if (isLoggedIn) {
      deleteCookie("token");
      setIsLoggedIn(false);
      refreshData();
    } else {
      openModal();
    }
  };

  const logInHandler = async (e) => {
    e.preventDefault();
    if (
      isNew &&
      (!username.trim() ||
        !password.trim() ||
        !Object.values(passwordRules).every((i) => i))
    ) {
      setErrorText("Username and valid password required");
      return;
    }
    if (isNew && password !== confirmPassword) {
      setErrorText("Passwords do not match");
      return;
    }
    const res = await fetch(`/api/user/${isNew ? "signup" : "login"}`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
        const user = await res.json();
        setHeaderUsername(user.username);
        setIsLoggedIn(true);
        refreshData();
        closeModal();
    }
  };

  const updatePasswordRules = (curPassword) => {
    curPassword = curPassword.trim();
    let newRules = {};
    newRules.length = curPassword.length >= 8;
    newRules.lowercase = /[a-z]/.test(curPassword);
    newRules.uppercase = /[A-Z]/.test(curPassword);
    newRules.number = /\d/.test(curPassword);
    newRules.special = !/^[A-Za-z0-9]*$/.test(curPassword);
    setPasswordRules(newRules);
  };

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        onClick={clickHandler}
        sx={buttonStyles}
      >
        {isLoggedIn ? "Log out" : "Log in"}
      </Button>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Log In Modal"
      >
        <form className="modal" onSubmit={logInHandler}>
          <div className="right">
            <IconButton onClick={closeModal}>
                <Close />
            </IconButton>
          </div>
          <TextField
            label="Username"
            value={username}
            name="username"
            onChange={(ev) => {
              setUsername(ev.target.value);
              setErrorText("");
            }}
          />
          <TextField
            label="Password"
            value={password}
            name="password"
            onChange={(ev) => {
              setPassword(ev.target.value);
              setErrorText("");
              updatePasswordRules(ev.target.value);
            }}
            type="password"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <ul className={isNew ? "" : "hidden"}>
              <li className={passwordRules.length ? "success" : "error"}>
                At least 8 characters
              </li>
              <li className={passwordRules.lowercase ? "success" : "error"}>
                Contains a lowercase letter
              </li>
              <li className={passwordRules.uppercase ? "success" : "error"}>
                Contains an uppercase letter
              </li>
              <li className={passwordRules.number ? "success" : "error"}>
                Contains a number
              </li>
              <li className={passwordRules.special ? "success" : "error"}>
                Contains a special character
              </li>
            </ul>
          </div>
          {isNew ? (
            <TextField
              label="Confirm Password"
              value={confirmPassword}
              name="confirmPassword"
              onChange={(ev) => {
                setConfirmPassword(ev.target.value);
                setErrorText("");
              }}
              type="password"
            />
          ) : (
            ""
          )}
          <span className={"error" + (!errorText ? " hidden" : "")}>
            {errorText}
          </span>
          <Button
            type="submit"
            sx={buttonStyles}
            variant="contained"
            disableElevation
          >
            {isNew ? "Sign up" : "Log in"}
          </Button>
          <Typography
            className="clickable hover-underline"
            sx={{ color: "#a9a9a9", marginTop: "3px" }}
            onClick={() => {
              setIsNew(!isNew);
            }}
          >
            {isNew ? "Already have an account?" : "New here?"}
          </Typography>
        </form>
      </Modal>
    </>
  );
}

export default logButton;