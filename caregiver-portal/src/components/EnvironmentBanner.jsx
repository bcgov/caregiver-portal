const EnvironmentBanner = () => {                                                                                                                           
    const env = import.meta.env.VITE_ENV?.toLowerCase();                                                                                                    

    if (!env || env === 'production' || env === 'prod') {
      return null;
    }

    return (
      <div style={{
        backgroundColor: env === 'local' ? '#f5a623' : '#d8292f',
        color: '#fff',
        textAlign: 'center',
        padding: '4px 0',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.5px',
      }}>
        {env.toUpperCase()} ENVIRONMENT — FOR DEVELOPMENT AND VALIDATION PURPOSES ONLY
      </div>
    );
  };

  export default EnvironmentBanner;