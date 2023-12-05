// Login page
"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ResponseData from '../interfaces/loggedInResponseData';

interface formData {
    username: string;
    password: string;
}

export default function Login() {
    const router = useRouter();

    // hooks for setting messages based on login status, and updating form data
    const [loginStatus, setLoginStatus] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [formData, setFormData] = useState<formData>({ username: '', password: '' });

    // function to submit data to backend
    const handleSubmit  = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // set to await because error for some reason if not wait
            const data: ResponseData = await response.json() as ResponseData;

            // successful login
            if(data.status == 207) {
                setLoginStatus('success');
                setLoginMessage(data.message);

                sessionStorage.setItem('token', data.token);
                router.push('/home');
            } // login failure
            else if(data.status == 407 || data.status == 500) {
                setLoginStatus('failure');
                setLoginMessage(data.error);
            }
        }
        catch(error){
            setLoginStatus('failure');
            setLoginMessage('Network or server error. Please try again.');
        }
    }

    // updates form data to submit when data is modified
    const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    return (
        <div className="flex justify-center items-center h-[100vh] w-full">
            <div className='bg-neutral-900 border-2 flex h-3/4 justify-center items-center desktop:max-h-[600px] max-w-[900px] opacity-90 shadow-neutral-900 shadow-2xl w-[95%] laptop:w-1/2'>
                <form onSubmit={handleSubmit} className='bg-transparent flex flex-col gap-8 h-[70%] tablet:h-4/5 items-center justify-center tablet:text-lg w-[95%]'>
                    <label className='text-3xl tablet:text-4xl'>ANN</label>
                    <input onChange={handleInputChange} name="username" required type="text" placeholder="Username" className='h-[10%] p-2 rounded-xl text-neutral-900 w-4/5'/>
                    <input onChange={handleInputChange} name="password" required type="password" placeholder='Password' className='h-[10%] p-2 rounded-xl text-neutral-900 w-4/5'/>
                    {loginStatus === 'success' && (<div className='text-green-500'>{loginMessage}</div>)}
                    {loginStatus === 'failure' && (<div className='text-red-500'>{loginMessage}</div>)}
                    {loginStatus === '' && (<div className="h-[2px] bg-white my-8 w-4/5"></div>)}
                    <div className='bg-transparent flex flex-row justify-center h-1/6 items-center w-full'>
                        <a href='/login/register' className='bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 flex items-center h-full justify-center mx-2 rounded-xl text-center w-[45%]'>Register</a>
                        <input type="submit" value="Login" className='bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 h-full mx-2 rounded-xl w-[45%]'/>
                    </div>
                </form>
            </div>
        </div>
    )
}