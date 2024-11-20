'use client';

import { useEffect } from "react";
import { useRouter} from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();
    
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            router.replace("login");
        }
    });


    return( <h1>Esto es un Dashboard (crear Dashboard)</h1>)
}

export default Dashboard