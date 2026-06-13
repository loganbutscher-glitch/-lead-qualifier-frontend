import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {
  Users, TrendingUp, Flame, Thermometer, Snowflake,
  Lightbulb, RefreshCw, ChevronDown, ChevronUp,
  Mail, Phone, Clock, Zap, BarChart3,
  Star, AlertCircle, LayoutDashboard, Menu, Sun, Moon
} from 'lucide-react'

const API = 'https://lead-qualifier-backend-production.up.railway.app'

function priorityConfig(score) {
  if (score >= 70) return {
    label: 'Hot',
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20',
    bar: '#ef4444', icon: Flame
  }
  if (score >= 40) return {
    label: 'Warm',
    color: 'text-orange-500',
    bg: 'bg-orange-50 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20',
    bar: '#f97316', icon: Thermometer
  }
  return {
    label: 'Cold',
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20',
    bar: '#3b82f6', icon: Snowflake
  }
}

function Sidebar({ tab, setTab, sidebarOpen, setSidebarOpen }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'leads', label: 'Leads', icon: Users },
    { key: 'improvements', label: 'AI Insights', icon: Lightbulb },
  ]
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-ink/20 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-surface border-r border-divider z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-divider">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-ink text-sm leading-none">PropelForge</p>
              <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-0.5">Lead Intel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {items.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => { setTab(key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                ${tab === key ? 'bg-primary/10 text-primary' : 'text-muted hover:text-ink hover:bg-ink/5'}`}>
              <Icon className="h-4 w-4 shrink-0" />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-divider">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">API Connected</span>
          </div>
        </div>
      </aside>
    </>
  )
}

function ScoreRing({ score }) {
  const cfg = priorityConfig(score)
  const r = 18; const circ = 2 * Math.PI * r; const dash = (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center h-12 w-12 shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgb(var(--color-divider))" strokeWidth="3" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={cfg.bar} strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className={`font-mono font-bold text-xs ${cfg.color}`}>{score}</span>
    </div>
  )
}

function StatCard({ label, value, sub, icon: Icon, iconClass, darkIconClass, index }) {
  const ref = useRef(null)
  useEffect(() => {
    gsap.fromTo(ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.05 * index, ease: 'power3.out' })
  }, [])
  return (
    <div ref={ref} className="bg-surface border border-divider rounded-2xl p-5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <TrendingUp className="h-3.5 w-3.5 text-muted/30" />
      </div>
      <p className="font-display font-extrabold text-2xl text-ink">{value ?? '—'}</p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">{label}</p>
      {sub && <p className="text-xs text-muted/50 mt-0.5">{sub}</p>}
    </div>
  )
}

function LeadCard({ lead, index }) {
  const [open, setOpen] = useState(false)
  const cfg = priorityConfig(lead.score)
  const Icon = cfg.icon
  const ref = useRef(null)
  useEffect(() => {
    gsap.fromTo(ref.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: index * 0.05, ease: 'power2.out' })
  }, [])
  const date = new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div ref={ref} className={`bg-surface border rounded-2xl overflow-hidden card-hover transition-all duration-200 ${open ? 'border-primary/30' : 'border-divider'}`}>
      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <ScoreRing score={lead.score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-ink text-sm">{lead.name}</p>
            <span className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${cfg.bg} ${cfg.color}`}>
              <Icon className="h-2 w-2" />{cfg.label}
            </span>
          </div>
          <p className="text-xs text-muted truncate">{lead.email}{lead.company ? ` · ${lead.company}` : ''}</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="h-1 w-16 bg-ink/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${lead.score}%`, backgroundColor: cfg.bar }} />
          </div>
          <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all ${open ? 'bg-primary/10 text-primary' : 'bg-ink/5 text-muted'}`}>
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-divider">
          <div className="px-4 py-3 bg-primary/5 flex items-start gap-3 border-b border-divider">
            <Zap className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-ink/70 leading-relaxed">{lead.summary}</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors">
                  <Phone className="h-3 w-3" />{lead.phone}
                </a>
              )}
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors">
                <Mail className="h-3 w-3" />{lead.email}
              </a>
            </div>
            {lead.answers && (
              <div className="grid sm:grid-cols-2 gap-2">
                {Object.entries(lead.answers).map(([q, a]) => (
                  <div key={q} className="bg-ink/5 rounded-xl p-3 border border-divider">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">{q}</p>
                    <p className="text-xs text-ink/70 leading-snug">{a}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[10px] text-muted/50">
              <Clock className="h-3 w-3" />{date}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DashboardView({ leads, stats, isDark }) {
  const pieData = [
    { name: 'Hot', value: Number(stats?.hot_leads || 0), color: '#ef4444' },
    { name: 'Warm', value: Number(stats?.warm_leads || 0), color: '#f97316' },
    { name: 'Cold', value: Number(stats?.cold_leads || 0), color: '#3b82f6' },
  ].filter(d => d.value > 0)

  const areaData = leads.slice().reverse().slice(-10).map((l, i) => ({ name: `#${i + 1}`, score: l.score }))
  const tickColor = isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8'
  const tooltipBg = isDark ? '#16161A' : '#ffffff'
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : '#E4E8EF'

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface border border-divider rounded-2xl p-6 card-hover">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-0.5">Score Trend</p>
          <p className="font-display font-bold text-ink mb-5">Last 10 Leads</p>
          {areaData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.3 : 0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: tickColor, fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} labelStyle={{ color: tickColor }} itemStyle={{ color: '#3b82f6' }} />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted text-sm">Need more leads for chart</div>
          )}
        </div>

        <div className="bg-surface border border-divider rounded-2xl p-6 card-hover">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-0.5">Breakdown</p>
          <p className="font-display font-bold text-ink mb-4">Lead Quality</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{d.name}</span>
                    </div>
                    <span className="font-mono text-xs text-ink font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted text-sm">No data yet</div>
          )}
        </div>
      </div>

      <div className="bg-surface border border-divider rounded-2xl p-6 card-hover">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-0.5">Recent Activity</p>
        <p className="font-display font-bold text-ink mb-4">Latest Leads</p>
        <div className="space-y-1">
          {leads.slice(0, 5).map((lead) => {
            const cfg = priorityConfig(lead.score)
            const Icon = cfg.icon
            return (
              <div key={lead.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink/5 transition-colors">
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{lead.name}</p>
                  <p className="text-xs text-muted truncate">{lead.email}</p>
                </div>
                <span className="font-mono text-sm font-bold shrink-0" style={{ color: cfg.bar }}>
                  {lead.score}<span className="text-muted/40 font-normal text-xs">/100</span>
                </span>
              </div>
            )
          })}
          {leads.length === 0 && <div className="text-center py-8 text-muted text-sm">No leads yet</div>}
        </div>
      </div>
    </div>
  )
}

function ImprovementsPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const load = async () => {
    setLoading(true)
    try { setData(await fetch(`${API}/api/improvements`).then(r => r.json())) } catch { }
    setLoading(false)
  }
  const catStyle = {
    questions: 'bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400',
    timing: 'bg-cyan-50 border-cyan-200 text-cyan-600 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:text-cyan-400',
    targeting: 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
    messaging: 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
  }
  const impactDot = { high: 'bg-red-400', medium: 'bg-orange-400', low: 'bg-blue-400' }

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-divider rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-ink">AI Improvement Engine</h2>
            <p className="text-sm text-muted">Pattern analysis across all your lead data</p>
          </div>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 bg-primary text-white text-sm px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md shadow-primary/20 disabled:opacity-50">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {!data && (
        <div className="bg-surface border border-divider rounded-2xl p-20 text-center">
          <BarChart3 className="h-10 w-10 text-muted/20 mx-auto mb-3" />
          <p className="text-muted text-sm">Click "Run Analysis" to generate AI-powered suggestions</p>
        </div>
      )}
      {data?.message && (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center">
          <AlertCircle className="h-8 w-8 text-muted/30 mx-auto mb-3" />
          <p className="text-muted text-sm">{data.message}</p>
        </div>
      )}
      {data?.suggestions?.map((s, i) => (
        <div key={i} className="bg-surface border border-divider rounded-2xl p-5 card-hover">
          <div className="flex items-start gap-4">
            <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${impactDot[s.impact] || 'bg-muted/30'}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${catStyle[s.category] || 'bg-ink/5 border-divider text-muted'}`}>{s.category}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50">{s.impact} impact</span>
              </div>
              <p className="text-sm text-ink/70 leading-relaxed">{s.suggestion}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const loadData = async () => {
    try {
      const [l, s] = await Promise.all([
        fetch(`${API}/api/leads`).then(r => r.json()),
        fetch(`${API}/api/stats`).then(r => r.json()),
      ])
      setLeads(l); setStats(s)
    } catch { }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const convRate = stats?.total > 0 ? Math.round((stats.hot_leads / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar tab={tab} setTab={setTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-60 min-w-0">
        <header className="sticky top-0 z-10 border-b border-divider bg-surface/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-muted hover:text-ink" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-ink capitalize">
                {tab === 'dashboard' ? 'Overview' : tab === 'improvements' ? 'AI Insights' : 'All Leads'}
              </h1>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest">
                {stats?.total ?? 0} leads · avg score {stats?.avg_score ?? 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(d => !d)}
              className="h-8 w-8 rounded-lg bg-ink/5 hover:bg-ink/10 flex items-center justify-center text-muted hover:text-ink transition-all"
              title="Toggle dark mode"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={loadData} className="h-8 w-8 rounded-lg bg-ink/5 hover:bg-ink/10 flex items-center justify-center text-muted hover:text-ink transition-all">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="p-6 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard index={0} label="Total Leads" value={stats?.total ?? 0} icon={Users} iconClass="bg-blue-50 dark:bg-primary/10 text-primary" />
            <StatCard index={1} label="Avg Score" value={stats?.avg_score ?? 0} sub="/ 100" icon={TrendingUp} iconClass="bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500" />
            <StatCard index={2} label="Hot Leads" value={stats?.hot_leads ?? 0} sub="score 70+" icon={Flame} iconClass="bg-red-50 dark:bg-red-500/10 text-red-500" />
            <StatCard index={3} label="Conversion" value={`${convRate}%`} sub="hot / total" icon={Star} iconClass="bg-violet-50 dark:bg-violet-500/10 text-violet-500" />
          </div>

          {tab === 'dashboard' && <DashboardView leads={leads} stats={stats} isDark={isDark} />}

          {tab === 'leads' && (
            <div className="space-y-3">
              {loading && [...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface border border-divider rounded-2xl p-4 animate-pulse flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-ink/5" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-ink/5 rounded w-32" />
                    <div className="h-2.5 bg-ink/5 rounded w-48" />
                  </div>
                </div>
              ))}
              {!loading && leads.length === 0 && (
                <div className="bg-surface border border-divider rounded-2xl p-20 text-center">
                  <Users className="h-10 w-10 text-muted/20 mx-auto mb-3" />
                  <p className="text-muted text-sm">No leads yet</p>
                </div>
              )}
              {leads.map((lead, i) => <LeadCard key={lead.id} lead={lead} index={i} />)}
            </div>
          )}

          {tab === 'improvements' && <ImprovementsPanel />}
        </main>
      </div>
    </div>
  )
}
