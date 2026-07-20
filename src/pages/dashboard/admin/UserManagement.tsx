import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <TableSkeleton rows={5} cols={4} />
      </div>
    </div>
  );
}
