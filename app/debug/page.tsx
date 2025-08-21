'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { adminTenantService } from '@/services/adminTenantService';

const DebugPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [apiTest, setApiTest] = useState<string>('Not tested');
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    const currentToken = authService.getAuthToken();
    setToken(currentToken);
  }, []);

  const testApi = async () => {
    try {
      setApiTest('Testing...');
      const result = await adminTenantService.getTenants();
      setTenants(result);
      setApiTest(`Success: ${result.length} tenants loaded`);
    } catch (error) {
      setApiTest(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
          <div className="space-y-2">
            <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
            <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Test</h2>
          <button
            onClick={testApi}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Test Tenants API
          </button>
          <p><strong>Result:</strong> {apiTest}</p>
          {tenants.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Tenants Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(tenants, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;