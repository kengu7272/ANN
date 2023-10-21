// profile api endpoint

import db from '../db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import JwtPayload from '../payload';

export async function POST(req: any) {
    try {
        const headersList = headers();
        const token = headersList.get('Authorization');

        if(!token) {
            return Response.json({
                status: 407,
                error: 'No token'
            });
        }

        const { userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
        const { action, username, email, password } = await req.json();

        if(action === 'edit') {
            await db.execute(
                'UPDATE users SET username = ?, email = ?, password = ?',
                [username, email, password]
            )

            return Response.json({
                status: 202,
                message: 'User info updated successfully'
            })
        }
        else if(action === 'delete') {
            await db.execute(
                'DELETE FROM users WHERE userid = ?',
                [userid]
            );
        }

        return Response.json({
            status: 201,
            message: 'User deleted successfully'
        })
    }
    catch(error) {
        return Response.json({ 
            status: 500,
            message: 'Internal server error or token verification failed, log in again' 
          });
    }
}