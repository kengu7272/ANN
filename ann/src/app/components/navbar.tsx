"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import Link from 'next/link'

export default function Navbar() {
    const [createClassName, setCreateClassName] = useState('');
    const [playlistsClassName, setPlaylistsClassName] = useState('');
    const [profileClassName, setProfileClassName] = useState('');

    const path = usePathname();

    useEffect(() => {
    if(path == "/create") {
        setCreateClassName('border-b');
    }
    else if(path == "/playlists") {
        setPlaylistsClassName('border-b');
    }
    else if(path == "/profile") {
        setProfileClassName('border-b');
    }

    }, [])

    return (
        <div className='absolute top-0 border-b-2 bg-transparent flex items-center justify-center h-20 w-full z-50'>
          <Link className="text-3xl font-medium absolute hidden tablet:block left-5 laptop:left-10 text-teal-300" href="/home">ANN</Link>
          <nav className="flex gap-8 small:mr-5 tablet:mr-0 laptop:gap-16 text-xl text-white" aria-label="main">
            <Link className={`hover:opacity-50 ${createClassName}`} href="/create">Create</Link>
            <Link className={`hover:opacity-50 ${playlistsClassName}`} href="/playlists">Playlists</Link>
            <Link className={`hover:opacity-50 ${profileClassName}`} href="/profile">Profile</Link>
          </nav>
        </div>
      );
}