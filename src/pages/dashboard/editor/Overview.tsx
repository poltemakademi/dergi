import { TrendingUp, FileText, Download, CheckCircle, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';

export default function Overview() {
  const { t } = useLocaleStore();
  const { data: analytics, isLoading, error } = useApiQuery<any>({ url: '/api/editor/analytics' });

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
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900">{t('overview.title')}</h2>
      </div>

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <>
          {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: t('overview.totalSubmissions'), value: analytics?.totalSubmissions || '0', icon: FileText, trend: analytics?.trends?.submissions || '+0%' },
          { title: t('overview.acceptanceRate'), value: analytics?.acceptanceRate || '0%', icon: CheckCircle, trend: analytics?.trends?.acceptance || '+0%' },
          { title: t('overview.avgReviewTime'), value: analytics?.avgReviewTime || '0', icon: Clock, trend: analytics?.trends?.reviewTime || '-0' },
          { title: t('overview.totalDownloads'), value: analytics?.totalDownloads || '0', icon: Download, trend: analytics?.trends?.downloads || '+0%' }
        ].map((kpi, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-100">
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${kpi.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                {kpi.trend}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{kpi.value}</h3>
            <p className="text-sm font-semibold text-slate-500">{kpi.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart Mockup (Pure CSS) */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-slate-900">{t('overview.velocityTitle')}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <TrendingUp className="w-4 h-4 text-slate-400" /> {t('overview.yoy')}
            </div>
          </div>
          
          <div className="flex-1 min-h-[240px] flex items-end gap-2 px-2">
            {(analytics?.velocity || [40, 55, 30, 70, 85, 60, 45, 90, 110, 80, 65, 95]).map((val: number, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar h-full justify-end">
                <div className="w-full bg-slate-50 rounded-t-md overflow-hidden h-[200px] border border-slate-100 relative group-hover/bar:bg-slate-100 transition-colors">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / 110) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 + 0.2, type: 'spring' }}
                    className="absolute bottom-0 w-full bg-slate-800 rounded-t-md group-hover/bar:bg-slate-700 transition-colors" 
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-slate-900 mb-6">{t('overview.pipeline')}</h3>
          
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {(analytics?.distribution || [
              { label: t('stat.inReview'), count: 45, color: 'bg-indigo-500', pct: 45 },
              { label: 'Revision Required', count: 12, color: 'bg-rose-500', pct: 12 },
              { label: 'Accepted', count: 28, color: 'bg-emerald-500', pct: 28 },
              { label: t('stat.pending'), count: 8, color: 'bg-slate-400', pct: 8 }
            ]).map((stat: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-slate-600 text-sm">{stat.label}</span>
                  <span className="text-sm font-bold text-slate-900">{stat.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                    className={`${stat.color || 'bg-indigo-500'} h-full rounded-full`} 
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
