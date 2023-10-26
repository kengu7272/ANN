import db from '../db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers'
import JwtPayload from '../payload';
import { RowDataPacket, FieldPacket } from 'mysql2';

export async function GET(req: Request) {
    try {
        const headersList = headers();
        const token = headersList.get('authorization');

        if (!token) {
            return Response.json({
                status: 407,
                error: 'No token'
            });
        }

        const { userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;

        const [playlists, fields]: [RowDataPacket[], FieldPacket[]] = await db.query(
            'SELECT playlistid, name FROM playlists WHERE userid = ?',
            [userid]
        );

        if(playlists.length === 0) {
            return Response.json({
                status: 204,
                message: 'There are no playlists yet'
            });
        }

        return Response.json({
            status: 200,
            message: 'Playlists retrieved succesfully',
            playlists: playlists
        });
    }
    catch(error) {
        let errorMessage = '';
        if (error instanceof Error) {
             errorMessage = error.message + "unhandled server error";
          }

        return Response.json({ 
            status: 500,
            message: errorMessage
          });
    }
}
