import { getCurrentWeather } from '@/lib/weather';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const location = searchParams.get('location');

  if (!lat && !lon && !location) {
    return NextResponse.json(
      { error: 'Location coordinates or location name required' },
      { status: 400 }
    );
  }

  try {
    const query = location || `${lat},${lon}`;
    const data = await getCurrentWeather(query);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}