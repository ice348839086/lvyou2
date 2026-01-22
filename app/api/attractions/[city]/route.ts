import { NextRequest, NextResponse } from 'next/server';
import { loadAttractions } from '@/lib/attractions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params;
    const attractions = loadAttractions(city);
    
    if (attractions.length === 0) {
      return NextResponse.json(
        { error: 'City not found or no attractions available' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(attractions);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
