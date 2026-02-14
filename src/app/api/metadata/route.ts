import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Validate URL
        let validUrl: URL;
        try {
            validUrl = new URL(url);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL' },
                { status: 400 }
            );
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(validUrl.toString(), {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PrivateNest/1.0)',
            },
        });

        clearTimeout(timeout);

        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const ogTitleMatch = html.match(
            /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i
        ) || html.match(
            /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i
        );

        // Extract description
        const ogDescMatch = html.match(
            /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i
        ) || html.match(
            /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["'][^>]*>/i
        );
        const descMatch = html.match(
            /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
        ) || html.match(
            /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i
        );

        // Extract favicon
        const faviconMatch = html.match(
            /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["'][^>]*>/i
        ) || html.match(
            /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i
        );

        let favicon_url = '';
        if (faviconMatch?.[1]) {
            const faviconHref = faviconMatch[1];
            if (faviconHref.startsWith('http')) {
                favicon_url = faviconHref;
            } else if (faviconHref.startsWith('//')) {
                favicon_url = `${validUrl.protocol}${faviconHref}`;
            } else if (faviconHref.startsWith('/')) {
                favicon_url = `${validUrl.origin}${faviconHref}`;
            } else {
                favicon_url = `${validUrl.origin}/${faviconHref}`;
            }
        } else {
            favicon_url = `${validUrl.origin}/favicon.ico`;
        }

        return NextResponse.json({
            title: ogTitleMatch?.[1] || titleMatch?.[1] || '',
            description: ogDescMatch?.[1] || descMatch?.[1] || '',
            favicon_url,
        });
    } catch (error) {
        console.error('Metadata fetch error:', error);
        return NextResponse.json(
            { title: '', description: '', favicon_url: '' },
            { status: 200 }
        );
    }
}
