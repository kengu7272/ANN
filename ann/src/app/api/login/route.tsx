// login api endpoint
import db from '../db'; // Set up your MySQL connection
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export async function POST(req: any) {
    const { username, password } = await req.json();

    try {
        // check login credentials
        const [users, fields]: any[] = await db.query(
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

        const user = users[0];
        const hashedPassword = user.password;

        // if wrong password
        if(await bcrypt.compare(password, hashedPassword) == false) {
            return Response.json({
                status: 407,
                error: 'Login Failed' 
             });
        }
            
        const secretKey: string = process.env.SECRET_KEY!;
        const token = jwt.sign({ name: user.username, userid: user.userid, emailAddress: user.email }, secretKey, { expiresIn: '2h'});

        // Successful, user was found
        return Response.json({
            status: 207,
            message: "Login successful",
            token: token
        });
    }

    catch(error) {
        return Response.json({ 
            status: 500,
            error: 'Internal server error' 
          });
    }
}