import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import geoip from 'geoip-lite';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const referer = req.headers.get('referer');
  const userAgent = req.headers.get('user-agent');
  const pageUrl = req.nextUrl.href; // URL where the request was made from

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid token' }, { status: 400 });
  }

  try {
    // Find the website by the token
    const website = await prisma.website.findUnique({
      where: { scriptToken: token },
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Get the IP address (This may need to be adjusted based on your deployment)
    //@ts-ignore
    const ip = req.headers.get('x-forwarded-for') || req.socket.remoteAddress;

    const location = ip ? geoip.lookup(ip) : null;

    if (!website.verified) {
      await prisma.website.update({
        where: { scriptToken: token },
        data: {
          verified: true, 
        },
      });
    }

    console.log({ website, referer, userAgent, pageUrl, location, ip });

    await prisma.analytics.create({
      data: {
        websiteId: website.id,
        referer: referer || '',
        userAgent: userAgent || '',
        pageUrl: pageUrl || '',
        location: location ? JSON.stringify(location) : '', 
        ip: ip || '',
      },
    });

    return NextResponse.json({ message: "Script Verified Successfully" }, { status: 200 });

  } catch (error) {
    console.error('Error verifying script:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
