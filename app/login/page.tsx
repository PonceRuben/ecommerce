'use client';


import { useRouter } from 'next/navigation';
import { useState} from 'react';

const Login = () => {
    const router = useRouter ();
    const [email, setEmail] = useState("");
    const [password, setPasword] = useState("");


    const handleLogin = async () => {
        if (email === "ejemplo@ejemplo.com" && password === "123456") {
            localStorage.setItem("isLoggedIn","true")
            router.push("/dashboard")
        }
    };

    return (
        <>
            <h1>Iniciar sesion</h1>
            <input type="email" placeholder='Email' value={email} onChange={(e)=> setEmail(e.target.value)}></input>
            <input type='password' placeholder='Contraseña' value={password} onChange={(e)=> setPasword(e.target.value)}></input>
            <button onClick={handleLogin}>Iniciar Sesion</button>
        </>
    )
}

export default Login;


