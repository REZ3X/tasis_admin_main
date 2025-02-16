import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/db';

/**
 * Interface representing an admin user's data structure in the database
 */
interface AdminUser {
  id: number;
  username: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

/**
 * Handles POST requests for admin user authentication
 * @param request - The incoming HTTP request containing username and password
 * @returns NextResponse with JWT token on success, or error message on failure
 */
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    const users = rows as AdminUser[];
    const user = users[0];

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: 'admin'
      },
      JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({ success: true, token });
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}