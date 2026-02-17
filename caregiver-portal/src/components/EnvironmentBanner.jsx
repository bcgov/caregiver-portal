import React, { useRef, useEffect} from 'react';

const EnvironmentBanner = () => {                                                                                                                           
    const env = import.meta.env.VITE_ENV?.toLowerCase();
    const bannerRef = useRef(null);
    
    useEffect(() => {
      if (bannerRef.current) {
        const height = bannerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--banner-height', `${height}px`);
      }

      // Cleanup: remove the variable when banner unmounts
      return () => {
        document.documentElement.style.setProperty('--banner-height', '0px');
      };
    }, []);

    if (!env || env === 'production' || env === 'prod') {
      return null;
    }

    return (
      <div ref={bannerRef} style={{
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