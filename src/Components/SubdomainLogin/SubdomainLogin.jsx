import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../../Components/Spinner';


export default function SubdomainLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        
        if (!code) {
          setError('No authentication code provided');
          setLoading(false);
          return;
        }
        const jsonData= JSON.parse(decodeURIComponent(code));
          localStorage.setItem('userInfo', JSON.stringify(jsonData.data));
          
          dispatch({
            type: 'SIGNIN',
            payload:jsonData.data,
          });

          toast.success('Successfully logged in');
          navigate("/user")
       
      } catch (error) {
        console.error('Login error:', error);
        setError(error.response?.data?.message || 'Authentication failed');
        localStorage.removeItem('code');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, location.search, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h2>Authenticating...</h2>
        <Spinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return null;
}
