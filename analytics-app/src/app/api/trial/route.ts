
import { NextRequest, NextResponse } from 'next/server';

export  function GET(req: NextRequest) {
    if (req.method === 'GET') {
        return NextResponse.json({ message: 'Hello, this is a test API route!' });
    } else {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }
}