import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock storage for tenants (in a real app, this would be a database)
let storedTenants: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    // Debug: Log the received request body
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      );
    }

    // Validate required fields
    const { name, email, password, phone, businessName, address, notes } = body;
    
    // Debug: Log individual fields
    console.log('Extracted fields:', {
      name: `"${name}"`,
      email: `"${email}"`,
      password: `"${password}"`,
      phone: `"${phone}"`,
      businessName: `"${businessName}"`,
      address: `"${address}"`,
      notes: `"${notes}"`
    });
    
    const missingFields = [];
    if (!name || !name.trim()) missingFields.push('name');
    if (!email || !email.trim()) missingFields.push('email');
    if (!password || !password.trim()) missingFields.push('password');
    if (!phone || !phone.trim()) missingFields.push('phone');
    if (!businessName || !businessName.trim()) missingFields.push('businessName');
    if (!address || !address.trim()) missingFields.push('address');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate IDs
    const userId = uuidv4();
    const tenantId = uuidv4();
    const currentTime = new Date().toISOString();

    // Create response matching the external API structure
    const response = {
      id: userId,
      name,
      email,
      password: `$2b$10$n9.J90mBhsehXqCEc9UkXuCUs0.B43a4vMrOGVw.8I9sTx5cj1vFa`, // Mock hashed password
      role: "TENANT",
      phone,
      createdAt: currentTime,
      updatedAt: currentTime,
      tenants: [
        {
          id: tenantId,
          userId,
          businessName,
          address,
          notes: notes || "",
          createdAt: currentTime,
          updatedAt: currentTime
        }
      ]
    };

    // Store the tenant for later retrieval
    const tenantForStorage = {
      id: tenantId,
      userId,
      businessName,
      address,
      notes: notes || "",
      createdAt: currentTime,
      updatedAt: currentTime,
      user: {
        id: userId,
        name,
        email,
        phone
      },
      rentals: []
    };

    storedTenants.push(tenantForStorage);

    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Add Tenant API Error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}