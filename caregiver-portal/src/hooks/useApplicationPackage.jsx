import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useApplicationPackage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createApplicationPackage = async (packageData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/application-package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session auth
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create application package: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getApplicationPackages = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching application packages');        
      const url = `${API_BASE_URL}/application-package`;
      console.log(url);
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch application packages: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getApplicationPackage = async (applicationPackageId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch application package: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // get an applicationForm meta data by applicationId
  // does not return the form data itself
  const getApplicationForm = useCallback(async (applicationId) => {
    const response = await fetch(`${API_BASE_URL}/application-forms/${applicationId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok){
      throw new Error(`Failed to fetch application form data: ${response.status}`)
    }
    return await response.json();
  }, []);

  const getApplicationForms = async (applicationPackageId) => {
    console.log('Fetching forms for packageId:', applicationPackageId);
    const url = `${API_BASE_URL}/application-package/${applicationPackageId}/application-form`
    console.log('Request URL:', url);
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok){
        throw new Error(`Failed to fetch application forms: ${response.status}`)
      }
      return await response.json();
  };

  // initial submission of an application package for the referral step
  const submitApplicationPackage = async (applicationPackageId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await
  fetch(`${API_BASE_URL}/application-package/${applicationPackageId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to submit application package: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // lock, and potentially finalize, an application package
  // will enable household consent forms to be collected, if applicable
  const lockApplicationPackage = async (applicationPackageId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}/lock-application`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
      });

      if(!response.ok) {
        throw new Error(`Failed to lock application package: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const validateHouseholdCompletion = async (applicationPackageId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}/validate-household`,
  {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to validate household completion: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createApplicationPackage,
    getApplicationPackage,
    getApplicationPackages,
    getApplicationForms,
    lockApplicationPackage,
    getApplicationForm,
    submitApplicationPackage,
    validateHouseholdCompletion,
    loading,
    error,
  };

};