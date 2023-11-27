// home api endpoint - get request sends back trivia question

import { headers } from "next/headers";
import jwt from 'jsonwebtoken';
import JwtPayload from "../payload";
import db from "../db";
import { RowDataPacket, FieldPacket } from "mysql2";

export async function GET(req: Request) {
    const headersList: Headers = headers();
    const token = headersList.get('token');

    // delete this later
    const data: string = await req.json() as string;

    if (!token) {
        return Response.json({
            status: 407,
            error: 'No token'
        });
    }

    try {
        const { userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;

        // Replace this query with your logic to fetch the trivia question from the database
        const [songResult]: [RowDataPacket[], FieldPacket[]] = await db.query(
            'SELECT songs.songid, songs.title as title, artists.name as artist FROM songs JOIN artists ON songs.artistid = artists.artistid ORDER BY RAND() LIMIT 1'
        );

        if (!songResult || songResult.length === 0) {
            return Response.json({
                status: 404,
                error: 'Trivia question not found'
            });
        }

        const triviaQuestion = songResult[0].question;

        return Response.json({
            status: 200,
            question: triviaQuestion
        });
    } catch (error) {
        return Response.json({
            status: 500,
            error: 'Internal Server Error'
        });
    }
}