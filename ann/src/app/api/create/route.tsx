// create api endpoint - create playlists

import db from '../db';
import jwt from 'jsonwebtoken';
import JwtPayload from '../payload';
import { headers } from 'next/headers';
import { RowDataPacket, FieldPacket } from 'mysql2';

interface RequestData {
    name: string;
}

export async function POST(req: Request) {
    try {
        // get token from header
        const headersList = headers();
        const token = headersList.get('Authorization');

        if (!token) {
            return Response.json({
                status: 407,
                error: 'No authentication token'
            });
        }

        // get values to upload to db
        const { userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
        const { name }: RequestData = await req.json() as RequestData;

        // Check if user has a playlist of the same name already
        const [playlists, fields]: [RowDataPacket[], FieldPacket[]] = await db.query(
            'SELECT * FROM playlists WHERE userid = ? AND name = ?',
            [userid, name]
        );

        // if playlist already exists
        if(playlists.length > 0) {
            return Response.json({
                status: 408,
                error: 'You already have a playlist with this name'
            });
        }

        await db.execute(
            'INSERT INTO playlists (userid, name) VALUES (?, ?)',
            [userid, name]
        );

        return Response.json({
            status: 208,
            message: 'Playlist successfully created'
        });
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