import { NextRequest, NextResponse } from 'next/server';

// Mock cubes data with dummy images
const mockCubes = [
  {
    id: "21a057be-058c-4463-a6d1-ad793a148362",
    code: "A1",
    size: "Small",
    pricePerMonth: 200,
    status: "RENTED",
    createdAt: "2025-08-07T00:27:19.062Z",
    updatedAt: "2025-08-06T14:32:04.787Z",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMzAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIj5BMTwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSIxMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+U21hbGwgQ3ViZTwvdGV4dD4KPC9zdmc+",
    dimensions: "2m x 2m x 2m"
  },
  {
    id: "31a057be-058c-4463-a6d1-ad793a148363",
    code: "B2",
    size: "Medium",
    pricePerMonth: 180,
    status: "RENTED",
    createdAt: "2025-07-07T00:27:19.062Z",
    updatedAt: "2025-07-15T10:15:30.787Z",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRUZGNkZGIi8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMzAiIHN0cm9rZT0iIzk4NTVGRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIj5CMjwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSIxMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+TWVkaXVtIEN1YmU8L3RleHQ+Cjwvc3ZnPg==",
    dimensions: "3m x 3m x 3m"
  },
  {
    id: "41a057be-058c-4463-a6d1-ad793a148364",
    code: "C3",
    size: "Large",
    pricePerMonth: 220,
    status: "RENTED",
    createdAt: "2025-06-07T00:27:19.062Z",
    updatedAt: "2025-06-20T14:30:45.787Z",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkVGM0UyIi8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMzAiIHN0cm9rZT0iI0Y1OTUwRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIj5DMzwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSIxMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+TGFyZ2UgQ3ViZTwvdGV4dD4KPC9zdmc+",
    dimensions: "4m x 4m x 4m"
  },
  {
    id: "51a057be-058c-4463-a6d1-ad793a148365",
    code: "D4",
    size: "Extra Large",
    pricePerMonth: 300,
    status: "AVAILABLE",
    createdAt: "2025-05-01T00:27:19.062Z",
    updatedAt: "2025-05-01T00:27:19.062Z",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjBGREY0Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMzAiIHN0cm9rZT0iIzIyQzU1RSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIj5ENDwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSIxMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+WEwgQ3ViZTwvdGV4dD4KPC9zdmc+",
    dimensions: "5m x 5m x 5m"
  }
];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      );
    }

    return NextResponse.json(mockCubes, { status: 200 });
    
  } catch (error) {
    console.error('Cubes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export { mockCubes };