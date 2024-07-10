
import React from 'react';
import styles from '@/app/ui/login/login.module.css'
const Login = () => {
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <div className={styles.title}>
                    Login   
                </div>
                <input type="text" placeholder='Username' />
                <input type="password" placeholder='Password' />
                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;