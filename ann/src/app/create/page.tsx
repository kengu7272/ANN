// Create page
"use client";

import Navbar from "../components/navbar";
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from "next/navigation";
import ResponseData from "../interfaces/loggedInResponseData";

export default function Create() {
    const router = useRouter();

    const [token, setToken] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            router.push("/login");
            return;
        }

        setToken(token);
    }, []);

    const [playlistName, setPlaylistName] = useState('');
    const [createStatus, setCreateStatus] = useState('');
    const [createMessage, setCreateMessage] = useState('');

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPlaylistName(event.target.value);
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    name: playlistName
                })
            });

            const data: ResponseData = await response.json() as ResponseData;
            
            if(data.status >= 200 && data.status < 300) {
                setCreateStatus('success');
                setCreateMessage(data.message);
                router.push('/playlists');
            }
            else {
                setCreateStatus('failure');
                setCreateMessage(data.error);
            }
        }   
        catch(error) {
            setCreateStatus('failure');
            setCreateMessage('Network or server error. Please try again.');
        }
    }

    return (
        <div className="flex justify-center items-center h-[100vh] w-full">
            <Navbar />
                <div className="bg-neutral-900 relative border-2 flex h-1/2 justify-center items-center desktop:max-h-[600px] max-w-[900px] opacity-90 shadow-neutral-900 shadow-2xl w-[95%] laptop:w-1/2">
                    <a href="/home" className='absolute top-2 left-2 text-lg laptop:text-2xl'>&lt;--</a>
                    <form onSubmit={handleSubmit} className="bg-transparent flex flex-col gap-[15%] h-[70%] tablet:h-4/5 items-center justify-center tablet:text-lg w-[95%]">
                        <label className="text-3xl tablet:text-4xl">Create a Playlist</label>
                        <input onChange={handleNameChange} required type="text" placeholder="Playlist Name" className="h-1/5 p-2 rounded-xl text-neutral-900 w-4/5"/>
                        {createStatus === 'success' && (<div className="text-green-500">{createMessage}</div>)}
                        {createStatus === 'failure' && (<div className="text-red-500">{createMessage}</div>)}
                        {playlistName != '' && (<input type="submit" value="Create" className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 h-1/6 mx-2 rounded-xl w-1/2"/>)}
                    </form>
                </div>
        </div>
    )
}
