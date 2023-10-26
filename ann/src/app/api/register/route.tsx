// Register api endpoint

import db from '../db'; // Set up your MySQL connection
import { hash } from 'bcrypt';
import { RowDataPacket, FieldPacket } from 'mysql2';

interface RequestData {
  username: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const { username, email, password }: RequestData = await req.json() as RequestData;

  try {
    // Check if the username already exists
    const existingUser: [RowDataPacket[], FieldPacket[]] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUser[0].length > 0) { 
      // User already exists
      return Response.json({ 
        status: 409,
        error: 'Username already exists' 
      });
    }

    // Check if the username already exists
    const existingEmail: [RowDataPacket[], FieldPacket[]] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingEmail[0].length > 0) { 
      // User already exists
      return Response.json({ 
        status: 408,
        error: 'Email already exists' 
      });
    }

    // Hash the password (using bcrypt)
    const hashedPassword: string = await hash(password, 10);

    // Insert the user into the database with a parameterized query
    await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    ); 

    return Response.json({ 
      status: 201,
      message: 'User registered successfully' 
    });
  } 
  catch (error) {
    console.error('Database error:', error);
    return Response.json({ 
      status: 500,
      error: 'Internal server error' 
    });
  }
}
