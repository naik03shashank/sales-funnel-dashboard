import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, Target, Trophy, TrendingUp, MapPin, Calendar,
  ChevronDown, LayoutDashboard, Database, PieChart as ChartIcon, Settings
} from 'lucide-react';
import { RAW_DATA } from './data';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [regionFilter, setRegionFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');

  // Filtered Data
  const filteredData = useMemo(() => {
    return RAW_DATA.filter(item => {
      const regionMatch = regionFilter === 'All' || item.region === regionFilter;
      return regionMatch;
    });
  }, [regionFilter]);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalLeads = filteredData.length;
    const opportunities = filteredData.filter(item => item.status === 'Opportunity' || item.status === 'Win' || (item.status === 'Lost' && item.oppDate)).length;
    const wins = filteredData.filter(item => item.status === 'Win').length;
    const revenue = filteredData.reduce((acc, curr) => curr.status === 'Win' ? acc + curr.value : acc, 0);

    const leadToOpp = totalLeads ? (opportunities / totalLeads * 100).toFixed(1) : 0;
    const oppToWin = opportunities ? (wins / opportunities * 100).toFixed(1) : 0;

    return { totalLeads, opportunities, wins, revenue, leadToOpp, oppToWin };
  }, [filteredData]);

  // Regional Data for Analytics
  const regionalData = useMemo(() => {
    const regions = {};
    filteredData.forEach(item => {
      if (!regions[item.region]) regions[item.region] = { name: item.region, leads: 0, wins: 0, revenue: 0 };
      regions[item.region].leads += 1;
      if (item.status === 'Win') {
        regions[item.region].wins += 1;
        regions[item.region].revenue += item.value;
      }
    });
    return Object.values(regions);
  }, [filteredData]);

  // Trend Data (Monthly)
  const trendData = useMemo(() => {
    const months = {};
    filteredData.forEach(item => {
      const month = item.leadDate.slice(0, 7); // YYYY-MM
      if (!months[month]) months[month] = { month, leads: 0, wins: 0, revenue: 0 };
      months[month].leads += 1;
      if (item.status === 'Win') {
        months[month].wins += 1;
        months[month].revenue += item.value;
      }
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredData]);

  // Funnel Data
  const funnelData = [
    { name: 'Leads', value: stats.totalLeads, color: '#3b82f6' },
    { name: 'Opportunities', value: stats.opportunities, color: '#6366f1' },
    { name: 'Wins', value: stats.wins, color: '#10b981' }
  ];

  // CSV Export Logic
  const handleExportCSV = () => {
    const headers = ['Lead Name', 'Region', 'Status', 'Lead Date', 'Opportunity Date', 'Win Date', 'Deal Value'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        `"${item.name}"`,
        `"${item.region}"`,
        `"${item.status}"`,
        item.leadDate || '',
        item.oppDate || '',
        item.winDate || '',
        item.value
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Database size={24} />
          <span>SalesFlow BI</span>
        </div>

        <nav>
          <div
            className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('Dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'Analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('Analytics')}
          >
            <ChartIcon size={20} />
            <span>Analytics</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'Leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('Leads')}
          >
            <Users size={20} />
            <span>Leads</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('Settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="title-group">
            <h1>{activeTab === 'Dashboard' ? 'Sales Funnel Conversion' : 'Revenue Analytics'}</h1>
            <p>{activeTab === 'Dashboard' ? 'Intelligence Platform • Live Updates' : 'Detailed performance tracking by Region'}</p>
          </div>

          <div className="controls">
            <div className="slicer-group">
              <MapPin size={16} style={{ marginRight: '8px', color: 'var(--text-muted)' }} />
              <select
                className="slicer"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="All">All Regions</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
              </select>
            </div>
          </div>
        </header>

        {activeTab === 'Dashboard' ? (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">TOTAL LEADS</span>
                  <Users size={20} color="var(--primary)" />
                </div>
                <div className="stat-value">{stats.totalLeads}</div>
                <div className="stat-change up">
                  <TrendingUp size={12} />
                  <span>+12.5% vs Prev</span>
                </div>
              </div>

              <div className="stat-card" style={{ borderColor: 'var(--secondary)' }}>
                <div className="stat-header">
                  <span className="stat-label">OPPORTUNITIES</span>
                  <Target size={20} color="var(--secondary)" />
                </div>
                <div className="stat-value">{stats.opportunities}</div>
                <div className="stat-change up">
                  <TrendingUp size={12} />
                  <span>{stats.leadToOpp}% Conv. Rate</span>
                </div>
              </div>

              <div className="stat-card" style={{ borderColor: 'var(--success)' }}>
                <div className="stat-header">
                  <span className="stat-label">WINS (CLOSED)</span>
                  <Trophy size={20} color="var(--success)" />
                </div>
                <div className="stat-value">{stats.wins}</div>
                <div className="stat-change up">
                  <TrendingUp size={12} />
                  <span>{stats.oppToWin}% Win Rate</span>
                </div>
              </div>

              <div className="stat-card" style={{ borderColor: 'var(--accent)' }}>
                <div className="stat-header">
                  <span className="stat-label">TOTAL REVENUE</span>
                  <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>$</div>
                </div>
                <div className="stat-value">${stats.revenue.toLocaleString()}</div>
                <div className="stat-change">
                  <span>Avg Deal: ${(stats.revenue / (stats.wins || 1)).toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              {/* Funnel Visualization */}
              <div className="card">
                <div className="card-title">
                  Conversion Funnel
                  <span className="conversion-tag">Full Pipeline</span>
                </div>
                <div className="funnel-container">
                  {funnelData.map((stage, idx) => (
                    <div key={idx} className="funnel-stage">
                      <div className="funnel-label">{stage.name}</div>
                      <div
                        className="funnel-bar"
                        style={{
                          width: `${(stage.value / funnelData[0].value) * 100}%`,
                          backgroundColor: stage.color,
                          opacity: 0.8 + (idx * 0.1)
                        }}
                      >
                        <span className="funnel-count">{stage.value}</span>
                      </div>
                      {idx > 0 && (
                        <div className="conversion-tag">
                          {((stage.value / funnelData[idx - 1].value) * 100).toFixed(0)}% step
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="card">
                <div className="card-title">Revenue & Leads Trend</div>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorLeads)"
                      />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis hide />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Lead Table */}
            <div className="card">
              <div className="card-title">Recent Lead Activity</div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Region</th>
                      <th>Status</th>
                      <th>Value</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 5).map(item => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: '600' }}>{item.name}</td>
                        <td>{item.region}</td>
                        <td>
                          <span className={`status-pill status-${item.status.toLowerCase().slice(0, 4)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>${item.value.toLocaleString()}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{item.leadDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'Analytics' ? (
          <div className="analytics-view" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="charts-grid">
              <div className="card">
                <div className="card-title">Leads by Region</div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={regionalData}
                        dataKey="leads"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div className="card-title">Revenue Contribution by Region</div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={regionalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="card-title">Performance Metrics Details</div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Total Leads</th>
                      <th>Total Wins</th>
                      <th>Conversion Rate</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: '600' }}>{row.name}</td>
                        <td>{row.leads}</td>
                        <td>{row.wins}</td>
                        <td>{((row.wins / (row.leads || 1)) * 100).toFixed(1)}%</td>
                        <td>${row.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'Leads' ? (
          <div className="leads-view" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="card">
              <div className="card-title">
                Master Lead Database
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span className="conversion-tag">{filteredData.length} records</span>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Lead Name</th>
                      <th>Region</th>
                      <th>Status</th>
                      <th>Lead Date</th>
                      <th>Opportunity Date</th>
                      <th>Win Date</th>
                      <th>Deal Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map(item => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: '600' }}>{item.name}</td>
                        <td>{item.region}</td>
                        <td>
                          <span className={`status-pill status-${item.status.toLowerCase().slice(0, 4)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{item.leadDate || '-'}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{item.oppDate || '-'}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{item.winDate || '-'}</td>
                        <td style={{ fontWeight: '600' }}>${item.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="settings-view" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="charts-grid">
              <div className="card">
                <div className="card-title">User Preferences</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="setting-row">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Display Language</label>
                    <select className="slicer" style={{ width: '100%' }}>
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="setting-row">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Currency Format</label>
                    <select className="slicer" style={{ width: '100%' }}>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-title">System Status</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                    <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>MySQL Database Connected</span>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                    <span style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>Sync Service Active (Every 5m)</span>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>DATABASE URI</label>
                    <div className="glass-effect" style={{ padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                      mysql://admin:****@localhost:3306/sales_bi_db
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="card-title">Data Management</div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Export your sales data or clear local cache to refresh intelligence models.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleExportCSV}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Export CSV
                </button>
                <button style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>Clear Cache</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
