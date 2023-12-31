import db from '../db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers'
import JwtPayload from '../payload';
import { RowDataPacket, FieldPacket } from 'mysql2';

export const dynamic = "force-dynamic"

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
             errorMessage = error.message + " unhandled server error";
          }

        return Response.json({ 
            status: 500,
            message: errorMessage
          });
    }
}

export async function DELETE(req: Request) {
    try {
        const headersList = headers();
        const token = headersList.get('Authorization');
        const data = await req.json() as { playlist: number };
        const playlist = data.playlist;

        if (!token) {
            return Response.json({
                status: 407,
                error: 'No token'
            });
        }

        await db.execute(
            `DELETE FROM playlist_songs
            WHERE playlistid = ?`,
            [playlist]
        )

        await db.execute(
            `DELETE FROM playlists
            WHERE playlistid = ?`,
            [playlist]
        )

        return Response.json({
            status: 200,
            message: 'Playlist deleted successfully'
        })
    }
    catch(error) {
        if(error instanceof Error) {
            return Response.json({
                status: 500,
                error: error.message,
            })
        }
    }
}