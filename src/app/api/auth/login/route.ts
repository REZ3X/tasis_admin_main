import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/db';

interface AdminUser {
  id: number;
  username: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Add fallback for development

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Single query to get user
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
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json({ success: true, token });
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
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