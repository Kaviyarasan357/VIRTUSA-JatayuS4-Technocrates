/*import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const NegativeLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/negative-logs');
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      setLogs(data);
      applyFilter(data, filter);
    } catch (err) {
      console.error('❌ Error fetching logs:', err);
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data, range) => {
    if (range === 'all') return setFilteredLogs(data);

    const now = new Date();
    let cutoff;

    switch (range) {
      case '1d':
        cutoff = new Date(now.setDate(now.getDate() - 1));
        break;
      case '1w':
        cutoff = new Date(now.setDate(now.getDate() - 7));
        break;
      case '1m':
        cutoff = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        cutoff = null;
    }

    const filtered = data.filter(log => new Date(log.timestamp) >= cutoff);
    setFilteredLogs(filtered);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    applyFilter(logs, value);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        <span style={{ color: 'red', fontSize: '24px' }}>🔴</span> Parental Dashboard-Negative Browsing Logs
      </h2>

      <div className="controls">
        <button className="refresh-button" onClick={fetchLogs}>
          🔄 Refresh Logs
        </button>

        <select className="filter-dropdown" value={filter} onChange={handleFilterChange}>
          <option value="all">Show All</option>
          <option value="1d">Last 1 Day</option>
          <option value="1w">Last 1 Week</option>
          <option value="1m">Last 1 Month</option>
        </select>
      </div>

      {loading ? (
        <p className="status-message">⏳ Loading...</p>
      ) : error ? (
        <p className="status-message error">{error}</p>
      ) : (
        <table className="log-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>URL</th>
              <th>Sentiment</th>
              <th>Score</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td>{log.title}</td>
                  <td>
                    <a href={log.url} target="_blank" rel="noopener noreferrer">
                      {log.url}
                    </a>
                  </td>
                  <td>{log.sentiment}</td>
                  <td>{log.score.toFixed(2)}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="status-message">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NegativeLogs;






*/


import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import LogsChart from './LogsChart';


const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('home');



  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/negative-logs`);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      setLogs(data);
      applyFilter(data, filter);
    } catch (err) {
      console.error('❌ Error fetching logs:', err);
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };


  const applyFilter = (data, range) => {
    if (range === 'all') return setFilteredLogs(data);
    const now = new Date();
    let cutoff;

    switch (range) {
      case '1d':
        cutoff = new Date(now.setDate(now.getDate() - 1));
        break;
      case '1w':
        cutoff = new Date(now.setDate(now.getDate() - 7));
        break;
      case '1m':
        cutoff = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        cutoff = null;
    }

    const filtered = data.filter(log => new Date(log.timestamp) >= cutoff);
    setFilteredLogs(filtered);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    applyFilter(logs, value);
  };

  const getFilteredLogs = () => {
    if (activeSection === 'positive') return filteredLogs.filter(log => log.sentiment === 'positive');
    if (activeSection === 'neutral') return filteredLogs.filter(log => log.sentiment === 'neutral');
    if (activeSection === 'negative') return filteredLogs.filter(log => log.sentiment === 'negative');
    return filteredLogs;
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="logo">🧠 MindGuard</div>
        <ul className="nav-links">
          <li onClick={() => setActiveSection('home')}>Home</li>
          <li onClick={() => setActiveSection('alerts')}>Email Alerts Sent</li>
          <li onClick={() => setActiveSection('positive')}>Positive Search</li>
          <li onClick={() => setActiveSection('negative')}>Negative Search</li>
          <li onClick={() => setActiveSection('neutral')}>Neutral Search</li>
          <li onClick={() => setActiveSection('charts')}>Chart View</li>
        </ul>
      </nav>

      <div className="dashboard-container">
        {activeSection === 'home' && (
          <div>
            <h2><b>Welcome to MindGuard Parental Dashboard-A Silent Monitoring System</b></h2>
            <p><strong>Choose a section to view logs or insights.</strong></p>
    
            <p>MindGuard is a smart parental monitoring tool designed to help parents keep track of their children's online activities with the help of artificial intelligence. This system monitors websites visited by children, analyzes the sentiment of the content, and categorizes it as Positive, Negative, or Neutral.</p>
            <p>🔍 It provides a clear breakdown of internet usage behavior with details like sentiment score and timestamps. 📊 Visualizations through interactive charts help in understanding trends and behaviors over time. 📧 Email alerts are automatically sent when negative or potentially harmful content is detected, allowing parents to intervene when needed.</p>
            <p>This tool is built to ensure transparency, awareness, and safety, enabling guardians to foster a healthier digital environment at home. Use the navigation bar to explore insights and logs.</p>
          </div>
  
        )}

        {activeSection === 'alerts' && (
          <div>
            <h2>📧 Email Alerts Sent</h2>
            <p>
      The Email Alerts module keeps a comprehensive log of alerts triggered by our sentiment analysis engine. Whenever the system identifies online content that carries a high risk of negative sentiment—such as cyberbullying, self-harm references, violent behavior, or other harmful material—it automatically sends a real-time email notification to the registered parent or guardian.
    </p>
    <p>
      These alerts are crucial for ensuring immediate awareness and timely intervention. Each alert typically includes details such as the page title, URL, type of sentiment detected, sentiment score, and timestamp of the activity. This enables a thorough understanding of what content was flagged and when.
    </p>
    <p>
      Although alert logs will be displayed here soon, the system already supports backend tracking for future integration. Stay tuned for upcoming features such as alert filtering, export options, and integration with mobile push notifications.
    </p>
    
          </div>
        )}

        {['positive', 'negative', 'neutral'].includes(activeSection) && (
          <>
            <h2 className="dashboard-title">
              {activeSection === 'positive' && '🟢 Positive Browsing Logs'}
              {activeSection === 'negative' && '🔴 Negative Browsing Logs'}
              {activeSection === 'neutral' && '🟡 Neutral Browsing Logs'}
            </h2>


            <div className="controls">
              <button className="refresh-button" onClick={fetchLogs}>🔄 Refresh Logs</button>
              <select className="filter-dropdown" value={filter} onChange={handleFilterChange}>
                <option value="all">Show All</option>
                <option value="1d">Last 1 Day</option>
                <option value="1w">Last 1 Week</option>
                <option value="1m">Last 1 Month</option>
              </select>
            </div>

            {loading ? (
              <p className="status-message">⏳ Loading...</p>
            ) : error ? (
              <p className="status-message error">{error}</p>
            ) : (
              <table className="log-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>URL</th>
                    <th>Sentiment</th>
                    <th>Score</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLogs().length > 0 ? (
                    getFilteredLogs().map((log) => (
                      <tr key={log._id}>
                        <td>{log.title}</td>
                        <td><a href={log.url} target="_blank" rel="noopener noreferrer">{log.url}</a></td>
                        <td>{log.sentiment}</td>
                        <td>{log.score.toFixed(2)}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="status-message">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeSection === 'charts' && (
          <div>
            <h2>📊 Chart Visualization</h2>
            <LogsChart logs={filteredLogs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

