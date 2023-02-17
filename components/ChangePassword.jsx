import { useState } from 'react';
import Modal from 'react-modal';
import { Close } from "@mui/icons-material";
import {
    TextField,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText
} from '@mui/material';


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

function logButton({ userId }) {
    const defaultPasswordRules = {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    };

    const [modalIsOpen, setIsOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordRules, setPasswordRules] = useState(defaultPasswordRules);
    const [errorText, setErrorText] = useState('');

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordRules(defaultPasswordRules);
    }

    const clickHandler = () => {
        openModal();
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (
            !oldPassword.trim() ||
            !newPassword.trim() ||
            !Object.values(passwordRules).every((i) => i)
        ) {
            setErrorText("Old and new, valid password required");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorText("Passwords do not match");
            return;
        }
        if (newPassword === oldPassword) {
            setErrorText("New password cannot be the same as old");
            return;
        }
        const res = await fetch(`/api/user/signup/${userId}`, {
            method: "PUT",
            body: JSON.stringify({ oldPassword, newPassword }),
        });
        if (res.ok) {
            closeModal();
        } else setErrorText('Incorrect password');
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
                disableElevation
                onClick={clickHandler}
                sx={{ color: 'white' }}
            >
                Change Password
            </Button>
            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
                contentLabel="Log In Modal"
            >
                <form className="modal" onSubmit={submitHandler}>
                    <div className="right">
                        <IconButton onClick={closeModal}>
                            <Close />
                        </IconButton>
                    </div>
                    <TextField
                        label="Old Password"
                        value={oldPassword}
                        name="oldPassword"
                        onChange={(ev) => {
                            setOldPassword(ev.target.value);
                            setErrorText('');
                        }}
                        type="password"
                    />
                    <TextField
                        label="New Password"
                        value={newPassword}
                        name="newPassword"
                        onChange={(ev) => {
                            setNewPassword(ev.target.value);
                            updatePasswordRules(ev.target.value);
                            setErrorText('');
                        }}
                        type="password"
                    />
                    <List>
                        <ListItem className={passwordRules.length ? "success" : "error"} sx={{p: 0}}>
                            <ListItemText primary="At least 8 characters"/>
                        </ListItem>
                        <ListItem className={passwordRules.lowercase ? "success" : "error"} sx={{p: 0}}>
                            <ListItemText primary="Contains a lowercase letter"/>
                        </ListItem>
                        <ListItem className={passwordRules.uppercase ? "success" : "error"} sx={{p: 0}}>
                            <ListItemText primary="Contains an uppercase letter"/>
                        </ListItem>
                        <ListItem className={passwordRules.number ? "success" : "error"} sx={{p: 0}}>
                            <ListItemText primary="Contains a number"/>
                        </ListItem>
                        <ListItem className={passwordRules.special ? "success" : "error"} sx={{p: 0}}>
                            <ListItemText primary="Contains a special character"/>
                        </ListItem>
                    </List>
                    <TextField
                        label="Confirm Password"
                        value={confirmPassword}
                        name="confirmPassword"
                        onChange={(ev) => {
                            setConfirmPassword(ev.target.value);
                            setErrorText('');
                        }}
                        type="password"
                    />
                    <span className={"error" + (!errorText ? " hidden" : "")}>
                        {errorText}
                    </span>
                    <Button
                        type="submit"
                        sx={buttonStyles}
                        variant="contained"
                        disableElevation
                    >
                        Submit
                    </Button>
                </form>
            </Modal>
        </>
    );
}

export default logButton;