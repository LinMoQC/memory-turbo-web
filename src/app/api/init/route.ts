import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const lockFilePath = path.resolve(process.cwd(), 'memory.lock');
    fs.writeFileSync(lockFilePath, 'initialized');

    setTimeout(() => {
        console.log('Restarting server...');
        process.exit(0);
    }, 1000);

    return NextResponse.redirect(new URL('/login', req.nextUrl));
}