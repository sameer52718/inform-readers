import { NextResponse } from 'next/server';

const supportedCountries = ['pk', 'us', 'uk', 'in', 'au', 'ca']; // Add all 150+

export function middleware(request) {
    const host = request.headers.get('host') || '';
    const subdomain = host.split('.')[0];

    // Already on a country subdomain? Skip
    if (supportedCountries.includes(subdomain)) {
        return NextResponse.next();
    }

    const country = request.headers.get('x-country-code')?.toLowerCase();
    console.log(country);

    if (country && supportedCountries.includes(country)) {
        return NextResponse.redirect(`https://${country}.informreaders.com${request.nextUrl.pathname}`);
    }

    return NextResponse.next(); // fallback
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|api).*)'],
};
