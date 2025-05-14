import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'cost', 'resources', etc.
  const [dashboardData, setDashboardData] = useState(null);
  const messagesEndRef = useRef(null);
  
  // API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/dashboard`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data when tab changes
  useEffect(() => {
    if (activeTab !== 'chat' && !dashboardData) {
      fetchDashboardData();
    }
  }, [activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, {
      text: input,
      sender: 'user'
    }]);
    
    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      
      // Save session ID for conversation continuity
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Add bot response to chat
      setMessages(prev => [...prev, {
        text: data.answer,
        sender: 'bot',
        citations: data.citations
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, there was an error processing your request.',
        sender: 'bot'
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle cost analysis questions
  const askCostQuestion = (question) => {
    setActiveTab('chat');
    setInput(question);
    setTimeout(() => {
      handleSendMessage({ preventDefault: () => {} });
    }, 100);
  };

  const renderCostDashboard = () => (
    <div className="dashboard-container">
      <h2>Cost Optimization Analysis</h2>
      {loading ? (
        <div className="loading-indicator">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card" onClick={() => askCostQuestion("Analyze spending patterns across different regions and instance types")}>
              <h3>Regional Spending</h3>
              <p>Compare costs across 10 regions</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Identify underutilized expensive instances for potential downsizing")}>
              <h3>Utilization Analysis</h3>
              <p>Find underutilized resources</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Track cost trends over time to forecast future spending")}>
              <h3>Cost Forecasting</h3>
              <p>Predict future expenses</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Compare cost efficiency between different instance families")}>
              <h3>Instance Comparison</h3>
              <p>Find optimal instance types</p>
            </div>
          </div>
          <div className="dashboard-info">
            <p>Click on any card to ask our AI assistant for detailed analysis</p>
          </div>
        </>
      )}
    </div>
  );

  const renderResourceDashboard = () => (
    <div className="dashboard-container">
      <h2>Resource Utilization Monitoring</h2>
      {loading ? (
        <div className="loading-indicator">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card" onClick={() => askCostQuestion("Analyze instance usage patterns to optimize scheduling")}>
              <h3>Usage Patterns</h3>
              <p>Optimize instance scheduling</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Identify peak usage periods and opportunities for reserved instances")}>
              <h3>Peak Usage Analysis</h3>
              <p>Find reserved instance opportunities</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Compare utilization across different regions to balance workloads")}>
              <h3>Regional Balance</h3>
              <p>Optimize geographical distribution</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Track instances with short lifespans that could be candidates for spot instances")}>
              <h3>Lifecycle Analysis</h3>
              <p>Find spot instance opportunities</p>
            </div>
          </div>
          <div className="dashboard-info">
            <p>Click on any card to ask our AI assistant for detailed analysis</p>
          </div>
        </>
      )}
    </div>
  );

  const renderRegionalDashboard = () => (
    <div className="dashboard-container">
      <h2>Regional Performance Benchmarking</h2>
      {loading ? (
        <div className="loading-indicator">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card" onClick={() => askCostQuestion("Compare costs and efficiency across our 10 different regions")}>
              <h3>Cost Comparison</h3>
              <p>Compare across 10 regions</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Identify regions with higher costs for potential workload migration")}>
              <h3>Migration Opportunities</h3>
              <p>Find cost-saving migrations</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Optimize geographical distribution of resources based on cost efficiency")}>
              <h3>Geo-Optimization</h3>
              <p>Balance global workloads</p>
            </div>
          </div>
          <div className="dashboard-info">
            <p>Click on any card to ask our AI assistant for detailed analysis</p>
          </div>
        </>
      )}
    </div>
  );

  const renderInstanceDashboard = () => (
    <div className="dashboard-container">
      <h2>Instance Type Optimization</h2>
      {loading ? (
        <div className="loading-indicator">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card" onClick={() => askCostQuestion("Analyze performance and cost ratio across our 100+ instance types")}>
              <h3>Performance Analysis</h3>
              <p>Optimize across 100+ types</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Identify which instance families provide the best value for our workloads")}>
              <h3>Value Assessment</h3>
              <p>Find best-value families</p>
            </div>
            <div className="dashboard-card" onClick={() => askCostQuestion("Recommend instance type migrations based on cost and performance metrics")}>
              <h3>Migration Recommendations</h3>
              <p>Get personalized suggestions</p>
            </div>
          </div>
          <div className="dashboard-info">
            <p>Click on any card to ask our AI assistant for detailed analysis</p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>AWS Cost Optimization Assistant</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`} 
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button 
            className={`tab-button ${activeTab === 'cost' ? 'active' : ''}`} 
            onClick={() => setActiveTab('cost')}
          >
            Cost Analysis
          </button>
          <button 
            className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`} 
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button 
            className={`tab-button ${activeTab === 'regions' ? 'active' : ''}`} 
            onClick={() => setActiveTab('regions')}
          >
            Regions
          </button>
          <button 
            className={`tab-button ${activeTab === 'instances' ? 'active' : ''}`} 
            onClick={() => setActiveTab('instances')}
          >
            Instances
          </button>
        </div>
      </div>
      
      <div className="app-content">
        {activeTab === 'chat' ? (
          <div className="chat-container">
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <p>Ask a question about your AWS cost optimization or select a dashboard to explore insights</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                  >
                    <div className="message-text">{message.text}</div>
                    
                    {message.citations && message.citations.length > 0 && (
                    <div className="citations">
                      <div className="citation-header">Sources:</div>
                      {message.citations.map((citation, idx) =>
                        citation.retrievedReferences && citation.retrievedReferences.length > 0 ? (
                          citation.retrievedReferences.map((reference, refIdx) => (
                            <div key={`${idx}-${refIdx}`} className="citation-item">
                              <a
                                href={reference.location?.s3Location?.uri || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {reference.metadata?.title || 'Source ' + (refIdx + 1)}
                              </a>
                            </div>
                          ))
                        ) : null
                      )}
                    </div>
                  )}
                  </div>
                ))
              )}
              {loading && (
                <div className="message bot-message">
                  <div className="loading-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="input-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about AWS cost optimization, resource utilization, or instance recommendations..."
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}>
                Send
              </button>
            </form>
          </div>
        ) : activeTab === 'cost' ? (
          renderCostDashboard()
        ) : activeTab === 'resources' ? (
          renderResourceDashboard()
        ) : activeTab === 'regions' ? (
          renderRegionalDashboard()
        ) : activeTab === 'instances' ? (
          renderInstanceDashboard()
        ) : null}
      </div>
    </div>
  );
}

export default App;