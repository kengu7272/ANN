// profile api endpoint

import db from '../db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import JwtPayload from '../payload';
import { hash } from 'bcrypt';


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

        const { userid, name, emailAddress } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
        const { action, username, email, password } = await req.json();

        if(action == 'edit') {
            // Check if the username already exists
            const [existingUsers, fields]: any[] = await db.query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            // if someone else already has the username and it isn't the user
            if(existingUsers.length > 0 && username != name) {
                return Response.json({
                    status: 409,
                    error: 'Username already taken'
                })
            }

            const [existingEmails]: any[] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if(existingEmails.length > 0 && email != emailAddress) {
                return Response.json({
                    status: 409,
                    error: 'Email already taken'
                })
            }

            // Hash the password (using bcrypt)
            const hashedPassword: string = await hash(password, 10);

            await db.execute(
                'UPDATE users SET username = ?, password = ?, email = ? WHERE userid = ?',
                [username, hashedPassword, email, userid]
            );

            return Response.json({
                status: 202,
                message: 'User info updated successfully'
            });
        }
        else if(action == 'delete') {
            await db.execute(
                'DELETE FROM playlists WHERE userid = ?',
                [userid]
              );

            await db.execute(
              'DELETE FROM users WHERE userid = ?',
              [userid]
            );

            return Response.json({
                status: 201,
                message: 'User deleted successfully'
            });
        }

        return Response.json({ 
            status: 500,
            error: 'Something went wrong' 
        });
    }
    catch(error) {
        return Response.json({ 
            status: 500,
            error: 'Internal server error or token verification failed, log in again' 
        });
    }
}