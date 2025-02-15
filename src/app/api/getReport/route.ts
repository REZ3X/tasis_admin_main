import { NextResponse } from 'next/server';
import { pool, ensureConnection } from '../db/db';
import { RowDataPacket } from 'mysql2';

/**
 * GET endpoint to retrieve all reports from the database
 * @returns NextResponse with reports data or error message
 * Response format: { success: boolean, reports?: RowDataPacket[], error?: string }
 */
export async function GET() {
    try {
        const isConnected = await ensureConnection();
        if (!isConnected) {
            return NextResponse.json(
                { success: false, error: 'Database connection failed' },
                { status: 503 }
            );
        }

        const [reports] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM reports ORDER BY submitted_datetime DESC`
        );

        return NextResponse.json({ 
            success: true, 
            reports 
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
}