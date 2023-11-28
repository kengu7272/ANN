// home api endpoint - get request sends back trivia question

import jwt from 'jsonwebtoken';
import JwtPayload from "../payload";
import db from "../db";

import { headers } from 'next/headers'
import { RowDataPacket, FieldPacket } from "mysql2";

export async function GET(req: Request) {
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

    // Replace this query with your logic to fetch the trivia question from the database
    const [question]: [RowDataPacket[], FieldPacket[]] = await db.query(
      `SELECT * 
      FROM playlists JOIN playlist_songs
      ON playlists.playlistid = playlist_songs.playlistid JOIN songs
      ON songs.songid = playlist_songs.songid JOIN artists
      ON artists.artistid = songs.artistid
      WHERE userid = ? 
      ORDER BY RAND() LIMIT 1`,
      [userid]
    );
    
    if(question.length === 0) {
        return Response.json({
            status: 204,
            message: 'There are no playlists yet'
        });
    }

    return Response.json({
        status: 200,
        message: 'Playlists retrieved succesfully',
        question: "What artist made: " + question[0].songs
    });
  } catch(error) {
    let errorMessage = '';
    if (error instanceof Error) {
         errorMessage = error.message + " unhandled server error";
      }

    return Response.json({ 
        status: 500,
        message: errorMessage
      });
}
}
