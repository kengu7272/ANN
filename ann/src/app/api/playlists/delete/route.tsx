// delete song from playlist - api endpoint

import { headers } from "next/headers";
import JwtPayload from "../../payload";
import jwt from 'jsonwebtoken';
import { FieldPacket, RowDataPacket } from "mysql2";
import db from "../../db";

interface RequestData {
    playlistid: number;
    songid: number;
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

        const { userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
        const { playlistid, songid } = await req.json() as RequestData;

        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await db.query(
            `SELECT *
            FROM playlists
            WHERE playlistid = ? AND
            userid = ?`,
            [playlistid, userid]
        )

        if(rows.length === 0) {
            return Response.json({
                status: 408,
                error: "Could not find user or playlist error"
            })
        }

        // delete song from playlist - don't delete song from database bc what if other user has that song in theirs
        await db.execute(
            `DELETE FROM playlist_songs
            WHERE playlistid = ? AND
            songid = ?`,
            [playlistid, songid]
        );

        return Response.json({
            status: 207,
            message: "Song successfully removed from playlist"
        })
    }
    catch(error) {
        if(error instanceof Error) {
            return Response.json({
                status: 500,
                error: error.message
            });
        } 
    }
}