export const useDates = () => {

const formatSubmissionDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Los_Angeles', // PST/PDT
      timeZoneName: 'short'
    });
  };

  return {
    formatSubmissionDate
  };

};