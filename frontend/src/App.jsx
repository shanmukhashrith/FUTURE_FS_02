import { useState, useEffect } from 'react';
import { LayoutDashboard, UserPlus, X, Activity, TrendingUp, PieChart as PieIcon, BarChart2, Trash2 } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', source: 'Website' });

  // 1. Fetch Data
  useEffect(() => {
    fetch('https://future-fs-02-4unb.onrender.com/leads')
      .then(response => response.json())
      .then(data => { setLeads(data); setLoading(false); })
      .catch(error => console.error("Error:", error));
  }, []);

  // 2. Add Lead
  const handleAddLead = async (e) => {
    e.preventDefault();
    const response = await fetch('https://future-fs-02-4unb.onrender.com/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const savedLead = await response.json();
    setLeads([...leads, savedLead]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', source: 'Website' });
  };

  // 3. Update Status
  const handleStatusChange = async (leadId, newStatus) => {
    await fetch(`https://future-fs-02-4unb.onrender.com/leads/${leadId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: newStatus } : lead));
  };

  // 4. NEW: Delete Lead
  const handleDeleteLead = async (leadId) => {
    // Show a browser confirmation popup before deleting
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    // Tell the backend to delete it from MongoDB
    await fetch(`http://localhost:5001/leads/${leadId}`, {
      method: 'DELETE',
    });

    // Remove it instantly from the React UI
    setLeads(leads.filter(lead => lead._id !== leadId));
  };

  // Analytics Math
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(0) : 0;

  // Dynamic Chart Data
  const sourceData = [
    { name: 'Website', leads: leads.filter(l => l.source === 'Website').length },
    { name: 'Referral', leads: leads.filter(l => l.source === 'Referral').length },
    { name: 'Cold Call', leads: leads.filter(l => l.source === 'Cold Call').length },
  ];

  const statusData = [
    { name: 'New', value: newLeads || 1 },
    { name: 'Contacted', value: contactedLeads || 1 },
    { name: 'Converted', value: convertedLeads || 1 },
  ];
  const PIE_COLORS = ['#94a3b8', '#eab308', '#22c55e'];

  const trendData = [
    { month: 'Jan', leads: 4 }, { month: 'Feb', leads: 7 }, { month: 'Mar', leads: 5 },
    { month: 'Apr', leads: 12 }, { month: 'May', leads: 18 }, { month: 'Jun', leads: leads.length + 20 },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white tracking-widest flex items-center gap-2 uppercase">
            CRM<span className="text-yellow-500">PRO</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 py-6">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
            <LayoutDashboard size={20} />
            <span className="font-bold tracking-wider text-sm uppercase">Dashboard</span>
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Overview</h2>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-md font-bold transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] active:scale-95 uppercase tracking-wider text-sm">
            <UserPlus size={18} /> Add Lead
          </button>
        </header>

        <div className="flex-1 overflow-auto p-8">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Leads</p>
              <p className="text-3xl font-black text-white">{totalLeads}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Contacted</p>
              <p className="text-3xl font-black text-yellow-500">{contactedLeads}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Converted</p>
              <p className="text-3xl font-black text-green-500">{convertedLeads}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Win Rate</p>
              <p className="text-3xl font-black text-blue-500">{conversionRate}%</p>
            </div>
          </div>

          {/* TOP CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-xl hover:border-slate-700 transition-all duration-300">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                <PieIcon size={18}/> Status Breakdown
              </h3>
              <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[256px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none" animationDuration={1500}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="hover:opacity-80 cursor-pointer outline-none"/>
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-6 mt-2">
                  {statusData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                      {entry.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-xl hover:border-slate-700 transition-all duration-300">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <BarChart2 size={18}/> Leads by Source
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontWeight: 'bold' }} cursor={{ fill: '#1e293b', opacity: 0.5 }} />
                    <Bar dataKey="leads" fill="#eab308" radius={[4, 4, 0, 0]} barSize={50} animationDuration={1500} className="cursor-pointer hover:opacity-80 transition-opacity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Area Graph */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-sm mb-8 group hover:-translate-y-1 hover:shadow-xl hover:border-slate-700 transition-all duration-300">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <TrendingUp size={18}/> Pipeline Growth Timeline
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#3b82f6', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }} />
                  <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorLeads)" animationDuration={2000} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2, className: "shadow-[0_0_10px_rgba(59,130,246,0.8)]" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-2 bg-slate-950/20">
               <Activity size={18} className="text-slate-400"/>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Active Pipeline</h3>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Loading database...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                    <th className="px-6 py-4 font-bold">Client Name</th>
                    <th className="px-6 py-4 font-bold">Email Address</th>
                    <th className="px-6 py-4 font-bold">Source</th>
                    <th className="px-6 py-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-white group-hover:text-yellow-500 transition-colors">{lead.name}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{lead.email}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-950/50 px-3 py-1 rounded-md text-xs border border-slate-700/50 text-slate-300 font-bold">{lead.source}</span>
                      </td>
                      <td className="px-6 py-4">
                        {/* NEW: Flex container to hold the dropdown and the delete button side-by-side */}
                        <div className="flex items-center justify-center gap-3">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold border focus:outline-none cursor-pointer tracking-widest uppercase text-center transition-all hover:brightness-125 hover:scale-105
                              ${lead.status === 'new' ? 'bg-slate-800 text-slate-300 border-slate-600' : 
                                lead.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 
                                'bg-green-500/10 text-green-500 border-green-500/30'}`}
                          >
                            <option value="new" className="bg-slate-900 text-slate-300">NEW</option>
                            <option value="contacted" className="bg-slate-900 text-yellow-500">CONTACTED</option>
                            <option value="converted" className="bg-slate-900 text-green-500">CONVERTED</option>
                          </select>
                          
                          {/* NEW: Delete Button */}
                          <button 
                            onClick={() => handleDeleteLead(lead._id)} 
                            className="text-slate-500 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-all"
                            title="Delete Lead"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* ADD LEAD MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-slate-900 p-8 rounded-lg w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserPlus size={20} className="text-yellow-500"/> Add New Lead
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)] transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)] transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Lead Source</label>
                <select value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)] transition-all uppercase text-sm">
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3.5 rounded-md mt-8 transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] active:scale-95 uppercase tracking-widest text-sm">
                Save Lead
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;