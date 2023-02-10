'use client';
import {getCookie, deleteCookie} from 'cookies-next';
import {useState} from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%', 
    transform: 'translate(-50%, -50%)',
    padding: '0 10px 10px'
  },
};

Modal.setAppElement('#__next');

export default function logButton() {
    
    const [token, setToken] = useState(getCookie('token'));
    const [modalIsOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorText, setErrorText] = useState('');
    const [isNew, setIsNew] = useState(false);
    const [passwordRules, setPasswordRules] = useState({length: false, lowercase: false, uppercase: false, number: false, special: false});

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal(){

    }

    function closeModal() {
        setIsOpen(false);
        setIsNew(false);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setErrorText('');
    }

    const clickHandler = () => {
        if (token) {
            deleteCookie('token');
            setToken(null);
        } else {
            openModal();
        }
    };

    const logInHandler = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim() || !Object.values(passwordRules).every(i => i)) {
            setErrorText('Username and valid password required');
            return;
        }
        if (isNew && password !== confirmPassword) {
            setErrorText('Passwords do not match');
            return;
        }
        await fetch(`/api/user/${isNew ? 'signup' : 'login'}`, {method: 'POST', body: JSON.stringify({username, password})});
        setToken(getCookie('token'));
        closeModal();
    }

    const updatePasswordRules = (curPassword) => {
        curPassword = curPassword.trim();
        let newRules = {};
        newRules.length = curPassword.length > 8;
        newRules.lowercase =  /[a-z]/.test(curPassword);
        newRules.uppercase =  /[A-Z]/.test(curPassword);
        newRules.number = /\d/.test(curPassword);
        newRules.special = !/^[A-Za-z0-9]*$/.test(curPassword);
        setPasswordRules(newRules);
    }

    return (
        <>
            <a className='button' onClick={clickHandler}>
                {token ? 'Log out' : 'Log in'}
            </a>
            <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            style={customStyles}
            contentLabel="Log In Modal"
            >
                <form className='modal' onSubmit={logInHandler}>
                    <div className="right">
                        <FontAwesomeIcon className="clickable" icon={faXmark} onClick={closeModal} size="lg"/>
                    </div>
                    <input value={username} name="username" onChange={(ev)=>{setUsername(ev.target.value); setErrorText('');}} placeholder="Username"></input>
                    <input value={password} name="password" onChange={(ev)=>{setPassword(ev.target.value); setErrorText(''); updatePasswordRules(ev.target.value);}} placeholder="Password" type="password"></input>
                    <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                        <ul className={isNew ? '' : 'hidden'}>
                            <li className={passwordRules.length ? 'success' : 'error'}>At least 8 characters</li>
                            <li className={passwordRules.lowercase ? 'success' : 'error'}>Contains a lowercase letter</li>
                            <li className={passwordRules.uppercase ? 'success' : 'error'}>Contains an uppercase letter</li>
                            <li className={passwordRules.number ? 'success' : 'error'}>Contains a number</li>
                            <li className={passwordRules.special ? 'success' : 'error'}>Contains a special character</li>
                        </ul>
                    </div>
                    <input className={isNew ? '' : 'hidden'} value={confirmPassword} name="confirmPassword" onChange={(ev)=>{setConfirmPassword(ev.target.value); setErrorText('');}} placeholder="Confirm Password" type="password"></input>
                    <span className={"error" + (!errorText ? ' hidden' : '')}>{errorText}</span>
                    <button>{isNew ? 'Sign up' : 'Log in'}</button>
                    <a className="clickable" onClick={()=>{setIsNew(!isNew);}}>{isNew ? 'Already have an account?' : 'New here?'}</a>
                </form>
            </Modal>
        </>
    );
}