// api endpoint to add song to playlist

import db from '../db';
import jwt from 'jsonwebtoken';
import JwtPayload from "../payload"
import { headers } from 'next/headers';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { SongArtistAlbum } from '@/app/interfaces/songArtistAlbum';

interface RequestData {
    playlistNum: number;
    songData: SongArtistAlbum;
}

export async function POST(req: Request) {
    try {
        const headersList = headers();
        const token = headersList.get('Authorization');

        if (!token) {
            return Response.json({
                status: 407,
                error: 'No token'
            });
        }

        // just double check if user is authenticated
        const { userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
        const { playlistNum, songData }: RequestData = await req.json() as RequestData;

        let [rows, fields]: [RowDataPacket[], FieldPacket[]] = await db.query(
            `SELECT *
            FROM playlists
            WHERE playlistid = ? AND
            userid = ?`,
            [playlistNum, userid]
        )

        if(rows.length === 0) {
            return Response.json({
                status: 408,
                error: "Could not find user or playlist error"
            })
        }

        // todo implement:
        // add song to playlist_songs
        // check if artist exist in database if not add
        // check if song exists in database, if not add
        // check if album exists in database if not add

    }
    catch(error) {
        return Response.json({
            status: 500,
            error: "Internal server error"
        });
    }
}