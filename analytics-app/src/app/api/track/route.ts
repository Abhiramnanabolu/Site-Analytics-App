import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { geolocation, ipAddress } from '@vercel/functions'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const referer = req.headers.get('referer');
  const userAgent = req.headers.get('user-agent');
  const pageUrl = req.nextUrl.href; 
  const geo = geolocation(req)
  const ip = ipAddress(req)

  try {

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 400 });
    }

    const website = await prisma.website.findFirst({
      where: { scriptToken: token  },
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    if (!website.verified) {
      await prisma.website.update({
        where: { id: website.id },
        data: {
          verified: true, 
        },
      });
    }

    //console.log({ website, referer, userAgent, pageUrl });

    return NextResponse.json({ message: "Script Verified Successfully" ,geo , ip, website , referer, userAgent, pageUrl }, { status: 200 });

  } catch (error) {
    console.error('Error verifying script:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
