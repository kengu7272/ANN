// playlist songs api endpoint

import { headers } from "next/headers";
import jwt from 'jsonwebtoken';
import JwtPayload from "../../payload";
import db from "../../db";
import { RowDataPacket, FieldPacket } from "mysql2";

interface RequestData {
    playlistid: string;
}

/*
    This was created before adding songs to a playlist was
    so this will require testing once that is implemented
    -Kevin 
*/

export async function GET(req: Request) {
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
        const { playlistid }: RequestData = await req.json() as RequestData;

        const [playlistsongs, fields]: [RowDataPacket[], FieldPacket[]] = await db.query(
            `SELECT songs.songid, songs.title 
            FROM playlists JOIN playlist_songs 
            ON playlists.playlistid = playlist_songs JOIN songs
            ON playlist_songs.songid = songs.songid
            WHERE userid = ? AND playlistid = ?`,
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
            playlistsongs: playlistsongs
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