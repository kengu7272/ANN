// api endpoint to add song to playlist

import db from '../db';
import jwt from 'jsonwebtoken';
import JwtPayload from "../payload"
import { headers } from 'next/headers';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { SongArtistAlbum } from '@/app/interfaces/songArtistAlbum';
import getLyrics from 'genius-lyrics-ts';

interface RequestData {
    playlistNum: number;
    songData: SongArtistAlbum;
}

interface YouTubeVideo {
    id: { videoId: string };
    snipped: { title: string };
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
            // get lyrics
            let lyrics = await getLyrics({title: songData.song.title, artist: songData.artist.name});

            if(!lyrics) {
                lyrics = "";
            }

            // look for youtube music video link
            const musicVideoResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_KEY}&part=snippet&q=${songData.song.title}%20${songData.artist.name}%20Music%20Video&type=video`);
            
            const musicVideoData = await musicVideoResponse.json() as { items: YouTubeVideo[] };

            console.log(musicVideoData);
            let videoLink = '';
            const firstVideo: YouTubeVideo = musicVideoData.items[0];
            const videoId = firstVideo.id.videoId;
        
            // Generate the link for the video
            videoLink = 'https://www.youtube.com/watch?v=' + videoId;
            

            await db.query(
                `INSERT INTO songs
                (title, artistid, albumid, durationSeconds, lyrics, videoLink)
                VALUES(?,
                    (SELECT artistid FROM artists WHERE name = ?),
                    (SELECT albumid FROM albums WHERE name = ?),
                    ?, ?, ?)`,
                [songData.song.title, songData.artist.name, songData.album.name, songData.song.durationSeconds, lyrics, videoLink]
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
        catch(error) {
            if(error instanceof Error) {
                return Response.json({
                    status: 409,
                    error: error.message
                })
            }
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
