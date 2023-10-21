// Home page
"use client";

import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

export default function Home() {
    const [token, setToken] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            router.push("/login");
            return;
        }

        setToken(token!);
    }, []);

    return (
        <div className="bgImage bg-center bg-cover h-full w-full">
            <Navbar />
                <div className='flex flex-col justify-center h-[70%]'>
                    <section className="p-2 text-white max-w-10xl mx-auto">
                        <h1 className="text-3xl font-medium">
                                <a>Test Yourself!</a>
                        </h1>
                    </section>
                    <a className='text-center text-medium text-white p-10'>question?</a>
                    <nav className="bg-transparent flex flex-wrap flex-col items-center justify-center">
                        <input type="input" placeholder="your answer..." className='flex mb-100 px-2 max-h-2lg rounded-xl text-neutral-900 max-w-lg w-4/5'/>
                    </nav>
                    <button className='m-4 hover:opacity-50'>
                        <input type="submit" value="Submit" className='p-2 bg-teal-300 h-full mx-2 rounded-xl max-w-fit min-w-fit w-[15%]'/>
                    </button>
                </div>
        </div> 
    )
}
