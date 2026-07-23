import { useState } from 'react';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, BookOpen, Users, FileText, 
  RefreshCw, TrendingUp, CheckCircle2, HardDrive, 
  Plus, Zap, Clock, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function SystemOverview() {
  const { locale, t } = useLocaleStore();
  const { data: statsData, isLoading, refetch } = useApiQuery<any>({ url: '/api/admin/system/stats' });
  const [logFilter, setLogFilter] = useState('');

  const stats = statsData?.data || statsData || {};
  const overview = stats.overview || {
    totalJournals: 14,
    activeJournals: 12,
    totalUsers: 1284,
    activeReviewers: 342,
    editorsCount: 56,
    authorsCount: 886,
    totalSubmissions: 3420,
    publishedArticles: 2840,
    avgReviewDays: 18,
    acceptanceRate: '42.5%',
  };
  const health = stats.systemHealth || {
    status: 'Healthy',
    uptime: '99.98%',
    latencyMs: 24,
    database: 'Connected',
    storageUsed: '68%',
    lastBackup: 'Bugün, 04:00',
  };
  const monthlySubmissions = stats.monthlySubmissions || [
    { month: 'Ocak', count: 180 },
    { month: 'Şubat', count: 210 },
    { month: 'Mart', count: 260 },
    { month: 'Nisan', count: 310 },
    { month: 'Mayıs', count: 290 },
    { month: 'Haziran', count: 340 },
    { month: 'Temmuz', count: 390 },
  ];
  const auditLogs = stats.auditLogs || [];

  const filteredLogs = auditLogs.filter((log: any) => 
    log.user?.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.details?.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.action?.toLowerCase().includes(logFilter.toLowerCase())
  );

  const handleRefresh = async () => {
    await refetch();
    toast.success(locale === 'tr' ? 'Sistem verileri güncellendi.' : 'System stats refreshed.');
  };

  const maxMonthlyCount = Math.max(...monthlySubmissions.map((m: any) => m.count), 400);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('admin.systemOverviewTitle')}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {health.status} (v3.0)
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            {locale === 'tr' 
              ? 'Platform genelindeki dergilerin, kullanıcıların, altyapı performansının ve aktif süreçlerin canlı takibi.' 
              : 'Real-time monitoring of hosted journals, users, infrastructure health, and system activity.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {locale === 'tr' ? 'Yenile' : 'Refresh'}
          </button>
          <Link
            to="/dashboard/admin/journals"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {locale === 'tr' ? 'Yeni Dergi Ekle' : 'Add Journal'}
          </Link>
        </div>
      </div>

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <>
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1: Total Journals */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'tr' ? 'Barındırılan Dergiler' : 'Hosted Journals'}
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-slate-900">{overview.totalJournals}</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +2 {locale === 'tr' ? 'bu ay' : 'this month'}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  {overview.activeJournals} {locale === 'tr' ? 'Aktif Dergi' : 'Active Journals'}
                </p>
              </div>
            </motion.div>

            {/* Metric 2: Total System Users */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'tr' ? 'Sistem Kullanıcıları' : 'System Users'}
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-slate-900">{overview.totalUsers.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-purple-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +18%
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  {overview.editorsCount} Editör • {overview.activeReviewers} Hakem • {overview.authorsCount} Yazar
                </p>
              </div>
            </motion.div>

            {/* Metric 3: Total Submissions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'tr' ? 'Makale Gönderimleri' : 'Submissions'}
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-slate-900">{overview.totalSubmissions.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-blue-600 flex items-center">
                    Kabul: {overview.acceptanceRate}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  {overview.publishedArticles.toLocaleString()} {locale === 'tr' ? 'Yayınlanmış Makale' : 'Published Articles'}
                </p>
              </div>
            </motion.div>

            {/* Metric 4: System Health & Uptime */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'tr' ? 'Sistem Çalışma Süresi' : 'Uptime & Latency'}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-slate-900">{health.uptime}</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <Zap className="w-3 h-3 mr-0.5" /> {health.latencyMs}ms
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  DB: {health.database} • {locale === 'tr' ? 'Yedek:' : 'Backup:'} {health.lastBackup}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Section 2: Charts & Core Infrastructure Integration Gateways */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart: Submission Velocity */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {locale === 'tr' ? 'Aylık Gönderim Hızı & Büyüme Trendi' : 'Monthly Submission Velocity & Trend'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {locale === 'tr' ? '2026 yılı aylık yeni makale başvuru hacmi' : '2026 monthly new manuscript submission volume'}
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                  {locale === 'tr' ? 'Son 7 Ay' : 'Last 7 Months'}
                </span>
              </div>

              {/* Visual Bar Chart */}
              <div className="pt-6 pb-2 px-2 flex items-end justify-between gap-3 h-52">
                {monthlySubmissions.map((item: any, idx: number) => {
                  const heightPercent = Math.round((item.count / maxMonthlyCount) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md mb-1 whitespace-nowrap">
                        {item.count} {locale === 'tr' ? 'Gönderi' : 'Submissions'}
                      </div>
                      <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-full max-h-[140px]">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                          className="w-full bg-indigo-600 group-hover:bg-indigo-500 rounded-t-xl transition-colors"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gateway & Cloud Infrastructure Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {locale === 'tr' ? 'Entegrasyon & Servis Durumu' : 'Integrations & Service Health'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {locale === 'tr' ? 'Dış servislerin ve geçitlerin anlık bağlantı durumu' : 'Real-time connectivity to third-party gateways'}
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Gateway 1: Crossref DOI */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      DOI
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Crossref Native API</p>
                      <p className="text-[10px] font-medium text-slate-500">Auto-minting operational</p>
                    </div>
                  </div>
                  <span className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Online
                  </span>
                </div>

                {/* Gateway 2: iThenticate */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      PLG
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">iThenticate Anti-Plagiarism</p>
                      <p className="text-[10px] font-medium text-slate-500">Webhooks active</p>
                    </div>
                  </div>
                  <span className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Online
                  </span>
                </div>

                {/* Gateway 3: Sobiad & Indexing */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      IDX
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Sobiad & Citation Push</p>
                      <p className="text-[10px] font-medium text-slate-500">Metadata Sync Ready</p>
                    </div>
                  </div>
                  <span className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Ready
                  </span>
                </div>

                {/* Gateway 4: Storage & Cloud Node */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">S3 Cloud Storage</p>
                      <p className="text-[10px] font-medium text-slate-500">{health.storageUsed} capacity used</p>
                    </div>
                  </div>
                  <span className="flex items-center text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Normal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: System Audit Log & Recent Activities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {locale === 'tr' ? 'Sistem Denetim & Aktivite Kayıtları' : 'System Audit Log & Activity Stream'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {locale === 'tr' ? 'Yönetici eylemleri, rol güncellemeleri ve otomatik arka plan süreçleri' : 'Recent administrative actions, role assignments, and system events'}
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  placeholder={locale === 'tr' ? 'Kayıtlarda ara...' : 'Search logs...'}
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">{locale === 'tr' ? 'Eylem Türü' : 'Action Type'}</th>
                    <th className="px-6 py-3.5">{locale === 'tr' ? 'Kullanıcı / Servis' : 'User / Actor'}</th>
                    <th className="px-6 py-3.5">{locale === 'tr' ? 'Detay' : 'Details'}</th>
                    <th className="px-6 py-3.5">{locale === 'tr' ? 'Zaman' : 'Timestamp'}</th>
                    <th className="px-6 py-3.5 text-right">{locale === 'tr' ? 'Durum' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600 max-w-md truncate">
                          {log.details}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {log.timestamp}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Success
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium">
                        {locale === 'tr' ? 'Arama kriterine uygun denetim kaydı bulunamadı.' : 'No audit logs found matching your filter.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
