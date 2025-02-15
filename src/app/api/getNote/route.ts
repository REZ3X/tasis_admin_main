import { NextResponse } from 'next/server';

export async function GET() {
    try {
        return NextResponse.json({ message: 'Success' });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST() {
    try {
        return NextResponse.json({ message: 'Success' });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}