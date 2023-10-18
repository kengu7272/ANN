// login api endpoint
import db from '../db'; // Set up your MySQL connection
import bcrypt from 'bcrypt';

export async function POST(req: any) {
    const { username, password } = await req.json();

    try {
        // check login credentials
        const [users, fields]: any[] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );      

        const hashedPassword = users[0].password;

        if(await bcrypt.compare(password, hashedPassword) == false) {
            return Response.json({
                status: 407,
                error: 'Login Failed' 
             });
        }
            
        // Successful, user was found
        return Response.json({
            status: 207,
            message: "Login successful"
        });
    }

    catch(error) {
        return Response.json({ 
            status: 500,
            error: 'Internal server error' 
          });
    }
}