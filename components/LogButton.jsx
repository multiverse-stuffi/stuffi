'use client';
import {getCookie, deleteCookie} from 'cookies-next';
import {useState} from 'react';
import styles from '../styles/LogButton.module.css';

export default function logButton() {
    
    const [token, setToken] = useState(getCookie('token'));
    const handler = async () => {
        if (token) {
            deleteCookie('token');
            setToken(null);
        } else {
            const res = await fetch('/api/user/login', {method: 'POST', body: JSON.stringify(data)});
            setToken(getCookie('token'));
        }
    };
    return (
        <a onClick={handler}>
            {token ? 'log out' : 'log in'}
        </a>
    );
}