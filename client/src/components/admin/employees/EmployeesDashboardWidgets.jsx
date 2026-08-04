import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function EmployeesDashboardWidgets({ stats }) {
  // Mock data for charts as requested
  const deptData = [
    { name: 'Engineering', value: 45 },
    { name: 'Sales', value: 25 },
    { name: 'Marketing', value: 15 },
    { name: 'HR', value: 5 },
    { name: 'Finance', value: 10 },
  ];
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const growthData = [
    { month: 'Jan', employees: 80 },
    { month: 'Feb', employees: 85 },
    { month: 'Mar', employees: 90 },
    { month: 'Apr', employees: 105 },
    { month: 'May', employees: 110 },
    { month: 'Jun', employees: 125 },
  ];

  const statCardStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Employees Overview</h2>
      
      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={statCardStyle}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Total Employees</span>
          <span style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{stats?.totalEmployees || 125}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Active</span>
          <span style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>{stats?.activeEmployees || 118}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>On Leave</span>
          <span style={{ fontSize: '28px', fontWeight: '800', color: '#f59e0b' }}>4</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>New Joiners (This Month)</span>
          <span style={{ fontSize: '28px', fontWeight: '800', color: '#6366f1' }}>7</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>Department Distribution</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>Employee Growth (YTD)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="employees" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
