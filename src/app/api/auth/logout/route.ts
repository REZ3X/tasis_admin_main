import { NextResponse } from 'next/server';

/**
 * Handles POST request for user logout
 * Removes the adminToken cookie and returns a success response
 * @returns {Promise<NextResponse>} JSON response indicating successful logout
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete('adminToken');
  
  return response;
}