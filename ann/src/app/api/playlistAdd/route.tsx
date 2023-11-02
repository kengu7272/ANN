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

        let rows: RowDataPacket[] = [];
        let fields: FieldPacket[] = [];

        [rows, fields] = await db.query(
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

        // check if artist exist in database if not add - basic system, assumes no duplicate names
        [rows, fields] = await db.query(
            `SELECT *
            FROM artists
            WHERE name = ?`,
            [songData.artist.name]
        );
        if(rows.length === 0) {
            await db.execute(
                `INSERT INTO artists
                (name) VALUES (?)`,
                [songData.artist.name]
            )
        };

        // check if album exists in database if not add
        [rows, fields] = await db.query(
            `SELECT *
            FROM albums
            WHERE name = ? AND
            artistid IN (SELECT artistid FROM artists WHERE name = ?)`,
            [songData.album.name, songData.artist.name]
        );
        if(rows.length === 0) {
            await db.query(
                `INSERT INTO albums
                (artistid, name) 
                VALUES ((SELECT artistid FROM artists WHERE name = ?),
                    ?)`,
                [songData.artist.name, songData.album.name]
            )
        };

        // check if song exists in database, if not add - checks if song exists and if made by same artist
        // because one artist won't release the same name song but two artist will
        [rows, fields] = await db.query(
            `SELECT *
            FROM songs
            WHERE title = ? AND
            artistid IN (SELECT artistid
            FROM artists
            WHERE name = ?)`,
            [songData.song.title, songData.artist.name]
        );
        if(rows.length === 0) {
            await db.query(
                `INSERT INTO songs
                (title, artistid, albumid, durationSeconds)
                VALUES(?,
                    (SELECT artistid FROM artists WHERE name = ?),
                    (SELECT albumid FROM albums WHERE name = ?),
                    ?)`,
                [songData.song.title, songData.artist.name, songData.album.name, songData.song.durationSeconds]
            )
        };

        // Now finally insert into playlist songs
        try {
            await db.query(
                `INSERT INTO playlist_songs
                (playlistid, songid)
                VALUES (?,
                    (SELECT songid FROM songs JOIN artists
                    ON songs.artistid = artists.artistid
                    WHERE title = ? AND name = ?))`,
                [playlistNum, songData.song.title, songData.artist.name]
            )
        }
        catch {
            return Response.json({
                status: 409,
                error: "Error inserting into playlist"
            })
        }


        return Response.json({
            status: 207,
            message: "Song added successfully"
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