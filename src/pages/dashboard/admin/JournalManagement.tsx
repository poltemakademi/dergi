import { useState } from 'react';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { Plus, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function JournalManagement() {
  const { data: journals, isLoading, refetch } = useApiQuery<any[]>({ url: '/api/admin/journals' });
  const { mutate: createJournal, isLoading: isCreating } = useApiMutation('/api/admin/journals', {
    method: 'post',
    successMessage: 'Journal created successfully',
    onSuccess: () => {
      setShowForm(false);
      setNewJournal({ name: '', slug: '', description: '' });
      refetch();
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [newJournal, setNewJournal] = useState({ name: '', slug: '', description: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournal.name.trim()) {
      toast.error('Journal name is required');
      return;
    }
    createJournal(newJournal);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Journal Management</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Journal
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">New Journal</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Journal Name *</label>
                <input 
                  type="text" 
                  value={newJournal.name}
                  onChange={(e) => setNewJournal({ ...newJournal, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Journal of Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                <input 
                  type="text" 
                  value={newJournal.slug}
                  onChange={(e) => setNewJournal({ ...newJournal, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. journal-of-science"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                value={newJournal.description}
                onChange={(e) => setNewJournal({ ...newJournal, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Short description of the journal..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isCreating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Save Journal'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableSkeleton rows={4} cols={4} />
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Journal</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journals && journals.length > 0 ? (
                journals.map((journal: any) => (
                  <tr key={journal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{journal.name}</p>
                          <p className="text-xs text-slate-500">{journal.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{journal.slug || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-4 h-4" />
                        {new Date(journal.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No journals found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
