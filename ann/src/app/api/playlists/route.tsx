import db from '../db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers'

interface JwtPayload {
    username: string;
    userid: number;
}

export async function GET(req: any) {
    try {
        const headersList = headers();
        const token = headersList.get('authorization');

        console.log(token);

        if (!token) {
            return Response.json({
                status: 407,
                error: 'No token'
            });
        }

        const { username, userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;

        const [playlists, fields]: any[] = await db.query(
            'SELECT playlistid, name FROM playlists WHERE userid = ?',
            [username]
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
        return Response.json({ 
            status: 500,
            error: 'Internal server error or token verification failed, log in again' 
          });
    }
}