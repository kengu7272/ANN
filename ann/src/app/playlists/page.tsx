// playlists page
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';
import { SongArtistAlbum } from '../interfaces/songArtistAlbum';

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
    songid: number;
    title: string;
    artist: string;
    album: string;
    video: string;
}

interface PlaylistSongsResponseData {
    status: number;
    message: string;
    error: string;
    songs: PlaylistSongsColumns[];
}

interface ResponseData {
    status: number;
    error: string;
    SongArtistAlbumArr: SongArtistAlbum[]
}

interface RequestData {
    songData: SongArtistAlbum;
    playlistNum: number;
}

// Component that holds playlists list and generates songs list based on selected playlist
const PlaylistsList: React.FC<PlaylistListProps> = ({playlists}) => {
    const [playlistNum, setPlaylistNum] = useState<number>(-1);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistSongs, setPlaylistSongs] = useState<PlaylistSongsColumns[]>([]);

    const [addSong, setAddSong] = useState(false);

    const [searchResults, setSearchResults] = useState<SongArtistAlbum[]>([]);

    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('');

    const[view, setView] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const router = useRouter();

    // This function gets song based on selected playlist
    const getSongs = async (playlistid: number) => {
        try {
            const token: string = sessionStorage.getItem('token')!;
            const response: Response = await fetch("/api/playlists/playlistsongs", {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({playlistid: playlistid})
            });

            const data: PlaylistSongsResponseData = await response.json() as PlaylistSongsResponseData;
            setPlaylistSongs(data.songs);
        }
        catch(error) {
            console.error("Internal server error");
        }
    }

    // function to search songs
    const searchSongs = async (event: FormEvent) => {
        event.preventDefault();

        setSearchResults([]); 
        setPlaylistSongs([]);

        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formData: FormData = new FormData(form);
        const searchTerm: string = formData.get('searchTerm') as string;

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchTerm: searchTerm
                })
            })

            const data: ResponseData = await response.json() as ResponseData

            if(data.status === 207) {
                setSearchResults(data.SongArtistAlbumArr);
                setAddSong(false);
            }
            else {
                console.log(data.error)
            }
        }
        catch(error) {
            if(error instanceof Error){
                console.error(error.message);
            }
        }
    }

    const addToPlaylist = async (songData: SongArtistAlbum) => {
        setSearchResults([]);

        try {
            const req: RequestData = {songData, playlistNum}

            const token = sessionStorage.getItem('token');
            const response = await fetch('/api/playlistAdd', {
                method: 'POST',
                headers: {
                    'Authorization': token!,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
            });
            
            const data = await response.json() as {status: number; message: string; error: string};

            if(data.status === 207) {
                setResponseStatus('success');
                setResponseMessage(data.message);
                void getSongs(playlistNum);
            }
            else {
                setResponseStatus('failure');
                setResponseMessage(data.error);
            }

            setAddSong(true);
        }
        catch(error) {
            if(error instanceof Error) {
                console.error(error.message);
            }
        }
    }

    const deleteFromPlaylist = async (songid: number) => {
        try {
            const token: string = sessionStorage.getItem('token')!;
            const response = await fetch("/api/playlists/delete", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    songid: songid,
                    playlistid: playlistNum
                })
            })

            const data = await response.json() as { status: number; error: string; message: string;}

            if(data.status === 207) {
                setResponseStatus('success');
                setResponseMessage(data.message);
                void getSongs(playlistNum);
            }
            else {
                setResponseStatus('failure');
                setResponseMessage(data.error);
            }
        }
        catch(error) {
            if(error instanceof Error) {
                console.error(error.message);
            }
        }
    }

    const deletePlaylist = async (playlist: number) => {
        const token: string = sessionStorage.getItem('token')!;
        const response = await fetch("/api/playlists", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                playlist: playlist
            })
        })

        const data = await response.json() as { status: number, message: string, error: string };

        if(response.ok) {
            console.log(data.message);
            setResponseStatus('success');
            setResponseMessage(data.message);
        }
        else {
            console.log('fail');
            setResponseStatus('failure');
            setResponseMessage(data.error);
        }

        window.location.reload();
    }

    useEffect(() => {
        const getToken: string | null = sessionStorage.getItem('token');
        if (!getToken) {
            router.push('/login');
            return;
        }

        if (playlistNum !== -1 && !addSong && !deleteConfirm) {
            void getSongs(playlistNum);
          }
    }, [playlistNum, view]);

    return (
        <main className='w-[95%] flex flex-col laptop:flex-row gap-8 h-[70%] items-center justify-center relative'>
            <div className='mt-32 laptop:mt-0 w-full laptop:w-1/2 text-center'>
                <p className='text-4xl mb-2'>Playlists</p>
                <div className='bg-neutral-900 border-2 0 flex flex-col h-[400px] laptop:h-[500px] opacity-90 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-300'>
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <div className='even:bg-neutral-800 relative flex flex-none items-center h-16 w-full px-2' key={playlist.playlistid}> 
                                <p>{playlist.name}</p>
                                <div className=' absolute right-4 flex flex-row gap-4 items-center justify-center'>
                                    <button onClick={() => { setPlaylistNum(playlist.playlistid); setAddSong(false); setSearchResults([]); setView(true);}} className='active:text-neutral-400'>View</button>
                                    <button onClick={() => {setAddSong(true); setView(false); setPlaylistNum(playlist.playlistid); setPlaylistName(playlist.name); setSearchResults([]); setPlaylistSongs([]);}} className='active:text-neutral-400'>Add</button>
                                    {(!deleteConfirm || playlistNum !== playlist.playlistid) && <button onClick={() => {setPlaylistNum(playlist.playlistid); setDeleteConfirm(true)}}>Delete</button>}
                                    {deleteConfirm && playlistNum === playlist.playlistid && (
                                        <div className='flex flex-col justify-center items-center'>
                                            <p>Are you sure?</p>
                                            <div className='flex flex-row gap-4'>
                                                <button onClick={() => {void deletePlaylist(playlistNum); setView(false); setPlaylistNum(-1); setSearchResults([]); setPlaylistSongs([]);}} className='bg-red-400 rounded-2xl px-2'>Yes</button>
                                                <button onClick={() => {setDeleteConfirm(false)}}>No</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='px-2 text-center my-auto'>No playlists available</p>
                    )}
                </div>
            </div>

            <div className='mb-24 laptop:mb-0 w-full laptop:w-1/2 text-center'>
                <p className='text-4xl mb-2'>Songs</p>
                <div className='bg-neutral-900 border-2 0 flex flex-col h-[500px] opacity-90 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-300'>
                    {!addSong && playlistNum != -1 && (playlistSongs && playlistSongs.length > 0) ? (
                        playlistSongs.map((song, index: number) => (
                            <div className='relative even:bg-neutral-800 flex flex-row gap-4 justify-end flex-none items-center h-24 w-full px-2' key={song.songid}> 
                                <div className='absolute left-2 max-w-[60%] laptop:max-w-[50%] flex flex-col gap-1 justify-center truncate'>
                                    <div className='items-center gap-2 flex'>
                                        <div>{index + 1}</div>
                                        <p className='text-left'>{song.title}</p>
                                    </div>
                                    <div className='font-bold text-left'>{song.artist}</div>
                                </div>
                                <div className='mr-2 hidden tablet:flex max-w-[40%] text-sm truncate font-bold'>{song.album}</div>
                                <a className='mr-14 tablet:mr-20 bg-blue-400 w-12 h-8 rounded-xl px-2 flex items-center justify-center' target="_blank" href={song.video}>video</a>
                                <button onClick={() => {void deleteFromPlaylist(song.songid)}} className='absolute right-2 tablet:right-4 bg-red-800 w-12 h-8 rounded-xl'>X</button>
                            </div>
                        ))
                    ) : addSong ? (
                        <div className='my-auto mx-auto text-xl flex flex-col gap-2'>
                            <p>Search and add songs to <span className='font-bold'>{playlistName}</span></p>
                            <form className='flex flex-col justify-center items-center gap-4' onSubmit={searchSongs}>
                                <input name='searchTerm' type="text" placeholder="Search" className='bg-neutral-600 p-1'></input>
                                <input className='bg-neutral-700 h-10 hover:bg-neutral-600 active:bg-neutral-800 mx-2 rounded-xl w-1/2' type="submit" value="Search"></input>
                            </form>
                        </div>
                    ) : searchResults.length > 0 ? (
                            searchResults.map((result: SongArtistAlbum, index: number) => (
                                (<div className='relative even:bg-neutral-800 flex flex-row gap-4 justify-end flex-none items-center h-24 w-full px-2' key={index}> 
                                <div className='absolute left-2 max-w-[70%] laptop:max-w-[50%]flex flex-col gap-1 justify-center truncate'>
                                    <div className='items-center gap-2 flex'>
                                        <div>{index + 1}</div>
                                        <p className='text-left'>{result.song.title}</p>
                                    </div>
                                    <div className='font-bold text-left'>{result.artist.name}</div>
                                </div>
                                <div className='mr-20 hidden tablet:flex max-w-[40%] text-sm truncate'>{result.album.name}</div>
                                    <button onClick={() => (void addToPlaylist(result))} className='p-2 bg-neutral-600 absolute right-2 rounded-xl'>Add</button>
                                </div>)
                            ))
                    ) : (
                        <p className='text-center px-2 my-auto'>No songs available</p>
                    )}
                </div>
            </div>

            {responseStatus == 'success' && (<div className='text-green-500 absolute top-24 laptop:top-0'>{responseMessage}</div>)}
            {responseStatus == 'failure' && (<div className='text-red-500 absolute top-24 laptop:top-0'>{responseMessage}</div>)}
        </main>
    );
}

export default function Playlists() {
    const [playlists, setPlaylists] = useState<PlaylistColumns[]>([]);
    const router = useRouter();

    // gathers user playlist once component mounts
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
        <div className='min-h-[1000px] w-full flex items-center justify-center'>
            <Navbar/>
            <PlaylistsList playlists={playlists}/>
        </div>
    );
}