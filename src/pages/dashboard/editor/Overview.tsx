import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, FileText, Download, CheckCircle, Clock, BarChart3, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';

export default function Overview() {
  const navigate = useNavigate();
  const { t, locale } = useLocaleStore();
  const [timeFilter, setTimeFilter] = useState('year');
  const { data: analytics, isLoading, error } = useApiQuery<any>({ 
    url: '/api/editor/analytics',
    params: { timeframe: timeFilter } 
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">{t('dashboard.loading')}</div>;
  }

  if (error) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-rose-500 gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">
        <AlertTriangle className="w-8 h-8" />
        <p className="font-medium">{error.message || 'Failed to load analytics data.'}</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl border border-slate-200/50">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('overview.title')}</h2>
            <p className="text-sm font-medium text-slate-500">{locale === 'tr' ? 'Dergi performans özeti ve iş akışı durumu' : 'Journal performance summary and workflow status'}</p>
          </div>
        </div>
        
        {/* Time Filter Toggle */}
        <div className="flex items-center bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
          {[
            { id: 'month', label: locale === 'tr' ? 'Bu Ay' : 'This Month' },
            { id: 'year', label: locale === 'tr' ? 'Bu Yıl' : 'This Year' },
            { id: 'all', label: locale === 'tr' ? 'Tümü' : 'All Time' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTimeFilter(f.id)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                timeFilter === f.id 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: t('overview.totalSubmissions'), value: analytics?.totalSubmissions || '0', icon: FileText, trend: analytics?.trends?.submissions || '+0%', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
              { title: t('overview.acceptanceRate'), value: analytics?.acceptanceRate || '0%', icon: CheckCircle, trend: analytics?.trends?.acceptance || '+0%', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              { title: t('overview.avgReviewTime'), value: analytics?.avgReviewTime || '0', icon: Clock, trend: analytics?.trends?.reviewTime || '-0', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
              { title: t('overview.totalDownloads'), value: analytics?.totalDownloads || '0', icon: Download, trend: analytics?.trends?.downloads || '+0%', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' }
            ].map((kpi, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} border rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md border ${kpi.trend.startsWith('+') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                    {kpi.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{kpi.value}</h3>
                  <p className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">{kpi.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Chart Mockup (Pure CSS) */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{t('overview.velocityTitle')}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">{locale === 'tr' ? 'Aylık bazda gelen makale sayısı' : 'Monthly incoming articles'}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-bold">
                  <TrendingUp className="w-4 h-4 text-slate-800" /> {t('overview.yoy')}
                </div>
              </div>
              
              <div className="flex-1 min-h-[280px] flex items-end gap-3 px-2">
                {(analytics?.velocity || [40, 55, 30, 70, 85, 60, 45, 90, 110, 80, 65, 95]).map((val: number, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full justify-end">
                    <div className="w-full bg-slate-50 rounded-t-xl overflow-hidden h-[240px] relative transition-colors group-hover/bar:bg-slate-100/70">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / 110) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 + 0.2, type: 'spring' }}
                        className="absolute bottom-0 w-full bg-slate-900 rounded-t-xl group-hover/bar:bg-slate-700 transition-colors shadow-[0_-4px_10px_rgba(0,0,0,0.1)]" 
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold group-hover/bar:text-slate-900 transition-colors">
                      {locale === 'tr' ? ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'][i] : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Status Distribution */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900">{t('overview.pipeline')}</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">{locale === 'tr' ? 'Mevcut makale durumları' : 'Current article statuses'}</p>
              </div>
              
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                {(analytics?.distribution || [
                  { id: 'pending', label: t('stat.pending'), count: 8, color: 'bg-amber-500', pct: 8 },
                  { id: 'in_review', label: t('stat.inReview'), count: 45, color: 'bg-blue-500', pct: 45 },
                  { id: 'revision', label: 'Revision Required', count: 12, color: 'bg-rose-500', pct: 12 },
                  { id: 'accepted', label: 'Accepted', count: 28, color: 'bg-emerald-500', pct: 28 }
                ]).map((stat: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/dashboard/editor/articles?status=${stat.id}`)}
                    className="group cursor-pointer p-4 rounded-xl hover:bg-slate-50 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${stat.color}`} />
                        <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-900">{stat.count}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors group-hover:translate-x-1" />
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                        className={`${stat.color} h-full rounded-full`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
