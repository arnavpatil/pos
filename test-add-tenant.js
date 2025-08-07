// Test script for Add Tenant API
const testAddTenant = async () => {
  const API_BASE_URL = 'https://cornven-pos-system.vercel.app';
  
  try {
    console.log('Testing Add Tenant API...');
    
    // First login to get token
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@cornven.com',
        password: 'Admin@1234'
      }),
    });

    if (!loginResponse.ok) {
      console.error('Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    console.log('Login successful, token received');

    // Now test add tenant
    const tenantData = {
      name: "Test Tenant",
      email: "test@example.com",
      password: "Tenant@1234",
      phone: "0400123456",
      businessName: "Test Business",
      address: "123 Test St, Melbourne VIC",
      notes: "Test tenant for API validation"
    };

    const addTenantResponse = await fetch(`${API_BASE_URL}/admin/add-tenant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify(tenantData),
    });

    console.log('Add Tenant Response status:', addTenantResponse.status);
    
    if (!addTenantResponse.ok) {
      const errorText = await addTenantResponse.text();
      console.error('Add Tenant Error:', errorText);
      return;
    }

    const tenantResponse = await addTenantResponse.json();
    console.log('Add Tenant successful!');
    console.log('Tenant ID:', tenantResponse.id);
    console.log('Tenant Name:', tenantResponse.name);
    console.log('Business Name:', tenantResponse.tenants[0]?.businessName);
    
  } catch (error) {
    console.error('Network error:', error.message);
  }
};

// Run the test
testAddTenant();