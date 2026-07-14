const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../src/pages/public/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

const dictCode = `
import { useState, useEffect } from 'react';

const dict = {
  EN: {
    hero: {
      tag: "Version 3.0 Platform Live",
      title1: "The New Standard in",
      title2: "Academic Publishing",
      desc: "An enterprise-grade, multi-tenant journal management platform. Experience double-blind peer review, automated DOIs, and global indexing in one unified ecosystem.",
      btn1: "Submit Manuscript",
      btn2: "Explore Journals",
    },
    stats: { j: "HOSTED JOURNALS", r: "VERIFIED REVIEWERS", a: "OPEN-ACCESS ARTICLES", d: "ACTIVE DOIS MINTED" },
    featured: { tag: "Top Tier Publications", title: "Featured Journals", desc: "Explore the highest-impact publications hosted on our multi-tenant infrastructure.", btn: "View Directory" },
    market: { tag: "Core Integrations", title: "Integrated Academic Marketplace", desc: "Everything required to run a high-impact journal, seamlessly bundled into a single streamlined architecture." },
    cards: {
      c1: "Crossref DOI Automation", d1: "Auto-mint and register Digital Object Identifiers instantly upon publication approval. Completely native integration.",
      c2: "Anti-Plagiarism", t2: "iThenticate Webhooks", d2: "Automated plagiarism detection pipeline natively integrated into the pre-check flow.",
      c3: "Indexing Gateways", t3: "Sobiad Indexing", d3: "Direct metadata push to citation indexing gateways.",
      c4: "Communication", t4: "Mass Mailer Engine", d4: "High-deliverability encrypted hub for reviewer invitations."
    }
  },
  TR: {
    hero: {
      tag: "Sürüm 3.0 Platformu Yayında",
      title1: "Akademik Yayıncılıkta",
      title2: "Yeni Standart",
      desc: "Kurumsal düzeyde, çok kiracılı dergi yönetim platformu. Çift kör hakem değerlendirmesi, otomatik DOI'ler ve küresel indekslemeyi tek bir birleşik ekosistemde deneyimleyin.",
      btn1: "Makale Gönder",
      btn2: "Dergileri Keşfet",
    },
    stats: { j: "BARINDIRILAN DERGİ", r: "ONAYLI HAKEM", a: "AÇIK ERİŞİMLİ MAKALE", d: "AKTİF DOI" },
    featured: { tag: "Üst Düzey Yayınlar", title: "Öne Çıkan Dergiler", desc: "Çok kiracılı altyapımızda barındırılan en yüksek etkili yayınları keşfedin.", btn: "Dizini Görüntüle" },
    market: { tag: "Temel Entegrasyonlar", title: "Entegre Akademik Pazar Yeri", desc: "Yüksek etkili bir dergi yönetmek için gereken her şey, sorunsuz bir şekilde tek bir aerodinamik mimaride toplandı." },
    cards: {
      c1: "Crossref DOI Otomasyonu", d1: "Yayın onayından hemen sonra Dijital Nesne Tanımlayıcıları otomatik oluşturun ve kaydedin. Tamamen yerel entegrasyon.",
      c2: "İntihal Karşıtı", t2: "iThenticate Webhook'ları", d2: "Ön kontrol akışına yerel olarak entegre edilmiş otomatik intihal tespiti hattı.",
      c3: "İndeksleme Ağ Geçitleri", t3: "Sobiad İndeksleme", d3: "Atıf indeksleme ağ geçitlerine doğrudan üst veri gönderimi.",
      c4: "İletişim", t4: "Toplu Posta Motoru", d4: "Hakem davetleri için yüksek teslim edilebilir şifreli merkez."
    }
  }
};
`;

const stateCode = `
  const [lang, setLang] = useState<'EN' | 'TR'>(() => (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
  useEffect(() => {
    const handleLang = () => setLang((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    window.addEventListener('lang-change', handleLang);
    return () => window.removeEventListener('lang-change', handleLang);
  }, []);
  const t = dict[lang];
`;

content = content.replace("export default function Home() {", dictCode + "\nexport default function Home() {\n" + stateCode);

// Hero Replacements
content = content.replace(">Version 3.0 Platform Live<", ">{t.hero.tag}<");
content = content.replace("The New Standard in <br />", "{t.hero.title1} <br />");
content = content.replace(">\\n                Academic Publishing\\n              <", ">{t.hero.title2}<");
content = content.replace(">\\n              An enterprise-grade, multi-tenant journal management platform. Experience double-blind peer review, automated DOIs, and global indexing in one unified ecosystem.\\n            <", ">{t.hero.desc}<");
content = content.replace(">\\n                Submit Manuscript\\n              <", ">{t.hero.btn1}<");
content = content.replace(">\\n                Explore Journals\\n              <", ">{t.hero.btn2}<");

// Stats Replacements
content = content.replace("'HOSTED JOURNALS'", "t.stats.j");
content = content.replace("'VERIFIED REVIEWERS'", "t.stats.r");
content = content.replace("'OPEN-ACCESS ARTICLES'", "t.stats.a");
content = content.replace("'ACTIVE DOIS MINTED'", "t.stats.d");

// Featured Replacements
content = content.replace("> Top Tier Publications", "> {t.featured.tag}");
content = content.replace(">Featured Journals<", ">{t.featured.title}<");
content = content.replace(">Explore the highest-impact publications hosted on our multi-tenant infrastructure.<", ">{t.featured.desc}<");
content = content.replace("View Directory <ArrowRight", "{t.featured.btn} <ArrowRight");

// Market Replacements
content = content.replace("> \\n            Core Integrations\\n          <", "> \\n            {t.market.tag}\\n          <");
content = content.replace(">\\n            Integrated Academic Marketplace\\n          <", ">\\n            {t.market.title}\\n          <");
content = content.replace(">\\n            Everything required to run a high-impact journal, seamlessly bundled into a single streamlined architecture.\\n          <", ">\\n            {t.market.desc}\\n          <");

// Cards Replacements
content = content.replace(">Crossref Automation<", ">{t.cards.c1}<");
content = content.replace(">Crossref DOI Automation<", ">{t.cards.c1}<");
content = content.replace(">\\n                Auto-mint and register Digital Object Identifiers instantly upon publication approval. Completely native integration.\\n              <", ">{t.cards.d1}<");

content = content.replace(">\\n                  Anti-Plagiarism\\n                <", ">\\n                  {t.cards.c2}\\n                <");
content = content.replace(">iThenticate Webhooks<", ">{t.cards.t2}<");
content = content.replace(">\\n                  Automated plagiarism detection pipeline natively integrated into the pre-check flow.\\n                <", ">\\n                  {t.cards.d2}\\n                <");

content = content.replace("> Indexing Gateways", "> {t.cards.c3}");
content = content.replace(">Sobiad Indexing<", ">{t.cards.t3}<");
content = content.replace(">Direct metadata push to citation indexing gateways.<", ">{t.cards.d3}<");

content = content.replace("> Communication", "> {t.cards.c4}");
content = content.replace(">Mass Mailer Engine<", ">{t.cards.t4}<");
content = content.replace(">High-deliverability encrypted hub for reviewer invitations.<", ">{t.cards.d4}<");

// Journal name translation in map
content = content.replace("{journal.name}</h3>", "{lang === 'EN' ? journal.name : journal.tr}</h3>");
content = content.replace("{journal.tr}</p>", "{lang === 'EN' ? journal.tr : journal.name}</p>");

fs.writeFileSync(homePath, content, 'utf8');
console.log("Successfully localized Home.tsx");
