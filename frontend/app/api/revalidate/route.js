import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const token = request.headers.get('x-revalidate-token');

    // Verify the revalidation token
    if (!token || token !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid revalidation token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tag, tags } = body;

    // Support single tag or multiple tags
    const tagsToRevalidate = tags || (tag ? [tag] : []);

    if (tagsToRevalidate.length === 0) {
      return NextResponse.json(
        { error: 'No tag(s) provided' },
        { status: 400 }
      );
    }

    // Revalidate all provided tags
    const revalidated = [];
    for (const t of tagsToRevalidate) {
      revalidateTag(t);
      revalidated.push(t);
    }

    return NextResponse.json({
      revalidated: true,
      tags: revalidated,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
