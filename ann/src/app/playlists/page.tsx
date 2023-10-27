// playlists page
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';

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

interface PlaylistSongsColumns {
    playlist_song_id: number
}

interface PlaylistListSongsProps {
    playlists: PlaylistSongsColumns[];
}

interface PlaylistSongsResponseData {
    status: number;
    message: string;
    error: string;
    playlists: PlaylistSongsColumns[];
}

const PlaylistsList: React.FC<PlaylistListProps> = ({playlists}) => {
    const [playlistNum, setPlaylistNum] = useState(-1);

    const handlePlaylistClick = (playlistid: number) => {
        setPlaylistNum(playlistid);
    }

    const getSongs = async (playlistid: number) => {
        //Need to implement fetch to grab songs from playlist_songs table
        const response = await fetch("/api/playlists/playlistsongs");
    }

    if(playlistNum != -1) {
        getSongs(playlistNum)
    }

    return (
        <>
            <div className='bg-neutral-900 border-2 flex flex-col max-h-96 opacity-90 w-5/6 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-300'>
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <div onClick={() => { handlePlaylistClick(playlist.playlistid) }} className='even:bg-neutral-800 flex flex-none items-center h-16 w-full px-2' key={playlist.playlistid}> 
                            {playlist.name}
                        </div>
                    ))
                ) : (
                    <p className='px-2 text-center'>No playlists available</p>
                )}
            </div>
            <div className='bg-neutral-900 border-2 flex flex-col justify-center min-h-[50px] opacity-90 w-5/6'>

            </div>
        </>
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
        <div className='bgImage h-full w-full flex items-center justify-center'>
            <Navbar/>
            <main className='w-4/5 flex flex-col laptop:flex-row gap-4 items-center justify-center'>
                <PlaylistsList playlists={playlists}/>
            </main>
        </div>
    );
}