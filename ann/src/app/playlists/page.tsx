// playlists page
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';

interface PlaylistListProps {
    playlists: any[];
}

const PlaylistsList: React.FC<PlaylistListProps> = ({playlists}) => {
    return (
        <div className='bg-neutral-900 border-2 flex flex-col justify-center min-h-[50px] opacity-90 w-full'>
            {playlists.length > 0 ? (
                playlists.map((playlist) => (
                    <div className='even:bg-neutral-800 flex items-center h-16 w-full px-2'> 
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
    const [playlists, setPlaylists] = useState<any[]>([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
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

                const data = await response.json();

                if(data.status === 200) {
                    setPlaylists(data.playlists);
                }
                else {
                    console.log(data.message);
                }
            }
            catch(error) {
                console.log("Error occured");
            }
        }

        fetchPlaylists();
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