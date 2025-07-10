import React from 'react';
import "../App.css";
import Button from '../components/Button';
import { useAuth } from '../auth/useAuth';

const Dashboard = () => {
  const auth = useAuth();

  if (auth.loading) {
    return <div>Loading user information...</div>;
  }

  const user = auth.user;
  const profile = user?.profile;

  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return 'No address provided';
    const parts = [];
    if (address.street_address) parts.push(address.street_address);
    if (address.locality) parts.push(address.locality);
    if (address.region) parts.push(address.region);
    if (address.postal_code) parts.push(address.postal_code);
    if (address.country) parts.push(address.country);
    return parts.length > 0 ? parts.join(', ') : 'Address information not available';
  };

  const handleCreateApplication = async () => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationType: 'caregiver',
          formData: {},
        }),
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.warn('No JSON in error response');
        }
        console.error('Error creating application:', errorData);
        alert('Failed to create application');
        return;
      }

      const data = await response.json();
      console.log('Application created:', data.application);
      alert(`Application ${data.application.id} created`);
    } catch (err) {
      console.error('Request failed:', err);
      alert('Something went wrong');
    }
  };


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1>Dashboard</h1>
        <div className="flex gap-4">
          <Button
            onClick={handleCreateApplication}
            variant="primary">
            Create New Application
          </Button>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded">
        <h2 className="text-lg mb-2">User Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.id}</p>
      </div>
    </div>
  );
};

export default Dashboard;