import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, FileText, Image, Video, ArrowLeft } from 'lucide-react';
import axios from 'axios';

function Select() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const userId = user?.id;
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Authentication failed:', error);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(selectedFile.type)) {
      setError('Unsupported file type. Please upload JPEG, PNG, GIF, or MP4.');
      return;
    }

    if (selectedFile.size > maxSize) {
      setError('File is too large. Maximum size is 50MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview({
        url: reader.result,
        type: selectedFile.type
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    processFile(selectedFile);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      navigate('/insert-data', {
        state: { userId, file }
      });
    } catch (error) {
      setError('An error occurred during upload');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <header style={{ border: '1px solid #ccc', padding: '10px' }}>
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
        <span>Upload File</span>
      </header>
      
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p>• Supported formats: JPEG, PNG, GIF, MP4</p>
            <p>• Maximum file size: 50MB</p>
          </div>
          
          <div 
            style={{ 
              border: '2px dashed #ccc', 
              padding: '40px', 
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Cloud size={64} style={{ margin: '0 auto 20px' }} />
            <p>Drag and drop or click to upload</p>
          </div>

          {error && (
            <div style={{ 
              border: '1px solid red', 
              backgroundColor: '#ffe6e6', 
              padding: '10px', 
              marginBottom: '20px' 
            }}>
              <FileText size={20} />
              {error}
            </div>
          )}

          {filePreview && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative', border: '1px solid #ccc' }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  backgroundColor: 'rgba(0,0,0,0.7)', 
                  padding: '5px',
                  color: 'white'
                }}>
                  {filePreview.type.startsWith('image/') ? (
                    <Image size={20} />
                  ) : (
                    <Video size={20} />
                  )}
                </div>
                {filePreview.type.startsWith('image/') ? (
                  <img 
                    src={filePreview.url} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                ) : (
                  <video 
                    src={filePreview.url} 
                    controls 
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleSave} 
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '15px',
              border: '1px solid #007bff',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Select;