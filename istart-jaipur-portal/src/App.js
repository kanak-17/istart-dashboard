import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Rocket, Star, TrendingUp, DollarSign, Award, Users, Building,
  Bot, ArrowLeft, Code, Globe, BookOpen, Target, Briefcase,
  Lightbulb, Shield, Camera,
  Save, X, ClipboardCopy, Pencil,
  UserCircle, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import './App.css';

const IStartChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [typewriterText, setTypewriterText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationPosition, setNotificationPosition] = useState({ x: 0, y: 0 });
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [responseAttempts, setResponseAttempts] = useState({});
  const [keywordData, setKeywordData] = useState({});
  const [, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from backend
    const fetchKeywordData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}?endpoint=all`);
        const data = await response.json();
        
        if (data.success) {
          const formattedData = {};
          data.data.keywords.forEach(item => {
            formattedData[item.term] = {
              icon: getIconForKeyword(item.term),
              answers: item.answers
            };
          });
          setKeywordData(formattedData);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Failed to connect to server. Please check your backend connection.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywordData();
  }, []);
  const messagesEndRef = useRef(null);

  // API Configuration
  const API_BASE_URL = 'http://localhost/istart-jaipur-portal/api.php';
  const ADMIN_API_URL = 'http://localhost:8000/api/undefined-keywords.php';

  // Fallback: send undefined keyword directly to admin backend
  const sendUndefinedKeywordToAdmin = async (keyword) => {
    try {
      await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_undefined', keyword })
      });
    } catch (e) {
      // Swallow errors – this is best-effort only
      console.warn('Failed to notify admin about undefined keyword:', e);
    }
  };

  const welcomeText = "👋Welcome to iStart Rajasthan!";

  // Icon mapping for different keywords
  const getIconForKeyword = (keyword) => {
    const iconMap = {
      "Additional Booster": <Rocket className="w-5 h-5" />,
      "Booster": <Star className="w-5 h-5" />,
      "Performance Booster": <TrendingUp className="w-5 h-5" />,
      "Employment Booster": <Building className="w-5 h-5" />,
      "Thrust Booster": <Target className="w-5 h-5" />,
      "Investment": <DollarSign className="w-5 h-5" />,
      "AIF": <DollarSign className="w-5 h-5" />,
      "Intellectual": <Shield className="w-5 h-5" />,
      "Quality": <Award className="w-5 h-5" />,
      "Certification": <Award className="w-5 h-5" />,
      "Infrastructure": <Building className="w-5 h-5" />,
      "Networking": <Users className="w-5 h-5" />,
      "Exemptions": <Shield className="w-5 h-5" />,
      "Exposure": <Globe className="w-5 h-5" />,
      "Corporate": <Building className="w-5 h-5" />,
      "Venture": <Briefcase className="w-5 h-5" />,
      "Venture Capitalist": <DollarSign className="w-5 h-5" />,
      "Partnership": <Users className="w-5 h-5" />,
      "Talent": <Users className="w-5 h-5" />,
      "Patent": <Shield className="w-5 h-5" />,
      "Mentoring": <Users className="w-5 h-5" />,
      "Upskills": <BookOpen className="w-5 h-5" />,
      "Skills": <BookOpen className="w-5 h-5" />,
      "Ambassador program": <Users className="w-5 h-5" />,
      "Procurement": <Building className="w-5 h-5" />,
      "Evaluation": <Target className="w-5 h-5" />,
      "Nominee": <Award className="w-5 h-5" />,
      "Grant": <Award className="w-5 h-5" />,
      "Pre-seeds": <Lightbulb className="w-5 h-5" />,
      "Revenue": <DollarSign className="w-5 h-5" />,
      "eBazar": <Globe className="w-5 h-5" />,
      "Enterprise": <Briefcase className="w-5 h-5" />,
      "Annual Turnover": <TrendingUp className="w-5 h-5" />,
      "Stakeholder": <Users className="w-5 h-5" />,
      "AVGC-XR": <Camera className="w-5 h-5" />,
      "Workshops": <BookOpen className="w-5 h-5" />,
      "Robotics": <Code className="w-5 h-5" />,
      "CEO": <Users className="w-5 h-5" />,
      "Multimedia": <Camera className="w-5 h-5" />,
      "VFX": <Camera className="w-5 h-5" />,
      "Cloud": <Code className="w-5 h-5" />,
      "MSME": <Building className="w-5 h-5" />,
      "Logistics parks": <Building className="w-5 h-5" />
    };
    return iconMap[keyword] || <Lightbulb className="w-5 h-5" />;
  };

  // Search for keywords
  const searchKeywords = async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=search&q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success && data.results.length > 0) {
        return data.results[0]; // Return the best match
      }

      // No results found – notify admin backend so it appears on dashboard
      await sendUndefinedKeywordToAdmin(query);
      return null;
    } catch (err) {
      console.error('Search Error:', err);
      // On failure, still notify admin backend
      await sendUndefinedKeywordToAdmin(query);
      return null;
    }
  };

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < welcomeText.length) {
        setTypewriterText(welcomeText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showNotification = (message, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setNotificationPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const startEdit = (index, content) => {
    setEditingIndex(index);
    setEditedContent(content);
  };

  const saveEdit = (index) => {
    const updatedMessages = [...messages];
    updatedMessages[index] = {
      ...updatedMessages[index],
      content: editedContent
    };
    setMessages(updatedMessages);
    setEditingIndex(null);
    setEditedContent('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedContent('');
  };

  const handleCopy = (content, e) => {
    navigator.clipboard.writeText(content);
    showNotification('Copied!', e);
  };

  const getResponseForQuery = async (query, attemptNumber = 0) => {
    // First, try exact match from loaded data
    const queryLower = query.toLowerCase();
    
    for (const [keyword, data] of Object.entries(keywordData)) {
      if (keyword.toLowerCase().includes(queryLower) || 
          queryLower.includes(keyword.toLowerCase()) ||
          queryLower.includes(keyword.toLowerCase().replace(/\s+/g, '')) ||
          keyword.toLowerCase().replace(/\s+/g, '').includes(queryLower.replace(/\s+/g, ''))) {
        
        const answerIndex = attemptNumber % data.answers.length;
        return data.answers[answerIndex];
      }
    }

    // If no exact match, search via API
    const searchResult = await searchKeywords(query);
    if (searchResult && searchResult.answers.length > 0) {
      const answerIndex = attemptNumber % searchResult.answers.length;
      return searchResult.answers[answerIndex];
    }
    
    // Default responses for unknown queries
    const defaultResponses = [
      "I'm sorry, I don't have specific information about that topic. Could you please rephrase your question or ask about iStart Rajasthan services?",
      "Let me try to help you differently. Could you provide more context about what you're looking for regarding iStart Rajasthan?",
      "I apologize for not having the exact information you need. Please consider contacting iStart Rajasthan directly for detailed assistance."
    ];
    
    return defaultResponses[attemptNumber] || defaultResponses[0];
  };

  const handleSatisfaction = async (messageIndex, isSatisfied) => {
    const updatedMessages = [...messages];
    const originalQuery = currentQuestion;
    
    // Remove the satisfaction prompt
    updatedMessages.splice(messageIndex + 1, 1);
    
    // Add user's satisfaction response
    const satisfactionResponse = {
      type: 'user',
      content: isSatisfied ? 'Yes' : 'No',
      timestamp: new Date()
    };
    updatedMessages.push(satisfactionResponse);
    setMessages(updatedMessages);

    if (!isSatisfied) {
      const currentAttempt = responseAttempts[originalQuery] || 0;
      
      if (currentAttempt < 3) {
        setIsTyping(true);
        
        setTimeout(async () => {
          const newResponse = await getResponseForQuery(originalQuery, currentAttempt + 1);
          const newBotMessage = {
            type: 'bot',
            content: newResponse,
            timestamp: new Date(),
            showSatisfaction: true,
            questionKey: originalQuery
          };
          
          setMessages(prev => [...prev, newBotMessage]);
          setResponseAttempts(prev => ({
            ...prev,
            [originalQuery]: currentAttempt + 1
          }));
          setIsTyping(false);
        }, 1000);
      } else {
        setTimeout(() => {
          const finalMessage = {
            type: 'bot',
            content: "I apologize for not being able to provide a satisfactory answer. Please contact our support team directly for personalized assistance with your query.",
            timestamp: new Date(),
            showSatisfaction: false
          };
          setMessages(prev => [...prev, finalMessage]);
        }, 500);
      }
    }
  };

  const handleKeywordClick = async (keyword) => {
    setShowWelcome(false);
    const userMessage = {
      type: 'user',
      content: keyword,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion(keyword);
    setResponseAttempts(prev => ({ ...prev, [keyword]: 0 }));

    setTimeout(async () => {
      const response = await getResponseForQuery(keyword, 0);
      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date(),
        showSatisfaction: true,
        questionKey: keyword
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleBackToStart = () => {
    setShowWelcome(true);
    setMessages([]);
    setInputText('');
    setIsTyping(false);
    setCurrentQuestion('');
    setResponseAttempts({});
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      setShowWelcome(false);
      setIsTyping(true);

      const userMessage = {
        type: 'user',
        content: inputText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      const query = inputText;
      setInputText('');
      setCurrentQuestion(query);
      setResponseAttempts(prev => ({ ...prev, [query]: 0 }));

      setTimeout(async () => {
        const botResponse = await getResponseForQuery(query, 0);
        const botMessage = {
          type: 'bot',
          content: botResponse,
          timestamp: new Date(),
          showSatisfaction: true,
          questionKey: query
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (error) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="header-top">
            <h1>Connection Error</h1>
          </div>
        </div>
        <div className="chatbot-body">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <AlertCircle style={{ width: '64px', height: '64px', color: '#ef4444', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Connection Error</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      {/* Notification Popup */}
      {notification && (
        <div 
          className="notification-popup"
          style={{
            left: `${notificationPosition.x}px`,
            top: `${notificationPosition.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {notification}
        </div>
      )}

      <div className="chatbot-header">
        <div className="header-top">
          <h1 className="typewriter">{typewriterText}</h1>
          <div className="header-controls">
            {!showWelcome && (
              <button className="back-btn" onClick={handleBackToStart}>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            
          </div>
        </div>
      </div>

      <div className="chatbot-body">
        {showWelcome ? (
          <div className="welcome-section">
            <div className="quick-help">
              <h3>Quick Help Topics:</h3>
              <div className="keyword-grid">
                {Object.entries(keywordData).slice(0, 20).map(([keyword, data]) => (
                  <button
                    key={keyword}
                    className="keyword-btn"
                    onClick={() => handleKeywordClick(keyword)}
                  >
                    {data.icon}
                    <span>{keyword}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`message ${message.type}`}>
                  {message.type === 'bot' && (
                    <div className="bot-avatar">
                      <Bot size={16} />
                    </div>
                  )}
                  
                  <div className="message-content">
                    {editingIndex === index ? (
                      <div className="edit-container">
                        <input
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="edit-input"
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button 
                            onClick={() => saveEdit(index)} 
                            className="icon-btn save-btn"
                            data-tooltip="Save"
                          >
                            <Save size={16} />
                          </button>
                          <button 
                            onClick={cancelEdit} 
                            className="icon-btn cancel-btn"
                            data-tooltip="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="message-text">{message.content}</div>
                        <div className="message-footer">
                          <span className="message-timestamp">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <div className="message-actions">
                            {message.type === 'bot' && (
                              <ClipboardCopy 
                                className="icon-action"
                                data-tooltip="Copy"
                                onClick={(e) => handleCopy(message.content, e)} 
                              />
                            )}
                            {message.type === 'user' && (
                              <Pencil 
                                className="icon-action"
                                data-tooltip="Edit"
                                onClick={() => startEdit(index, message.content)} 
                              />
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="user-avatar">
                      <UserCircle size={16} />
                    </div>
                  )}
                </div>

                {/* Satisfaction Prompt */}
                {message.type === 'bot' && message.showSatisfaction && (
                  <div className="message bot">
                    <div className="bot-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="message-content" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                      <div className="message-text" style={{ marginBottom: '12px' }}>Are you satisfied with the response?</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            backgroundColor: '#059669',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onClick={() => handleSatisfaction(index, true)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
                        >
                          <CheckCircle size={16} />
                          Yes
                        </button>
                        <button 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onClick={() => handleSatisfaction(index, false)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                        >
                          <XCircle size={16} />
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="bot-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="chatbot-footer">
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="chat-input"
          />
          <button 
            onClick={handleSendMessage} 
            className="send-btn"
            disabled={!inputText.trim()}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="footer-text">
          Click on any topic above or type your question below.
        </p>
      </div>
    </div>
  );
};

export default IStartChatbot;