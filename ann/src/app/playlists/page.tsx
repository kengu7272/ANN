// playlists page
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';

// These three for playlist fetch response object, component object
interface PlaylistColumns {
    playlistid: number;
    userid: number;
    name: string;
}

interface PlaylistListProps {
    playlists: PlaylistColumns[];
}

interface PlaylistResponseData {
    status: number;
    message: string;
    error: string;
    playlists: PlaylistColumns[];
}

// These two for playlist songs fetch response object
interface PlaylistSongsColumns {
    playlist_song_id: number
}

interface PlaylistSongsResponseData {
    status: number;
    message: string;
    error: string;
    playlists: PlaylistSongsColumns[];
}

// Component that holds playlists list and generates songs list based on selected playlist
const PlaylistsList: React.FC<PlaylistListProps> = ({playlists}) => {
    const [playlistNum, setPlaylistNum] = useState(-1);

    const handlePlaylistClick = (playlistid: number) => {
        setPlaylistNum(playlistid);
    }

    const getSongs = async (playlistid: number) => {
        try {
            const token: string = sessionStorage.getItem('token')!;
            const response: Response = await fetch("/api/playlists/playlistsongs", {
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                body: JSON.stringify({
                    playlistid: playlistid
                })
            });

            const data: PlaylistSongsResponseData = await response.json() as PlaylistSongsResponseData;
        }
        catch(error) {
            console.error("Internal server error");
        }
    }

    if(playlistNum != -1) {
        void getSongs(playlistNum)
    }

    return (
        <main className='w-4/5 flex flex-col laptop:flex-row gap-8 items-center justify-center'>
            <div className='mt-[500px] laptop:mt-0 w-full laptop:w-1/2 text-center'>
                <p className='text-4xl mb-2'>Playlists</p>
                <div className='bg-neutral-900 border-2 0 flex flex-col h-[400px] laptop:h-[500px] opacity-90 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-300'>
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <div onClick={() => { handlePlaylistClick(playlist.playlistid) }} className='even:bg-neutral-800 active:bg-neutral-600 flex flex-none items-center h-16 w-full px-2' key={playlist.playlistid}> 
                                {playlist.name}
                            </div>
                        ))
                    ) : (
                        <p className='px-2 text-center'>No playlists available</p>
                    )}
                </div>
            </div>
            <div className='mb-24 laptop:mb-0 w-full laptop:w-1/2 text-center'>
                <p className='text-4xl mb-2'>Songs</p>
                <div className='bg-neutral-900 border-2 flex flex-col justify-center h-[400px] laptop:h-[500px] opacity-90'>

                </div>
            </div>
        </main>
    );
}

export default function Playlists() {
    const router = useRouter();
    const [playlists, setPlaylists] = useState<PlaylistColumns[]>([]);

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

                const data: PlaylistResponseData = await response.json() as PlaylistResponseData;

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
        <div className='h-full w-full flex items-center justify-center'>
            <Navbar/>
            <PlaylistsList playlists={playlists}/>
        </div>
    );
}