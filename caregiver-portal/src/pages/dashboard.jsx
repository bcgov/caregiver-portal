// src/pages/Dashboard.jsx (or wherever your dashboard is)
import React from 'react';
import { useAuth } from 'react-oidc-context';


const Dashboard = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading user information...</div>;
  }

  if (!auth.isAuthenticated) {
    return <div>Please log in</div>;
  }

  const user = auth.user;
  const profile = user?.profile;

  // Helper function to safely format address
  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') {
      return 'No address provided';
    }

    const parts = [];
    if (address.street_address) parts.push(address.street_address);
    if (address.locality) parts.push(address.locality);
    if (address.region) parts.push(address.region);
    if (address.postal_code) parts.push(address.postal_code);
    if (address.country) parts.push(address.country);

    return parts.length > 0 ? parts.join(', ') : 'Address information not available';
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {profile?.given_name || profile?.name}!</h2>
      
      <div>
        <h3>User Profile:</h3>
        <p><strong>Name:</strong> {profile?.name || 'Not provided'}</p>
        <p><strong>Email:</strong> {profile?.email || 'Not provided'}</p>
        <p><strong>Subject ID:</strong> {profile?.sub || 'Not provided'}</p>
        <p><strong>Preferred Username:</strong> {profile?.preferred_username || 'Not provided'}</p>
        <p><strong>Given Name:</strong> {profile?.given_name || 'Not provided'}</p>
        <p><strong>Family Name:</strong> {profile?.family_name || 'Not provided'}</p>
        <p><strong>Birthdate:</strong> {profile?.birthdate || 'Not provided'}</p>
        
        {/* Fixed address rendering */}
        <p><strong>Address:</strong> {formatAddress(profile?.address)}</p>
        
        {/* Age 19 or over status */}
        <p><strong>Age 19 or Over:</strong> {profile?.age_19_or_over ? 'Yes' : 'No'}</p>
      </div>


      {/* Optional: Debug info */}
      <details style={{ marginTop: '20px' }}>
        <summary>Debug: Raw User Data</summary>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default Dashboard;