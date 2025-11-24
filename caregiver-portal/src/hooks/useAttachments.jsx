import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useAttachments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadAttachment = useCallback(async (attachmentData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/attachments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(attachmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload attachment');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // TODO: GET BY HOUSEHOLD MEMBER;

  const getAttachmentsByHouseholdId = useCallback(async (householdMemberId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/attachments/household-member/${householdMemberId}`,
        {
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch attachments');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadAttachment = useCallback(async (attachmentId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/attachments/${attachmentId}`,
        {
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to download attachment');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAttachment = useCallback(async (attachmentId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/attachments/${attachmentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete attachment');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    uploadAttachment,
    getAttachmentsByHouseholdId,
    downloadAttachment,
    deleteAttachment,
    isLoading,
    error,
  };
};