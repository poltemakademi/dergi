import { useEffect, useState } from 'react';
import { Terminal, Database, Server } from 'lucide-react';

const dict = {
  EN: {
    title: "API Reference",
    subtitle: "Interact programmatically with journals, issues, and metadata archives using our secure JSON REST API.",
    authTitle: "Authentication",
    authDesc: "All API requests must contain your API key in the Authorization header. Do not share your secret API key.",
    endpointsTitle: "Core Endpoints",
    endpoints: [
      { method: "GET", path: "/v1/journals", desc: "List all public journals with active metadata registry and slugs." },
      { method: "GET", path: "/v1/journals/:slug/issues", desc: "Retrieve published issues, volumes, and page counts for a specific journal." },
      { method: "POST", path: "/v1/submissions", desc: "Submit a new manuscript draft. Requires author authentication token." }
    ]
  },
  TR: {
    title: "API Referansı",
    subtitle: "Güvenli JSON REST API'mizi kullanarak dergiler, sayılar ve üstveri arşivleri ile programlı olarak etkileşime geçin.",
    authTitle: "Kimlik Doğrulama",
    authDesc: "Tüm API istekleri, Authorization başlığında API anahtarınızı içermelidir. Gizli API anahtarınızı kimseyle paylaşmayın.",
    endpointsTitle: "Temel Uç Noktalar (Endpoints)",
    endpoints: [
      { method: "GET", path: "/v1/journals", desc: "Aktif üstveri kaydı ve kısa adları (slug) olan tüm açık dergileri listeler." },
      { method: "GET", path: "/v1/journals/:slug/issues", desc: "Belirli bir dergiye ait yayınlanmış sayıları, ciltleri ve sayfa sayılarını getirir." },
      { method: "POST", path: "/v1/submissions", desc: "Yeni bir makale taslağı gönderir. Yazar kimlik doğrulama belirteci gerektirir." }
    ]
  }
};

export default function ApiReference() {
  const [lang, setLang] = useState<'EN' | 'TR'>('TR');
  const [activeTab, setActiveTab] = useState<'js' | 'python'>('js');

  useEffect(() => {
    const currentLang = (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR';
    setLang(currentLang);

    const handleLangChange = () => {
      setLang((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);

  const t = dict[lang];

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10 text-left">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Developer Reference</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Authentication Info */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            {t.authTitle}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-normal">{t.authDesc}</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-700">
            Authorization: Bearer YOUR_API_SECRET_KEY
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            {t.endpointsTitle}
          </h2>
          <div className="space-y-4">
            {t.endpoints.map((ep, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded text-xs font-black tracking-wider ${ep.method === 'GET' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-indigo-50 text-indigo-700 border border-indigo-150'}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-950">{ep.path}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-normal md:max-w-md">{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic SDK Code tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-900 font-serif text-lg">Code Samples</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('js')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'js' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                JavaScript
              </button>
              <button
                onClick={() => setActiveTab('python')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'python' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Python
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-lg border border-slate-800 font-mono text-xs overflow-x-auto">
            {activeTab === 'js' ? (
              <pre>{`// Fetch all active journals using fetch API
async function fetchActiveJournals() {
  const response = await fetch('https://api.academianexus.org/v1/journals', {
    headers: {
      'Authorization': 'Bearer acme_prod_sec_key_19283'
    }
  });
  const data = await response.json();
  console.log('Registered journals:', data.journals);
}

fetchActiveJournals();`}</pre>
            ) : (
              <pre>{`# Fetch all active journals using python requests
import requests

def get_journals():
    url = "https://api.academianexus.org/v1/journals"
    headers = {
        "Authorization": "Bearer acme_prod_sec_key_19283"
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    print("Registered journals:", data["journals"])

get_journals()`}</pre>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
