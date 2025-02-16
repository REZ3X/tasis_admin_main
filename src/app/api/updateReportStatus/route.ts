import { NextResponse } from 'next/server';
import { pool, ensureConnection } from '../db/db';
import { ResultSetHeader } from 'mysql2';

/**
 * Updates the status of a report in the database
 * @route PUT /api/updateReportStatus
 * @param {Request} request - Contains reportId and status in the body
 * @returns {Promise<NextResponse>} JSON response with success status and data
 */
export async function PUT(request: Request) {
    try {
        const { reportId, status } = await request.json();

        if (!reportId || !status) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const isConnected = await ensureConnection();
        if (!isConnected) {
            return NextResponse.json(
                { success: false, error: 'Database connection failed' },
                { status: 503 }
            );
        }

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE reports SET status = ? WHERE id = ?',
            [status, reportId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { success: false, error: 'Report not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true,
            data: { reportId, status }
        });
    } catch (error) {
        console.error('Error updating report status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update report status' },
            { status: 500 }
        );
    }
}