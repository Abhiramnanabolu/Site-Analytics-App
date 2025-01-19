import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, domain } = body;

    if (!userId || !name || !domain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let website = await prisma.website.findFirst({
      where: { domain },
    });

    if (website) {
      return NextResponse.json({ error: 'Website already exists' }, { status: 400 });
    }

     website = await prisma.website.create({
      data: {
        userId,
        domain,
      },
    });

    const script = `<script src="https://localhost:3000/api/track?token=${website.scriptToken}"></script>`;

    return NextResponse.json({ website, script }, { status: 201 });

  } catch (error) {
    console.error('Error creating website:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
