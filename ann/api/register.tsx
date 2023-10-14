import { NextApiRequest, NextApiResponse } from 'next';
import db from './db'; // Set up your MySQL connection
import { hash } from 'bcrypt';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const [existingUser]: any[] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser.length > 0) {
      // User already exists
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password (using bcrypt)
    const hashedPassword = await hash(password, 10);

    // Insert the user into the database with a parameterized query
    await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
