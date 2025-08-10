// const https = require('https');

// // Test the View All Tenants API
// async function testViewTenants() {
//   try {
//     console.log('🔐 Testing login...');
    
//     // First, login to get the token
//     const loginData = JSON.stringify({
//       email: 'admin@cornven.com',
//       password: 'Admin@1234'
//     });

//     const loginOptions = {
//       hostname: 'cornven-pos-system.vercel.app',
//       port: 443,
//       path: '/auth/login',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(loginData)
//       }
//     };

//     const loginResponse = await new Promise((resolve, reject) => {
//       const req = https.request(loginOptions, (res) => {
//         let data = '';
//         res.on('data', (chunk) => data += chunk);
//         res.on('end', () => {
//           try {
//             resolve({
//               statusCode: res.statusCode,
//               data: JSON.parse(data)
//             });
//           } catch (e) {
//             reject(e);
//           }
//         });
//       });
      
//       req.on('error', reject);
//       req.write(loginData);
//       req.end();
//     });

//     console.log(`✅ Login Status: ${loginResponse.statusCode}`);
    
//     if (loginResponse.statusCode !== 200) {
//       console.error('❌ Login failed:', loginResponse.data);
//       return;
//     }

//     const token = loginResponse.data.token;
//     console.log('✅ Login successful, token obtained');

//     // Now test the View All Tenants API
//     console.log('\n📋 Testing View All Tenants API...');
    
//     // Try different possible endpoints
//     const endpoints = [
//       '/admin/tenant-cube-allocation',
//       '/admin/tenants',
//       '/api/admin/tenant-cube-allocation',
//       '/api/admin/tenants'
//     ];
    
//     for (const endpoint of endpoints) {
//       console.log(`\n🔍 Trying endpoint: ${endpoint}`);
      
//       const viewOptions = {
//         hostname: 'cornven-pos-system.vercel.app',
//         port: 443,
//         path: endpoint,
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       };

//     const viewResponse = await new Promise((resolve, reject) => {
//       const req = https.request(viewOptions, (res) => {
//         let data = '';
//         res.on('data', (chunk) => data += chunk);
//         res.on('end', () => {
//           try {
//             resolve({
//               statusCode: res.statusCode,
//               data: JSON.parse(data)
//             });
//           } catch (e) {
//             resolve({
//               statusCode: res.statusCode,
//               data: data
//             });
//           }
//         });
//       });
      
//       req.on('error', reject);
//       req.end();
//     });

//     console.log(`📊 View Tenants Status: ${viewResponse.statusCode}`);
    
//     if (viewResponse.statusCode === 200) {
//       console.log('✅ View All Tenants API successful!');
//       console.log(`📈 Found ${viewResponse.data.length} tenants`);
      
//       if (viewResponse.data.length > 0) {
//         const firstTenant = viewResponse.data[0];
//         console.log('\n📋 Sample tenant data:');
//         console.log(`- ID: ${firstTenant.id}`);
//         console.log(`- Business: ${firstTenant.businessName}`);
//         console.log(`- User: ${firstTenant.user.name} (${firstTenant.user.email})`);
//         console.log(`- Phone: ${firstTenant.user.phone}`);
//         console.log(`- Address: ${firstTenant.address}`);
//         console.log(`- Notes: ${firstTenant.notes}`);
        
//         if (firstTenant.rentals && firstTenant.rentals.length > 0) {
//           const rental = firstTenant.rentals[0];
//           console.log(`- Cube: ${rental.cube.code} (${rental.cube.size})`);
//           console.log(`- Status: ${rental.status}`);
//           console.log(`- Monthly Rent: $${rental.monthlyRent}`);
//           console.log(`- Start Date: ${new Date(rental.startDate).toLocaleDateString()}`);
//           console.log(`- End Date: ${new Date(rental.endDate).toLocaleDateString()}`);
//         }
//       }
//     } else {
//       console.error('❌ View All Tenants API failed:', viewResponse.data);
//     }

//   } catch (error) {
//     console.error('❌ Test failed:', error.message);
//   }
// }

// // Run the test
// testViewTenants();