import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dash.css";
import { BarChart3, FileText, Plus, TrendingUp, Upload, Users, CheckCircle, Flame, LogOut, X, CheckCircle2, AlertCircle } from "lucide-react";
import AddKeywordForm from "./AddKeyword";

// Dashboard Home Component
const DashboardHome = () => (
  <div className="card welcome-card">
    <div className="welcome-icon"><img src="jaipur.png" alt=""/></div>
    <h1 className="welcome-title">Welcome to iStart Rajasthan Chatbot Dashboard</h1>
    <p className="welcome-subtitle">Manage your chatbot keywords, responses, and monitor user interactions</p>
    
    <div className="feature-grid">
      <div className="feature-item">
         <div><img src="addkey.png" alt="xyz"/></div>
        <h3 className="feature-title">Add Keywords</h3>
        <p className="feature-description">Manually add new keywords with custom responses</p>
      </div>
      <div className="feature-item">
        <div><img src="bulk.png" alt="xyz"/></div>
        <h3 className="feature-title">Bulk Upload</h3>
        <p className="feature-description">Upload multiple keywords via CSV files</p>
      </div>
      <div className="feature-item">
        <div><img src="user.png" alt="xyz"/></div>
        <h3 className="feature-title">User Keywords</h3>
        <p className="feature-description">View and respond to user-generated keywords</p>
      </div>
      <div className="feature-item">
         <div><img src="analytics.png" alt="xyz"/></div>
        <h3 className="feature-title">Analytics</h3>
        <p className="feature-description">Track performance and generate reports</p>
      </div>
    </div>
  </div>
);

// Add Keywords Component
const AddKeywords = ({ keywords, setKeywords }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon card-icon-blue">
         <Plus size={18} />
        </div>
        <div className="card-title-group">
          <h2 className="card-title">Add Keywords</h2>
          <p className="card-description">Manually add new keywords with responses</p>
        </div>
      </div>
      
      <div className="form">
        <AddKeywordForm />
      </div>
    </div>
  );
};

