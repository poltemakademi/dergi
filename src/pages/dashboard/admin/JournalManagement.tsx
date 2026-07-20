import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';

export default function JournalManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Journal Management</h2>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <TableSkeleton rows={4} cols={5} />
      </div>
    </div>
  );
}
