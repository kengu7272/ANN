// playlists page
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';

interface Columns {
    playlistid: number;
    userid: number;
    name: string;
}

interface PlaylistListProps {
    playlists: Columns[];
}

interface ResponseData {
    status: number;
    message: string;
    error: string;
    playlists: Columns[];
}

const PlaylistsList: React.FC<PlaylistListProps> = ({playlists}) => {
    return (
        <div className='bg-neutral-900 border-2 flex flex-col justify-center min-h-[50px] opacity-90 w-full'>
            {playlists.length > 0 ? (
                playlists.map((playlist) => (
                    <div className='even:bg-neutral-800 flex items-center h-16 w-full px-2' key={playlist.playlistid}> 
                        <p>{playlist.name}</p>
                    </div>
                ))
            ) : (
                <p>No playlists available</p>
            )}
        </div>
    );
}

export default function Playlists() {
    const router = useRouter();
    const [playlists, setPlaylists] = useState<Columns[]>([]);

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                const token = sessionStorage.getItem('token');

                if(!token) {
                    router.push("/login");
                    return;
                }

                const response = await fetch('/api/playlists', {
                    method: 'GET',
                    headers: {
                        'Authorization': token
                    }
                });

                const data: ResponseData = await response.json() as ResponseData;

                if(data.status === 200) {
                    setPlaylists(data.playlists);
                }
                else {
                    console.log(data.message);
                }
            }
            catch(error) {
                console.error("Error occured");
            }
        }

        void fetchPlaylists();
    }, []);

    return (
        <div className='bgImage h-full w-full flex flex-row items-center justify-center'>
            <Navbar/>
            <main className='w-4/5 flex laptop:flex-row items-center justify-center'>
                <PlaylistsList playlists={playlists}/>
            </main>
        </div>
    );
}