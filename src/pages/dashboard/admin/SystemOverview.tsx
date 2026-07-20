import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';

export default function SystemOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">System Overview</h2>
      </div>
      <CardSkeleton count={4} />
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[300px] flex items-center justify-center">
        <p className="text-slate-400 font-medium">System activity charts will go here.</p>
      </div>
    </div>
  );
}
