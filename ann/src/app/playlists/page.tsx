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
        <div className='bg-neutral-900 border-2 flex flex-col max-h-96 opacity-90 w-5/6 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-300'>
            {playlists.length > 0 ? (
                playlists.map((playlist) => (
                    <div className='even:bg-neutral-800 flex flex-none items-center h-16 w-full px-2' key={playlist.playlistid}> 
                        {playlist.name}
                    </div>
                ))
            ) : (
                <p className='px-2 text-center'>No playlists available</p>
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
        <div className='bgImage h-full w-full flex items-center justify-center'>
            <Navbar/>
            <main className='w-4/5 flex flex-col laptop:flex-row gap-4 items-center justify-center'>
                <PlaylistsList playlists={playlists}/>
                <div className='bg-neutral-900 border-2 flex flex-col justify-center min-h-[50px] opacity-90 w-5/6'>

                </div>
            </main>
        </div>
    );
}