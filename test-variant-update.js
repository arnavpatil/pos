// Test script to verify the variant-based stock update fix
const BASE_URL = 'http://localhost:3001/api';

async function testVariantStockUpdate() {
  const { default: fetch } = await import('node-fetch');
  try {
    console.log('🧪 Testing Variant-Based Stock Update...');

    // Step 1: Login to get token
    console.log('\n1. Logging in as tenant...');
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

    // Step 2: Get tenant products to find one with variants
    console.log('\n2. Fetching tenant products...');
    const productsResponse = await fetch(`${BASE_URL}/tenant/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!productsResponse.ok) {
      console.log('❌ Failed to fetch products:', productsResponse.status);
      return;
    }

    const products = await productsResponse.json();
    console.log(`✅ Fetched ${products.length} products`);

    // Find a product with variants
    const productWithVariants = products.find(p => p.variants && p.variants.length > 0);
    
    if (!productWithVariants) {
      console.log('❌ No products with variants found');
      console.log('Available products:', products.map(p => ({ id: p.id, name: p.name, variants: p.variants?.length || 0 })));
      return;
    }

    console.log(`✅ Found product with variants: ${productWithVariants.name}`);
    console.log(`   Product ID: ${productWithVariants.id}`);
    console.log(`   Variants: ${productWithVariants.variants.length}`);
    console.log(`   First variant ID: ${productWithVariants.variants[0].id}`);
    console.log(`   Current price: ${productWithVariants.variants[0].price}`);
    console.log(`   Current stock: ${productWithVariants.variants[0].stock}`);

    // Step 3: Test variant update
    console.log('\n3. Testing variant update...');
    const newPrice = productWithVariants.variants[0].price + 1;
    const newStock = productWithVariants.variants[0].stock + 5;
    
    const updateResponse = await fetch(`${BASE_URL}/tenant/products/${productWithVariants.id}/variants/${productWithVariants.variants[0].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        price: newPrice.toString(),
        stock: newStock.toString()
      })
    });

    console.log('Variant update status:', updateResponse.status);
    
    if (updateResponse.ok) {
      const updatedVariant = await updateResponse.json();
      console.log('✅ Variant update successful!');
      console.log(`   New price: ${updatedVariant.price}`);
      console.log(`   New stock: ${updatedVariant.stock}`);
      
      // Step 4: Verify the update by fetching products again
      console.log('\n4. Verifying update...');
      const verifyResponse = await fetch(`${BASE_URL}/tenant/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (verifyResponse.ok) {
        const updatedProducts = await verifyResponse.json();
        const updatedProduct = updatedProducts.find(p => p.id === productWithVariants.id);
        const updatedVariantData = updatedProduct?.variants?.find(v => v.id === productWithVariants.variants[0].id);
        
        if (updatedVariantData) {
          console.log('✅ Update verified!');
          console.log(`   Verified price: ${updatedVariantData.price}`);
          console.log(`   Verified stock: ${updatedVariantData.stock}`);
        } else {
          console.log('❌ Could not verify update - variant not found');
        }
      } else {
        console.log('❌ Failed to verify update');
      }
    } else {
      const errorText = await updateResponse.text();
      console.log('❌ Variant update failed:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testVariantStockUpdate();