import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Using local mock data for tenant products...');
    
    // Import mock data
    const { mockProducts, getProductsByTenant } = await import('@/data/mockProducts');
    
    // Get tenant ID from query parameters
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    let products;
    if (tenantId) {
      products = getProductsByTenant(tenantId);
      console.log(`Found ${products.length} products for tenant ${tenantId}`);
      console.log('Sample product data:', JSON.stringify(products[0], null, 2));
    } else {
      // If no tenantId provided, return all products
      products = mockProducts;
      console.log(`Returning all ${products.length} products`);
    }

    // Set CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    return NextResponse.json(products, { 
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error fetching tenant products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Proxying tenant products POST request to deployed API...');
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Make request to deployed API
    const response = await fetch('https://cornven-pos-system.vercel.app/tenant/products', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Deployed API response status:', response.status);

    const data = await response.json();

    // Set CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    return NextResponse.json(data, { 
      status: response.status,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error proxying tenant products POST request:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}