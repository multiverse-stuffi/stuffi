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
    padding: '10px'
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
        if (!username.trim() || !password.trim() || password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
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

    return (
        <>
            <a className='button' onClick={clickHandler}>
                {token ? 'Log out' : 'Log in'}
            </a>
            <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={function(){}}
            style={customStyles}
            contentLabel="Log In Modal"
            >
                <FontAwesomeIcon className="clickable" icon={faXmark} onClick={closeModal}/>
                <form className='modal' onSubmit={logInHandler}>
                    <input value={username} name="username" onChange={(ev)=>{setUsername(ev.target.value); setErrorText('');}} placeholder="Username"></input>
                    <input value={password} name="password" onChange={(ev)=>{setPassword(ev.target.value); setErrorText('');}} placeholder="Password" type="password"></input>
                    <input className={isNew ? '' : 'hidden'} value={confirmPassword} name="confirmPassword" onChange={(ev)=>{setConfirmPassword(ev.target.value); setErrorText('');}} placeholder="Confirm Password" type="password"></input>
                    <span className={"error" + (!errorText ? ' hidden' : '')}>{errorText}</span>
                    <button>{isNew ? 'Sign up' : 'Log in'}</button>
                    <a className="clickable" onClick={()=>setIsNew(!isNew)}>{isNew ? 'Already have an account?' : 'New here?'}</a>
                </form>
            </Modal>
        </>
    );
}