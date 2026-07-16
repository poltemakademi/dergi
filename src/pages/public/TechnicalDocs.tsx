import { useEffect, useState } from 'react';
import { BookOpen, Terminal, Cpu, Server, Shield } from 'lucide-react';

const dict = {
  EN: {
    title: "Technical Documentation",
    subtitle: "Architecture overview and technical blueprint of the AcademiaNexus multi-tenant workspace.",
    sections: [
      {
        title: "Multi-Tenant Architecture",
        desc: "Each registered journal operates on an isolated tenant workspace utilizing PostgreSQL Row-Level Security (RLS). This ensures absolute isolation of reviewer assignments, blinding logs, and draft documents while sharing a unified, secure database core.",
        icon: Server
      },
      {
        title: "Metadata Autopilot Engine",
        desc: "Our automated pipeline transforms raw document assets into standard JATS XML format. Webhooks trigger automatic DOI registration via the Crossref REST API immediately upon publication approval.",
        icon: Cpu
      },
      {
        title: "Cryptographic Blinding Protocols",
        desc: "To ensure double-blind integrity, all author metadata is stripped programmatically during submission pre-checks. Communication between editors, authors, and reviewers is routed through encrypted proxy message queues.",
        icon: Shield
      }
    ]
  },
  TR: {
    title: "Teknik Dokümantasyon",
    subtitle: "AcademiaNexus çok kiracılı iş alanı mimarisi ve teknik sistem planı genel görünümü.",
    sections: [
      {
        title: "Çok Kiracılı (Multi-Tenant) Mimari",
        desc: "Sisteme kayıtlı her dergi, PostgreSQL Satır Düzeyinde Güvenlik (RLS) kullanan yalıtılmış bir alanda çalışır. Bu, tüm hakem atamalarının ve taslak belgelerin gizliliğini sağlarken, tek bir güçlü veritabanı çekirdeğini paylaşır.",
        icon: Server
      },
      {
        title: "Otomatik Üstveri Motoru",
        desc: "Otomatik iş akışımız, ham makale belgelerini standart JATS XML biçimine dönüştürür. Yayın onayının hemen ardından web hook'lar Crossref REST API aracılığıyla otomatik DOI kaydını tetikler.",
        icon: Cpu
      },
      {
        title: "Kriptografik Kimlik Arındırma",
        desc: "Çift-kör değerlendirme bütünlüğünü korumak için, yazar üstverileri sistem ön kontrollerinde otomatik olarak temizlenir. Editörler, yazarlar ve hakemler arasındaki iletişim şifreli ara sunucular üzerinden yürütülür.",
        icon: Shield
      }
    ]
  }
};

export default function TechnicalDocs() {
  const [lang, setLang] = useState<'EN' | 'TR'>('TR');

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
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Architecture</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-8">
          {t.sections.map((section, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <section.icon className="w-6 h-6 text-slate-700" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 font-serif">{section.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-normal">{section.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Snippet Example Block */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-lg border border-slate-800 font-mono text-xs overflow-x-auto space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-2 text-slate-400 justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>autocommit_doi.go</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Crossref API Request</span>
          </div>
          <pre>{`package main

import (
	"context"
	"fmt"
	"net/http"
)

// RegisterDoiToken submits XML metadata to Crossref REST endpoint
func RegisterDoiToken(ctx context.Context, doi string, metadataXml []byte) error {
	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.crossref.org/deposits", bytes.NewReader(metadataXml))
	if err != nil {
		return fmt.Errorf("failed to initiate request: %w", err)
	}
	req.Header.Set("Content-Type", "application/vnd.crossref.deposit+xml")
	req.Header.Set("Authorization", "Bearer "+getSecretToken())
	
	// Execute automated submission pipeline...
	return nil
}`}</pre>
        </div>
      </div>
    </main>
  );
}
