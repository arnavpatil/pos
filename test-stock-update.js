// Test script to debug stock update issue
const BASE_URL = 'http://localhost:3001/api';
const DEPLOYED_API = 'https://cornven-pos-system.vercel.app';

async function testStockUpdate() {
  const { default: fetch } = await import('node-fetch');
  try {
    console.log('🧪 Testing Stock Update Issue...\n');

    // Step 1: Login to get token
    console.log('1. Logging in as tenant...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'tenant@cornven.com',
        password: 'Tenant@1234'
      }),
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', errorText);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');
    console.log('Token format:', token.substring(0, 50) + '...');

    // Step 2: Test direct API call to deployed endpoint
    console.log('\n2. Testing direct call to deployed API...');
    const directResponse = await fetch(`${DEPLOYED_API}/tenant/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Direct API status:', directResponse.status);
    if (!directResponse.ok) {
      const errorText = await directResponse.text();
      console.log('Direct API error:', errorText);
    } else {
      const products = await directResponse.json();
      console.log('✅ Direct API call successful, products count:', products.length);
      
      if (products.length > 0) {
        const testProduct = products[0];
        console.log('\n3. Testing stock update on product:', testProduct.id);
        
        const updateResponse = await fetch(`${DEPLOYED_API}/tenant/products/${testProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            price: testProduct.price,
            stock: testProduct.stock + 1
          })
        });
        
        console.log('Update response status:', updateResponse.status);
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.log('❌ Update failed:', errorText);
        } else {
          console.log('✅ Update successful');
        }
      }
    }

    // Step 3: Test local proxy endpoint
    console.log('\n4. Testing local proxy endpoint...');
    const proxyResponse = await fetch(`${BASE_URL}/tenant/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Proxy API status:', proxyResponse.status);
    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text();
      console.log('Proxy API error:', errorText);
    } else {
      console.log('✅ Proxy API call successful');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testStockUpdate();