// Upload CSV Component
const UploadCSV = ({ keywords, setKeywords }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload-csv-keywords.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result);
        setShowModal(true);
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Error uploading CSV file');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadResult(null);
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-icon card-icon-green">
             <Upload size={18} />
          </div>
          <div className="card-title-group">
            <h2 className="card-title">Bulk Upload</h2>
            <p className="card-description">Upload keywords via CSV file</p>
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>
          {/* CSV Format Instructions */}
          <div style={{ 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '20px' 
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#0369a1' }}>CSV Format</h3>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#075985' }}>
              Your CSV file should be formatted as follows:
            </p>
            <code style={{ 
              display: 'block', 
              backgroundColor: '#fff', 
              padding: '12px', 
              borderRadius: '4px', 
              fontSize: '13px',
              fontFamily: 'monospace',
              color: '#1e40af'
            }}>
              keyword,answer1,answer2,answer3,answer4
            </code>
            <ul style={{ margin: '12px 0 0 0', paddingLeft: '20px', fontSize: '14px', color: '#075985' }}>
              <li>First row can be a header (optional)</li>
              <li>Each row: keyword, followed by up to 4 answers</li>
              <li>At least one answer is required</li>
              <li>Duplicate keywords will be skipped</li>
            </ul>
          </div>

          {/* Upload Area */}
          <div className="upload-area">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleCSVUpload}
              className="upload-input"
              id="csv-upload"
              disabled={uploading}
            />
            <label htmlFor="csv-upload" className="upload-label">
              <div className="upload-icon"> 
                <FileText size={32} color={uploading ? "#9ca3af" : "#6b7280"} />
              </div>
              <p className="upload-title">
                {uploading ? 'Uploading...' : 'Drop CSV file here'}
              </p>
              <p className="upload-subtitle">or click to browse</p>
              <span className="upload-button" style={{ opacity: uploading ? 0.5 : 1 }}>
                {uploading ? 'Processing...' : 'Browse Files'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showModal && uploadResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={24} color="#6b7280" />
            </button>

            {/* Success Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={32} color="#16a34a" />
              </div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#111827' }}>
                Upload Complete
              </h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                {uploadResult.message}
              </p>
            </div>

            {/* Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                  {uploadResult.stats.total_processed}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Total Processed
                </div>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: '#dcfce7',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                  {uploadResult.stats.successful}
                </div>
                <div style={{ fontSize: '12px', color: '#15803d', marginTop: '4px' }}>
                  Successful
                </div>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>
                  {uploadResult.stats.failed}
                </div>
                <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>
                  Failed
                </div>
              </div>
            </div>

            {/* Errors */}
            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={20} color="#dc2626" />
                  Errors
                </h3>
                <div style={{
                  maxHeight: '200px',
                  overflow: 'auto',
                  backgroundColor: '#fef2f2',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  {uploadResult.errors.map((error, index) => (
                    <div 
                      key={index}
                      style={{
                        padding: '8px 0',
                        borderBottom: index < uploadResult.errors.length - 1 ? '1px solid #fecaca' : 'none',
                        fontSize: '13px',
                        color: '#991b1b'
                      }}
                    >
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '12px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// User Keywords Component
const UserKeywords = () => {
  const [userKeywords, setUserKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUndefinedKeywords();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchUndefinedKeywords, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUndefinedKeywords = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/undefined-keywords.php');
      const data = await response.json();
      if (data.success) {
        setUserKeywords(data.data);
      }
    } catch (error) {
      console.error('Error fetching undefined keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUndefinedKeyword = async (keywordId) => {
    try {
      await fetch(`http://localhost:8000/api/undefined-keywords.php?id=${keywordId}`, {
        method: 'DELETE'
      });
      fetchUndefinedKeywords(); // Refresh the list
    } catch (error) {
      console.error('Error deleting undefined keyword:', error);
    }
  };

  if (loading) {
    return (
      <div className="card card-full">
        <div className="card-header">
          <h2 className="card-title">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-full">
      <div className="card-header">
        <div className="card-header-content">
          <div className="card-icon card-icon-orange">
           <Users size={18} />
          </div>
          <div className="card-title-group">
            <h2 className="card-title">User Keywords</h2>
            <p className="card-description">Keywords entered by users that need responses (Auto-refreshes every 5 seconds)</p>
          </div>
        </div>
        <span className="status-badge status-badge-red">
          {userKeywords.length} Unanswered
        </span>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Frequency</th>
              <th>Date Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userKeywords.map((item, index) => (
              <tr key={index}>
                <td>
                  <span className="table-keyword">{item.keyword}</span>
                </td>
                <td>
                  <span className="frequency-badge">
                    {item.frequency} times
                  </span>
                </td>
                <td>
                  <span className="date-badge">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-link"
                    onClick={() => deleteUndefinedKeyword(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {userKeywords.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  No undefined keywords found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Performance Component
const Performance = () => (
  <div className="cards-grid">
    <div className="card">
      <div className="card-header">
        <div className="card-icon card-icon-blue">
          <BarChart3 size={18} />
        </div>
        <div className="card-title-group">
          <h2 className="card-title">Response Rate</h2>
          <p className="card-description">Percentage of keywords with responses</p>
        </div>
      </div>
      <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2563eb', textAlign: 'center', padding: '24px 0' }}>
        85%
      </div>
    </div>
    
    <div className="card">
      <div className="card-header">
        <div className="card-icon card-icon-green">
          <CheckCircle size={18} />
        </div>
        <div className="card-title-group">
          <h2 className="card-title">Total Keywords</h2>
          <p className="card-description">Number of active keywords</p>
        </div>
      </div>
      <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#16a34a', textAlign: 'center', padding: '24px 0' }}>
        247
      </div>
    </div>
    
    <div className="card">
      <div className="card-header">
        <div className="card-icon card-icon-purple">
           <Flame size={18} />
        </div>
        <div className="card-title-group">
          <h2 className="card-title">User Interactions</h2>
          <p className="card-description">Total user queries this month</p>
        </div>
      </div>
      <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#7c3aed', textAlign: 'center', padding: '24px 0' }}>
        1,234
      </div>
    </div>
  </div>
);

// Reports Component
const Reports = () => (
  <div className="card">
    <div className="card-header">
      <div className="card-icon card-icon-orange">
         <FileText size={18} />
      </div>
      <div className="card-title-group">
        <h2 className="card-title">Reports</h2>
        <p className="card-description">Generate and download reports</p>
      </div>
    </div>
    
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '16px' }}>
        <button className="btn btn-primary" style={{ marginRight: '12px' }}>
          Generate Monthly Report
        </button>
        <button className="btn btn-primary">
          Export Keywords List
        </button>
      </div>
      <p style={{ color: '#6b7280', fontSize: '14px' }}>
        Last report generated: March 15, 2024
      </p>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [keywords, setKeywords] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout.php", {
        method: "POST",
        credentials: "include",
      });

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");

      // Redirect to login
      navigate("/Login");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear localStorage anyway
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      navigate("/Login");
    }
  };

  // Navigation items
  const navigationItems = {
    platform: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'add-keywords', label: 'Add Keywords', icon: Plus },
      { id: 'upload-csv', label: 'Upload CSV', icon: Upload },
      { id: 'user-keywords', label: 'User Keywords', icon: Users },
    ],
    analytics: [
      { id: 'performance', label: 'Performance', icon: TrendingUp },
      { id: 'reports', label: 'Reports', icon: FileText },
    ]
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome />;
      case 'add-keywords':
        return <AddKeywords keywords={keywords} setKeywords={setKeywords} />;
      case 'upload-csv':
        return <UploadCSV keywords={keywords} setKeywords={setKeywords} />;
      case 'user-keywords':
        return <UserKeywords />;
      case 'performance':
        return <Performance />;
      case 'reports':
        return <Reports />;
      default:
        return <DashboardHome />;
    }
  };

  // Get current page info
  const getCurrentPageInfo = () => {
    const allItems = [...navigationItems.platform, ...navigationItems.analytics];
    const current = allItems.find(item => item.id === activeSection);
    return current || navigationItems.platform[0];
  };

  const currentPage = getCurrentPageInfo();

  return (
    <>
      <div className="dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="company-info">
              <div className="company-details">
                <img src="download.png" alt=""/>
              </div>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-section-title">Platform</h3>
              <ul className="nav-list">
                {navigationItems.platform.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`nav-item ${activeSection === item.id ? 'nav-item-active' : ''}`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <span className="nav-icon"><item.icon size={18} /></span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* User Info and Logout */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '20px'
          }}>
            {user && (
              <div style={{ marginBottom: '10px', fontSize: '14px', color: '#6b7280' }}>
                <div style={{ fontWeight: '600', color: '#111827' }}>{user.name}</div>
                <div style={{ fontSize: '12px' }}>{user.email}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                width: '10%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px',
                backgroundColor: '#fee',
                color: '#c33',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-wrapper">
            {/* Header */}
            <div className="page-header">
              <div className="breadcrumb"></div>
              {activeSection !== 'dashboard' && <h1 className="page-title">{currentPage.label}</h1>}

              <p className="page-description">
                {activeSection === 'add-keywords' && "Manually add new keywords with custom responses"}
                {activeSection === 'upload-csv' && "Upload multiple keywords via CSV files"}
                {activeSection === 'user-keywords' && "View and respond to user-generated keywords"}
                {activeSection === 'performance' && "Track chatbot performance and response metrics"}
                {activeSection === 'reports' && "Generate and download detailed reports"}
              </p>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;