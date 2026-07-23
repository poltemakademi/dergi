import { useState, useMemo } from 'react';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, ShieldCheck, UserX, Search, 
  Plus, Edit3, Check, X, Mail, Building, RefreshCw, 
  BookOpen, CheckSquare, PenTool, LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../../services/api/client';

export default function UserManagement() {
  const { locale, t } = useLocaleStore();
  const { data: usersData, isLoading, refetch } = useApiQuery<any[]>({ url: '/api/admin/users' });
  const users = useMemo(() => {
    if (!usersData) return [];
    return Array.isArray(usersData) ? usersData : (usersData as any).data || [];
  }, [usersData]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  
  // Modals state
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editedRoles, setEditedRoles] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    institution: '',
    department: '',
    role: 'reviewer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available roles list
  const availableRoles = [
    { key: 'author', label: t('role.author'), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'reviewer', label: t('role.reviewer'), color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'editor', label: t('role.editor'), color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { key: 'layout_editor', label: t('role.layout_editor'), color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'super_admin', label: t('role.super_admin'), color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  // Filtering users
  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      const matchesSearch = 
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.institution || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.department || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = 
        selectedRoleFilter === 'all' ? true : (u.roles || []).includes(selectedRoleFilter);

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRoleFilter]);

  // Open edit roles modal
  const handleOpenEditRoles = (user: any) => {
    setEditingUser(user);
    setEditedRoles(user.roles || ['author']);
  };

  // Toggle role in edit modal
  const handleToggleRoleCheckbox = (roleKey: string) => {
    if (editedRoles.includes(roleKey)) {
      if (editedRoles.length === 1) {
        toast.warning(locale === 'tr' ? 'Kullanıcının en az 1 rolü olmalıdır.' : 'User must have at least one role.');
        return;
      }
      setEditedRoles(editedRoles.filter(r => r !== roleKey));
    } else {
      setEditedRoles([...editedRoles, roleKey]);
    }
  };

  // Save role updates
  const handleSaveRoles = async () => {
    if (!editingUser) return;
    try {
      setIsSubmitting(true);
      await apiClient.put(`/api/admin/users/${editingUser.id}/roles`, { roles: editedRoles });
      toast.success(locale === 'tr' ? 'Kullanıcı rolleri başarıyla güncellendi.' : 'User roles updated successfully.');
      setEditingUser(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update roles');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle user status (active / suspended)
  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      await apiClient.put(`/api/admin/users/${user.id}/status`, { status: newStatus });
      toast.success(
        locale === 'tr' 
          ? `Kullanıcı durumu: ${newStatus === 'active' ? 'Aktif' : 'Askıya Alındı'}` 
          : `User status changed to ${newStatus}`
      );
      refetch();
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  // Handle Invite Form submit
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      toast.error(locale === 'tr' ? 'Ad ve E-posta alanları zorunludur.' : 'Name and Email are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      toast.success(locale === 'tr' ? 'Kullanıcı daveti gönderildi!' : 'User invitation sent!');
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', institution: '', department: '', role: 'reviewer' });
      refetch();
    } catch (err: any) {
      toast.error('Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (roleKey: string) => {
    switch (roleKey) {
      case 'super_admin': return <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
      case 'editor': return <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />;
      case 'reviewer': return <CheckSquare className="w-3.5 h-3.5 text-blue-600" />;
      case 'layout_editor': return <BookOpen className="w-3.5 h-3.5 text-amber-600" />;
      case 'author': default: return <PenTool className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            {t('admin.userManagementTitle')}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {locale === 'tr' 
              ? 'Platform kullanıcılarının izinlerini, hakem ve editör atamalarını, sistem erişimlerini yönetin.' 
              : 'Manage system users, assign roles (Super Admin, Editor, Reviewer, Author), and update access status.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {locale === 'tr' ? 'Yenile' : 'Refresh'}
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {locale === 'tr' ? 'Yeni Kullanıcı Davet Et' : 'Invite User'}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'tr' ? 'Kullanıcı adı, e-posta veya kurum ara...' : 'Search by name, email or institution...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <button
              onClick={() => setSelectedRoleFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoleFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {locale === 'tr' ? 'Tüm Roller' : 'All Roles'} ({users.length})
            </button>
            {availableRoles.map((r) => {
              const count = users.filter((u: any) => (u.roles || []).includes(r.key)).length;
              return (
                <button
                  key={r.key}
                  onClick={() => setSelectedRoleFilter(r.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRoleFilter === r.key
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">{locale === 'tr' ? 'Kullanıcı Profil' : 'User Profile'}</th>
                  <th className="px-6 py-4">{locale === 'tr' ? 'Kurum & Bölüm' : 'Institution & Department'}</th>
                  <th className="px-6 py-4">{locale === 'tr' ? 'Atanmış Sistem Rolleri' : 'Assigned Roles'}</th>
                  <th className="px-6 py-4">{locale === 'tr' ? 'Hesap Durumu' : 'Status'}</th>
                  <th className="px-6 py-4 text-right">{locale === 'tr' ? 'Eylemler' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-snug">{user.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Institution */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800">{user.institution || 'Belirtilmedi'}</p>
                            <p className="text-[11px] text-slate-500">{user.department || 'Bölüm yok'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Roles Badges */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(user.roles || ['author']).map((roleKey: string) => {
                            const found = availableRoles.find(r => r.key === roleKey);
                            return (
                              <span
                                key={roleKey}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                                  found?.color || 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                {getRoleIcon(roleKey)}
                                {found?.label || roleKey}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          user.status === 'suspended'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {user.status === 'suspended' ? (
                            <>
                              <UserX className="w-3 h-3 text-rose-600" />
                              {locale === 'tr' ? 'Askıda' : 'Suspended'}
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3 text-emerald-600" />
                              {locale === 'tr' ? 'Aktif' : 'Active'}
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditRoles(user)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title={locale === 'tr' ? 'Rolleri Düzenle' : 'Edit Roles'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            {locale === 'tr' ? 'Rolleri Yönet' : 'Manage Roles'}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              user.status === 'suspended'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                            title={user.status === 'suspended' ? 'Aktifleştir' : 'Askıya Al'}
                          >
                            {user.status === 'suspended' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      {locale === 'tr' ? 'Arama kriterlerine uygun kullanıcı bulunamadı.' : 'No users found matching your criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Roles Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {locale === 'tr' ? 'Kullanıcı Rollerini Düzenle' : 'Manage User Roles'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{editingUser.name} ({editingUser.email})</p>
                </div>
                <button 
                  onClick={() => setEditingUser(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'tr' ? 'Aktif Rol Seçimleri' : 'Role Assignments'}
                </p>
                {availableRoles.map((role) => {
                  const isChecked = editedRoles.includes(role.key);
                  return (
                    <label
                      key={role.key}
                      onClick={() => handleToggleRoleCheckbox(role.key)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-slate-50 border-slate-900/30 shadow-2xs' 
                          : 'bg-white border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getRoleIcon(role.key)}
                        <div>
                          <p className="text-xs font-bold text-slate-900">{role.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {role.key === 'super_admin' ? 'Tüm sistem ve dergi yönetimi' : 
                             role.key === 'editor' ? 'Makale süreci ve sayı yönetimi' :
                             role.key === 'reviewer' ? 'Hakemlik inceleme paneli' :
                             role.key === 'layout_editor' ? 'Dizgi ve mizanpaj kuyruğu' : 'Makale başvuru ve takip'}
                          </p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {t('dashboard.cancel')}
                </button>
                <button
                  onClick={handleSaveRoles}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Kaydediliyor...' : t('dashboard.save')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite User Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {locale === 'tr' ? 'Yeni Kullanıcı Davet Et' : 'Invite New User'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {locale === 'tr' ? 'Kullanıcıya platform davet e-postası ve yetki tanımlaması gönderin.' : 'Send a system invitation email and assign starting role.'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Ad Soyad *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="Prof. Dr. Ahmet Yılmaz"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'E-posta Adresi *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="ahmet.yilmaz@universite.edu.tr"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {locale === 'tr' ? 'Kurum' : 'Institution'}
                    </label>
                    <input
                      type="text"
                      value={inviteForm.institution}
                      onChange={(e) => setInviteForm({ ...inviteForm, institution: e.target.value })}
                      placeholder="Marmara Üniversitesi"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {locale === 'tr' ? 'Başlangıç Rolü' : 'Primary Role'}
                    </label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {availableRoles.map(r => (
                        <option key={r.key} value={r.key}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    {t('dashboard.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Gönderiliyor...' : (locale === 'tr' ? 'Davet Et' : 'Send Invite')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
