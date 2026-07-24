import { useState, useEffect } from 'react';
import { Save, Plus, GripVertical, Trash2, LayoutList, AlertTriangle } from 'lucide-react';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { Reorder } from 'framer-motion';
import { toast } from 'sonner';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { apiClient } from '../../../services/api/client';

interface FormField {
  id: string;
  type: 'text' | 'rating' | 'textarea' | 'checkbox';
  label: string;
  required: boolean;
}

export default function FormBuilder() {
  const { t, locale } = useLocaleStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const [fields, setFields] = useState<FormField[]>([]);
  
  const { data: formData, isLoading: isFetching, error } = useApiQuery<any>({ url: '/api/editor/form' });

  useEffect(() => {
    if (formData?.data?.fields) {
      setFields(formData.data.fields);
    }
  }, [formData]);

  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: locale === 'tr' ? 'Yeni Alan' : 'New Field',
      required: false
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.post('/api/editor/form', { fields });
      toast.success(locale === 'tr' ? 'Form başarıyla kaydedildi' : 'Form saved successfully');
    } catch (err: any) {
      toast.error(locale === 'tr' ? 'Form kaydedilemedi' : 'Failed to save form');
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching && fields.length === 0) {
    return <div className="p-12 text-center text-slate-500">{t('dashboard.loading')}</div>;
  }

  if (error) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-rose-500 gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 max-w-5xl">
        <AlertTriangle className="w-8 h-8" />
        <p className="font-medium">{error.message || 'Failed to load form data.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
            <LayoutList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{locale === 'tr' ? 'Değerlendirme Formu Oluşturucu' : 'Review Form Builder'}</h2>
            <p className="text-sm text-slate-500">{locale === 'tr' ? 'Hakemler için dinamik değerlendirme formunu özelleştirin.' : 'Customize the dynamic review form for reviewers.'}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isSaving ? (locale === 'tr' ? 'Kaydediliyor...' : 'Saving...') : (locale === 'tr' ? 'Formu Kaydet' : 'Save Form')}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Toolbox */}
        <div className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-fit flex-shrink-0">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">{locale === 'tr' ? 'Alan Ekle' : 'Add Field'}</h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleAddField('text')} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 flex items-center justify-between transition-colors cursor-pointer">
              <span>{locale === 'tr' ? 'Kısa Metin' : 'Short Text'}</span> <Plus className="w-4 h-4 text-slate-400" />
            </button>
            <button onClick={() => handleAddField('textarea')} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 flex items-center justify-between transition-colors cursor-pointer">
              <span>{locale === 'tr' ? 'Uzun Metin' : 'Long Text'}</span> <Plus className="w-4 h-4 text-slate-400" />
            </button>
            <button onClick={() => handleAddField('rating')} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 flex items-center justify-between transition-colors cursor-pointer">
              <span>{locale === 'tr' ? 'Puanlama (1-5)' : 'Rating (1-5)'}</span> <Plus className="w-4 h-4 text-slate-400" />
            </button>
            <button onClick={() => handleAddField('checkbox')} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 flex items-center justify-between transition-colors cursor-pointer">
              <span>{locale === 'tr' ? 'Onay Kutusu' : 'Checkbox'}</span> <Plus className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right: Canvas */}
        <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-6 min-h-[400px]">
          {fields.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <LayoutList className="w-12 h-12 mb-3 text-slate-300" />
              <p>{locale === 'tr' ? 'Form boş. Sol taraftan alan ekleyin.' : 'Form is empty. Add fields from the left.'}</p>
            </div>
          ) : (
            <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-3">
              {fields.map((field) => (
                <Reorder.Item key={field.id} value={field} className="bg-white rounded-xl border border-slate-200 shadow-sm flex items-start p-4 gap-4 group cursor-default">
                  <div className="mt-2 cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">{locale === 'tr' ? 'Alan Etiketi' : 'Field Label'}</label>
                        <input 
                          type="text" 
                          value={field.label}
                          onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                      <div className="w-full sm:w-48">
                         <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">{locale === 'tr' ? 'Türü' : 'Type'}</label>
                         <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 capitalize cursor-not-allowed">
                           {field.type}
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={field.required}
                          onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-600">{locale === 'tr' ? 'Zorunlu Alan' : 'Required Field'}</span>
                      </label>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveField(field.id)} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>
      </div>
    </div>
  );
}
