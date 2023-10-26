// login api endpoint
import db from '../db'; // Set up your MySQL connection
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { RowDataPacket, FieldPacket } from 'mysql2';

interface RequestData {
    username: string;
    password: string;
}

interface Columns {
    userid: number;
    username: string;
    password: string;
    email: string;
}

export async function POST(req: Request) {
    const { username, password }: RequestData = await req.json() as RequestData;

    try {
        // check login credentials
        const [users, fields]: [RowDataPacket[], FieldPacket[]] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );      

        // if username not found
        if(users.length === 0) {
            return Response.json({
                status: 407,
                error: 'Login Failed'
            })
        }

        const user: Columns = users[0] as Columns;
        const hashedPassword: string = user.password;

        // if wrong password
        if(await bcrypt.compare(password, hashedPassword) == false) {
            return Response.json({
                status: 407,
                error: 'Login Failed' 
             });
        }
            
        const secretKey: string = process.env.SECRET_KEY!;
        const token: string = jwt.sign({ name: user.username, userid: user.userid, emailAddress: user.email }, secretKey, { expiresIn: '2h'});

        // Successful, user was found
        return Response.json({
            status: 207,
            message: "Login successful",
            token: token
        });
    }

    catch(error) {
    console.error('Database error:', error);
        return Response.json({ 
            status: 500,
            error: 'Internal server error' 
          });
    }
}
