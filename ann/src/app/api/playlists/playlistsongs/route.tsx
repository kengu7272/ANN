// playlist songs api endpoint

import { headers } from "next/headers";
import jwt from 'jsonwebtoken';
import JwtPayload from "../../payload";
import db from "../../db";
import { RowDataPacket, FieldPacket } from "mysql2";

interface RequestData {
    playlistid: number;
}

export async function POST(req: Request) {
    try {
        const headersList: Headers = headers();
        const token = headersList.get('Authorization');

        if (!token) {
            return Response.json({
                status: 407,
                error: 'No token'
            });
        }
        
        const { userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
        const { playlistid } = await req.json() as RequestData;

        const [playlistsongs, fields]: [RowDataPacket[], FieldPacket[]] = await db.query(
            `SELECT songs.songid, songs.title as title, artists.name as artist, albums.name as album, songs.videoLink as video
            FROM playlists JOIN playlist_songs 
            ON playlists.playlistid = playlist_songs.playlistid JOIN songs
            ON playlist_songs.songid = songs.songid JOIN artists
            ON artists.artistid = songs.artistid JOIN albums
            ON albums.albumid = songs.albumid
            WHERE userid = ? AND playlists.playlistid = ?`,
            [userid, playlistid]
        );

        if(playlistsongs.length < 1) {
            return Response.json({
                status: 408,
                error: "User has no playlists"
            });
        }

        return Response.json({
            status: 207,
            message: "Playlist songs retrieved successfully",
            songs: playlistsongs
        })
    }
    catch(error) {
        if (error instanceof Error) {          
            return Response.json({
                status: 500,
                error: error.message
            });
        }
    }
}