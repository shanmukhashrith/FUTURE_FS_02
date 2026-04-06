import { useState, useEffect } from 'react';
import { Crosshair, ShieldAlert, Zap, LayoutDashboard, UserPlus, X, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', source: 'Website' });

  useEffect(() => {
    fetch('http://localhost:5001/leads')
      .then(response => response.json())
      .then(data => { setLeads(data); setLoading(false); })
      .catch(error => console.error("Error:", error));
  }, []);

  const handleAddLead = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5001/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const savedLead = await response.json();
    setLeads([...leads, savedLead]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', source: 'Website' });
  };

  const handleStatusChange = async (leadId, newStatus) => {
    await fetch(`http://localhost:5001/leads/${leadId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: newStatus } : lead));
  };

  const totalLeads = leads.length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(0) : 0;

  const sourceData = [
    { name: 'Website', value: leads.filter(l => l.source === 'Website').length || 1 },
    { name: 'Referral', value: leads.filter(l => l.source === 'Referral').length || 1 },
    { name: 'Cold Call', value: leads.filter(l => l.source === 'Cold Call').length || 1 },
  ];
  const CHART_COLORS = ['#FFD700', '#4A4A4A', '#888888']; 

  const trendData = [
    { month: 'Jan', leads: 4 }, { month: 'Feb', leads: 7 }, { month: 'Mar', leads: 5 },
    { month: 'Apr', leads: 12 }, { month: 'May', leads: 18 }, { month: 'Jun', leads: leads.length + 20 },
  ];

  const getStatusColor = (status) => {
    if (status === 'new') return 'text-gray-400 bg-gotham-gray border-gray-600';
    if (status === 'contacted') return 'text-bat-yellow bg-bat-yellow/10 border-bat-yellow/40 shadow-[0_0_15px_rgba(255,215,0,0.4)]';
    if (status === 'converted') return 'text-green-400 bg-green-500/10 border-green-500/40 shadow-[0_0_15px_rgba(74,222,128,0.4)]';
    return 'text-gray-400 bg-gotham-gray border-gray-600';
  };

  return (
    <div className="flex h-screen bg-gotham-black text-gray-200 font-sans selection:bg-bat-yellow selection:text-black relative overflow-hidden">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-bat-yellow opacity-[0.04] blur-[120px] pointer-events-none animate-pulse-glow"></div>

      {/* SIDEBAR */}
      <aside className="w-64 bg-gotham-dark border-r border-gotham-border flex flex-col z-10 shadow-2xl relative">
        <div className="p-8 border-b border-gotham-border/50">
          <h1 className="text-2xl font-black text-white tracking-widest flex items-center gap-3 uppercase opacity-0 animate-fade-in-up">
            <Zap className="text-bat-yellow" size={28} />
            Wayne<span className="text-gray-500">Tech</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6 opacity-0 animate-fade-in-up" style={{animationDelay: '100ms'}}>
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-bat-yellow/10 text-bat-yellow rounded-lg border border-bat-yellow/20 shadow-[0_0_15px_rgba(255,215,0,0.05)] transition-all duration-300 hover:bg-bat-yellow/20 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:scale-[1.02] group">
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform duration-300"/>
            <span className="font-bold tracking-wider uppercase text-sm">Command Center</span>
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden z-10 relative">
        
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-10 border-b border-gotham-border bg-gotham-dark/80 backdrop-blur-xl opacity-0 animate-fade-in-up">
          <div>
            <h2 className="text-2xl font-bold tracking-wide text-white uppercase">Network Surveillance</h2>
            <p className="text-gray-500 text-sm mt-1 tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-bat-yellow animate-pulse-glow shadow-[0_0_8px_rgba(255,215,0,0.8)]"></span>
              System Online • Monitoring Leads
            </p>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="group flex items-center gap-2 bg-gotham-black hover:bg-bat-yellow text-bat-yellow hover:text-black px-6 py-3 rounded-md font-bold transition-all duration-300 border border-bat-yellow shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:-translate-y-1 active:scale-95 uppercase tracking-wider text-sm">
            <UserPlus size={18} className="group-hover:rotate-12 transition-transform duration-300"/> Add Target
          </button>
        </header>

        <div className="flex-1 overflow-auto px-10 pb-10">
          
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-8">
            {[
              { title: "Total Targets", value: totalLeads, icon: <Crosshair size={20} className="text-gray-500" /> },
              { title: "Interrogated", value: contactedLeads, icon: <Activity size={20} className="text-bat-yellow" /> },
              { title: "Secured", value: convertedLeads, icon: <ShieldAlert size={20} className="text-green-500" /> },
              { title: "Success Rate", value: `${conversionRate}%`, icon: <Zap size={20} className="text-bat-yellow animate-pulse-glow" /> }
            ].map((stat, i) => (
              <div key={i} className="opacity-0 animate-fade-in-up bg-gotham-gray p-6 rounded-lg border border-gotham-border relative overflow-hidden group hover:border-bat-yellow/50 transition-all duration-500 shadow-lg hover:shadow-[0_20px_40px_rgba(255,215,0,0.1)] hover:-translate-y-2 cursor-default" style={{animationDelay: `${(i + 1) * 100}ms`}}>
                <div className="absolute top-0 left-0 w-1 h-full bg-bat-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(255,215,0,1)]"></div>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest group-hover:text-gray-300 transition-colors">{stat.title}</p>
                  <div className="group-hover:scale-125 group-hover:text-bat-yellow transition-all duration-500">{stat.icon}</div>
                </div>
                <p className="text-4xl font-black text-white tracking-tighter drop-shadow-md">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 opacity-0 animate-fade-in-up" style={{animationDelay: '500ms'}}>
            <div className="lg:col-span-2 bg-gotham-gray p-6 rounded-lg border border-gotham-border shadow-lg hover:border-gotham-border/80 transition-all duration-500 hover:shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                Pipeline Trajectory
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                    <XAxis dataKey="month" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B0B0B', borderColor: '#FFD700', borderRadius: '4px', color: '#fff', boxShadow: '0 0 20px rgba(255,215,0,0.2)' }} />
                    <Area type="monotone" dataKey="leads" stroke="#FFD700" strokeWidth={4} fillOpacity={1} fill="url(#colorYellow)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gotham-gray p-6 rounded-lg border border-gotham-border shadow-lg flex flex-col hover:border-gotham-border/80 transition-all duration-500 hover:shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
                Signal Origins
              </h3>
              <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[256px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none" animationDuration={2000}>
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="hover:opacity-80 hover:scale-105 transition-all cursor-pointer origin-center"/>
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0B0B0B', borderColor: '#2A2A2A', borderRadius: '4px' }} itemStyle={{ color: '#fff' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="opacity-0 animate-fade-in-up bg-gotham-gray rounded-lg border border-gotham-border shadow-lg overflow-hidden mb-10" style={{animationDelay: '600ms'}}>
            <div className="px-8 py-5 border-b border-gotham-border bg-gotham-dark flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                Active Profiles
              </h3>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-bat-yellow animate-pulse-glow font-bold tracking-widest uppercase">Scanning Database...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-gotham-border bg-[#0B0B0B]">
                    <th className="px-8 py-4 font-bold">Alias</th>
                    <th className="px-8 py-4 font-bold">Comm Link</th>
                    <th className="px-8 py-4 font-bold">Vector</th>
                    <th className="px-8 py-4 font-bold text-center">Protocol Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-gotham-border hover:bg-[#151515] transition-colors duration-300 group">
                      <td className="px-8 py-5">
                        <span className="font-bold text-white tracking-wide group-hover:text-bat-yellow group-hover:translate-x-2 transition-all duration-300 inline-block">{lead.name}</span>
                      </td>
                      <td className="px-8 py-5 text-gray-400 font-mono text-sm group-hover:text-gray-300 transition-colors">{lead.email}</td>
                      <td className="px-8 py-5">
                        <span className="text-gray-500 uppercase tracking-widest text-xs font-bold bg-black/50 px-2 py-1 rounded border border-white/5">{lead.source}</span>
                      </td>
                      <td className="px-8 py-5 flex justify-center">
                        <select 
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`px-4 py-1.5 rounded-md text-xs font-black border focus:outline-none cursor-pointer tracking-widest uppercase transition-all duration-300 hover:scale-110 hover:brightness-125 ${getStatusColor(lead.status)} appearance-none text-center outline-none`}
                        >
                          <option value="new" className="bg-gotham-black text-gray-400">NEW</option>
                          <option value="contacted" className="bg-gotham-black text-bat-yellow">CONTACTED</option>
                          <option value="converted" className="bg-gotham-black text-green-400">CONVERTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* MODAL - Aggressive Zoom Entrance */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-gotham-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="opacity-0 animate-zoom-in bg-gotham-gray p-8 rounded-lg w-full max-w-md border border-bat-yellow/40 shadow-[0_0_60px_rgba(255,215,0,0.15)]">
            <div className="flex justify-between items-center mb-8 border-b border-gotham-border pb-4">
              <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Crosshair size={20} className="text-bat-yellow"/> Acquire Target
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-bat-yellow hover:rotate-90 hover:scale-110 transition-all duration-300"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-bat-yellow group-focus-within:translate-x-1 transition-all duration-300">Subject Alias</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gotham-dark border border-gotham-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-bat-yellow focus:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all placeholder:text-gray-700 font-mono text-sm hover:border-gray-500" placeholder="Oswald Cobblepot" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-bat-yellow group-focus-within:translate-x-1 transition-all duration-300">Encrypted Comms</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gotham-dark border border-gotham-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-bat-yellow focus:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all placeholder:text-gray-700 font-mono text-sm hover:border-gray-500" placeholder="oswald@iceberg.lounge" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-bat-yellow group-focus-within:translate-x-1 transition-all duration-300">Approach Vector</label>
                <select value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full bg-gotham-dark border border-gotham-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-bat-yellow focus:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all font-mono text-sm uppercase hover:border-gray-500">
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-bat-yellow hover:bg-yellow-400 text-black font-black py-4 rounded-md mt-6 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7)] hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm">
                Execute Addition
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;