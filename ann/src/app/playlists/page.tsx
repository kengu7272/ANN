// playlists page
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';

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
            <div>   
            {playlists.length > 0 ? (
                playlists.map((playlist) => (
                    <div> 
                        {playlist.name}
                    </div>
                ))
            ) : (
                <p>No playlists available</p>
            )}
            </div>
        </div>
    );
}