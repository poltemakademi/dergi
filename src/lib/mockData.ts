export interface MockArticle {
  id: number;
  title: string;
  author: string;
  doi: string;
  abstract: string;
  pages: string;
  keywords?: string[];
  pdf_url?: string;
}

export interface MockAnnouncement {
  type: string;
  date: string;
  title: string;
  content: string;
}

export interface MockBoardMember {
  role: string;
  name: string;
  title: string;
}

export interface MockAdvisoryMember {
  name: string;
  institution: string;
}

export interface MockJournal {
  id: string;
  slug: string;
  name: string;
  tr: string;
  issn: string;
  index: string;
  indexColor: string;
  cover: string;
  impactFactor: string;
  reviewTime: string;
  acceptRate: string;
  articlesCount: string;
  description: {
    EN: string;
    TR: string;
  };
  about: {
    EN: string;
    TR: string;
  };
  aimsScope: {
    EN: string;
    TR: string;
  };
  writingPrinciples: {
    EN: string;
    TR: string;
  };
  publisher: {
    EN: string;
    TR: string;
  };
  contact: {
    EN: string;
    TR: string;
  };
  editorialBoard: MockBoardMember[];
  advisoryBoard: MockAdvisoryMember[];
  articles: MockArticle[];
  announcements: MockAnnouncement[];
}

export const MOCK_JOURNALS: MockJournal[] = [
  {
    id: 'JS',
    slug: 'js',
    name: 'Journal of Space Exploration',
    tr: 'Uzay Keşifleri Dergisi',
    issn: '2845-901X',
    index: 'Scopus Indexed',
    indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    impactFactor: '3.8',
    reviewTime: '4 Weeks Avg',
    acceptRate: '18%',
    articlesCount: '342',
    description: {
      EN: 'An international venue for research in astrophysics, aerospace engineering, planetary science, and deep space exploration.',
      TR: 'Astrofizik, havacılık og uzay mühendisliği, gezegen bilimi ve derin uzay keşiflerinde araştırmalar için uluslararası bir mecra.'
    },
    about: {
      EN: 'The Journal of Space Exploration (JSE) is a peer-reviewed, open-access forum dedicated to the advancement of space science and astronautics. Our objective is to publish original, high-quality papers contributing to space exploration engineering, astronomy, planetary biology, and orbital logistics.',
      TR: 'Uzay Keşifleri Dergisi (JSE), uzay bilimi ve astronotikliğin ilerlemesine adanmış, hakemli ve açık erişimli bir forumdur. Amacımız, uzay keşif mühendisliği, astronomi, gezegen biyolojisi ve yörünge lojistiğine katkıda bulunan orijinal, yüksek kaliteli makaleler yayınlamaktır.'
    },
    aimsScope: {
      EN: 'Coverage includes: rocket propulsion systems, spacecraft dynamics, satellite communications, lunar and Martian habitat design, space environment effects, and interplanetary trajectory optimization.',
      TR: 'Kapsam şunları içerir: roket itki sistemleri, uzay aracı dinamikleri, uydu iletişimleri, Ay ve Mars yaşam alanı tasarımı, uzay ortamı etkileri ve gezegenler arası yörünge optimizasyonu.'
    },
    writingPrinciples: {
      EN: 'Manuscripts must be submitted in English, formatted in standard double-column format. Figures should be high resolution (min 300 DPI). Referencing must strictly follow APA 7th edition guidelines.',
      TR: 'Makaleler İngilizce olarak, standart çift sütun düzeninde sunulmalıdır. Şekiller yüksek çözünürlüklü olmalıdır (en az 300 DPI). Atıflar kesinlikle APA 7. baskı yönergelerine uygun olmalıdır.'
    },
    publisher: {
      EN: 'Published by Academia Nexus Publishing Group on behalf of the Space Research Consortium.',
      TR: 'Uzay Araştırmaları Konsorsiyumu adına Academia Nexus Yayın Grubu tarafından yayınlanmaktadır.'
    },
    contact: {
      EN: 'Editorial Office: jse.editor@academianexus.com\nAddress: Building A, Aerospace Park, Ankara, TR',
      TR: 'Editörlük Ofisi: jse.editor@academianexus.com\nAdres: A Blok, Havacılık Parkı, Ankara, TR'
    },
    editorialBoard: [
      { role: 'Editor-in-Chief', name: 'Prof. Dr. Sarah Jenkins', title: 'Department of Aerospace Engineering, MIT' },
      { role: 'Assistant Editor', name: 'Dr. Michael Chen', title: 'Orbital Mechanics Lab, Stanford University' }
    ],
    advisoryBoard: [
      { name: 'Dr. Elena Rostova', institution: 'Roscosmos Research Div' },
      { name: 'Prof. Kenji Takahashi', institution: 'JAXA Space Academy' }
    ],
    articles: [
      {
        id: 1,
        title: 'A Neural Framework for Quantum Grid Computing Architecture in Deep Space Networks',
        author: 'Sarah Jenkins, Michael Chen',
        doi: '10.2845/qg.2026.0412',
        abstract: 'This paper presents a novel approach to grid computing using neural framework architectures tailored for deep space networks. By mapping resource distribution nodes across simulated quantum states, we demonstrate a 42% decrease in synchronization latency across interplanetary distances.',
        pages: '12-34'
      },
      {
        id: 2,
        title: 'Thermal Shield Optimization Methods for Low-Orbit Solar Explorers',
        author: 'Dr. Elena Rostova',
        doi: '10.2845/qg.2026.0413',
        abstract: 'We outline the design and flight-ready simulation of a carbon-carbon composite thermal shield. The shield utilizes micro-grooved channel cooling structures to withstand radiant heat fluxes exceeding 1.2 MW/m2.',
        pages: '35-58'
      }
    ],
    announcements: [
      {
        type: 'CFP',
        date: 'June 2026',
        title: 'Special Issue on Mars Colonization Logistics',
        content: 'JSE invites researchers to submit papers on Mars atmospheric reentry, automated surface extraction, and closed-loop bio-regenerative life support systems for our upcoming December 2026 Special Issue.'
      }
    ]
  },
  {
    id: 'AM',
    slug: 'am',
    name: 'Annals of Modern Medicine',
    tr: 'Modern Tıp Yıllıkları',
    issn: '1992-0453',
    index: 'Web of Science',
    indexColor: 'text-blue-700 bg-blue-50 border-blue-200',
    cover: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop',
    impactFactor: '4.5',
    reviewTime: '6 Weeks Avg',
    acceptRate: '12%',
    articlesCount: '512',
    description: {
      EN: 'Publishing clinical research, epidemiological surveys, and pioneering biotechnology breakthroughs.',
      TR: 'Klinik araştırmalar, epidemiyolojik sürveyleri ve öncü biyoteknoloji atılımlarını yayınlar.'
    },
    about: {
      EN: 'Annals of Modern Medicine (AMM) is a premier clinical research outlet committed to sharing revolutionary medical discoveries. We focus on bridging the gap between molecular laboratory science and clinical patient care.',
      TR: 'Modern Tıp Yıllıkları (AMM), devrim niteliğindeki tıbbi keşifleri paylaşmayı taahhüt eden öncü bir klinik araştırma yayınıdır. Moleküler laboratuvar bilimi ile klinik hasta bakımı arasındaki köprüyü kurmaya odaklanıyoruz.'
    },
    aimsScope: {
      EN: 'Topics: Oncology, immunology, molecular biology, cardiology, precision drug delivery, and healthcare AI analytics.',
      TR: 'Konular: Onkoloji, immünoloji, moleküler biyoloji, kardiyoloji, hassas ilaç teslimatı ve sağlık yapay zekası analitiği.'
    },
    writingPrinciples: {
      EN: 'Authors must follow the ICMJE Recommendations for the Conduct, Reporting, Editing, and Publication of Scholarly Work in Medical Journals. Ethical approval letters for clinical trials are strictly required.',
      TR: 'Yazarlar, Tıp Dergilerindeki Akademik Çalışmaların Yürütülmesi, Raporlanması, Düzenlenmesi ve Yayınlanması için ICMJE Tavsiyelerine uymalıdır. Klinik araştırmalar için etik kurul onay mektupları kesinlikle gereklidir.'
    },
    publisher: {
      EN: 'Published by Academia Nexus Medical Press.',
      TR: 'Academia Nexus Tıp Yayınları tarafından yayınlanmaktadır.'
    },
    contact: {
      EN: 'Editorial Office: amm.editor@academianexus.com\nPhone: +90 312 444 0 573',
      TR: 'Editörlük Ofisi: amm.editor@academianexus.com\nTelefon: +90 312 444 0 573'
    },
    editorialBoard: [
      { role: 'Editor-in-Chief', name: 'Prof. Dr. Elizabeth Vance', title: 'Department of Clinical Oncology, Oxford University' },
      { role: 'Assistant Editor', name: 'Dr. Yusuf Yılmaz', title: 'Department of Cardiology, Hacettepe University' }
    ],
    advisoryBoard: [
      { name: 'Dr. Marcus Aurelius', institution: 'European Board of Immunology' }
    ],
    articles: [
      {
        id: 1,
        title: 'CRISPR-Cas9 Gene Therapeutics in Refractory Myeloid Leukemia: A Phase-I Clinical Outcome',
        author: 'Prof. Dr. Elizabeth Vance, Dr. Yusuf Yılmaz',
        doi: '10.1992/amm.2026.1092',
        abstract: 'This Phase-I trial assesses the tolerability and molecular response of gene-edited autologous hematopoietic stem cells in patients diagnosed with refractory myeloid leukemia. Over an 18-month follow-up, 80% of participants exhibited durable target knockdown.',
        pages: '12-30'
      }
    ],
    announcements: [
      {
        type: 'News',
        date: 'July 2026',
        title: 'AMM Achieves Impact Factor of 4.5',
        content: 'We are proud to announce that the Journal Citation Reports (JCR) has updated our official Impact Factor to 4.5, representing a 20% increase year-over-year. Thanks to our authors and reviewers.'
      }
    ]
  },
  {
    id: 'ET',
    slug: 'et',
    name: 'Engineering & Tech Review',
    tr: 'Mühendislik ve Teknoloji İncelemeleri',
    issn: '3012-7822',
    index: 'Crossref Pending',
    indexColor: 'text-amber-700 bg-amber-50 border-amber-200',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    impactFactor: '2.1',
    reviewTime: '8 Weeks Avg',
    acceptRate: '25%',
    articlesCount: '198',
    description: {
      EN: 'Fostering research in civil engineering, computer networks, and robotics advancements.',
      TR: 'İnşaat mühendisliği, bilgisayar ağları ve robotik gelişmelerindeki araştırmaları teşvik eder.'
    },
    about: {
      EN: 'Engineering & Tech Review (ETR) covers a broad spectrum of engineering applications. We specialize in cross-disciplinary technological research that solves complex physical infrastructure and software network challenges.',
      TR: 'Mühendislik ve Teknoloji İncelemeleri (ETR), geniş bir mühendislik uygulamaları yelpazesini kapsar. Karmaşık fiziksel altyapı og yazılım ağı zorluklarını çözen disiplinler arası teknolojik araştırmalarda uzmanlaşıyoruz.'
    },
    aimsScope: {
      EN: 'Scope: Structural mechanics, robotics, smart cities, cybersecurity protocols, high-voltage grids, and machine learning architectures.',
      TR: 'Kapsam: Yapısal mekanik, robotik, akıllı şehirler, siber güvenlik protokolleri, yüksek gerilim şebekeleri ve yapay öğrenme mimarileri.'
    },
    writingPrinciples: {
      EN: 'Submissions must include complete CAD schemas or code repository links if applicable. Formatting must match the official IEEE template.',
      TR: 'Sunumlar, varsa eksiksiz CAD şemalarını veya kod deposu bağlantılarını içermelidir. Biçimlendirme resmi IEEE şablonuyla eşleşmelidir.'
    },
    publisher: {
      EN: 'Academia Nexus Engineering House.',
      TR: 'Academia Nexus Mühendislik Evi.'
    },
    contact: {
      EN: 'Email: etr@academianexus.com',
      TR: 'E-posta: etr@academianexus.com'
    },
    editorialBoard: [
      { role: 'Editor-in-Chief', name: 'Prof. Kenan Demir', title: 'Department of Computer Engineering, METU' }
    ],
    advisoryBoard: [
      { name: 'Dr. Alan Turing III', institution: 'Bletchley Informatics Institute' }
    ],
    articles: [
      {
        id: 1,
        title: 'Deep Reinforcement Learning for Dynamic Traffic Optimization in IoT-Enabled Smart Cities',
        author: 'Prof. Kenan Demir',
        doi: '10.3012/etr.2026.0841',
        abstract: 'This study presents a smart city grid algorithm leveraging deep Q-networks to orchestrate traffic signal timing dynamically. Using simulated traffic congestion indices, we show travel times decrease by 23%.',
        pages: '1-15'
      }
    ],
    announcements: []
  },
  {
    id: 'QC',
    slug: 'qc',
    name: 'Quantum Computing Letters',
    tr: 'Kuantum Hesaplama Mektupları',
    issn: '4451-229X',
    index: 'Scopus Indexed',
    indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    cover: 'https://images.unsplash.com/photo-1614935151651-0bea6508ab6b?q=80&w=600&auto=format&fit=crop',
    impactFactor: '5.2',
    reviewTime: '3 Weeks Avg',
    acceptRate: '10%',
    articlesCount: '120',
    description: {
      EN: 'High-impact letters on quantum cryptography, superconducting qubits, and quantum networks.',
      TR: 'Kuantum kriptografisi, süperiletken kübitler ve kuantum ağları üzerine yüksek etkili mektuplar.'
    },
    about: {
      EN: 'Quantum Computing Letters (QCL) publishes rapid communications on breakthroughs in physical and theoretical quantum systems. We prioritize cutting-edge research in qubit coherence, quantum teleportation protocols, and post-quantum cryptographic standards.',
      TR: 'Kuantum Hesaplama Mektupları (QCL), fiziksel ve teorik kuantum sistemlerindeki atılımlar hakkında hızlı iletişimler yayınlar. Kübit uyumluluğu, kuantum ışınlama protokolleri ve kuantum sonrası kriptografik standartlardaki en son araştırmalara öncelik veriyoruz.'
    },
    aimsScope: {
      EN: 'Scope: Superconducting qubits, ion-trap quantum computers, topological insulators, quantum error correction, and quantum algorithms.',
      TR: 'Kapsam: Süperiletken kübitler, iyon tuzağı kuantum bilgisayarları, topolojik yalıtkanlar, kuantum hata düzeltme ve kuantum algoritmaları.'
    },
    writingPrinciples: {
      EN: 'Papers are strictly limited to 6 pages in length, including references. Standard LaTeX templates must be used.',
      TR: 'Makaleler, referanslar dahil olmak üzere kesinlikle 6 sayfa ile sınırlıdır. Standart LaTeX şablonları kullanılmalıdır.'
    },
    publisher: {
      EN: 'Academia Nexus Physics Press.',
      TR: 'Academia Nexus Fizik Yayınları.'
    },
    contact: {
      EN: 'Email: qcl@academianexus.com',
      TR: 'E-posta: qcl@academianexus.com'
    },
    editorialBoard: [
      { role: 'Editor-in-Chief', name: 'Prof. Dr. Richard Feynman Jr.', title: 'Institute of Quantum Computing, Waterloo' }
    ],
    advisoryBoard: [
      { name: 'Dr. Alice Bobson', institution: 'Quantum Security Alliance' }
    ],
    articles: [
      {
        id: 1,
        title: 'Error Correction Threshold Optimization in Topological Superconducting Qubits',
        author: 'Prof. Dr. Richard Feynman Jr.',
        doi: '10.4451/qcl.2026.0101',
        abstract: 'We report a simulated threshold for error correction utilizing braided Majoranas, showing resilience to thermal noise up to 150mK.',
        pages: '1-6'
      }
    ],
    announcements: []
  },
  {
    id: 'ES',
    slug: 'es',
    name: 'Earth & Environmental Science',
    tr: 'Dünya ve Çevre Bilimleri',
    issn: '5512-8812',
    index: 'Web of Science',
    indexColor: 'text-blue-700 bg-blue-50 border-blue-200',
    cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop',
    impactFactor: '2.9',
    reviewTime: '5 Weeks Avg',
    acceptRate: '20%',
    articlesCount: '289',
    description: {
      EN: 'Focusing on climate modeling, sustainability research, oceanography, and ecological systems.',
      TR: 'İklim modellemesi, sürdürülebilirlik araştırmaları, okyanus bilimi ve ekolojik sistemlere odaklanır.'
    },
    about: {
      EN: 'Earth & Environmental Science (EES) promotes scientific understanding of planetary sustainability. We publish papers on environmental conservation, carbon cycle modeling, atmospheric dynamics, and renewable resource grids.',
      TR: 'Dünya ve Çevre Bilimleri (EES), gezegensel sürdürülebilirliğin bilimsel olarak anlaşılmasını teşvik eder. Çevre koruma, karbon döngüsü modellemesi, atmosferik dinamikler ve yenilenebilir kaynak şebekeleri üzerine makaleler yayınlıyoruz.'
    },
    aimsScope: {
      EN: 'Aims: Ecological restoration, sustainable policy frameworks, ocean warming models, and biodiversity tracking.',
      TR: 'Amaçlar: Ekolojik restorasyon, sürdürülebilir politika çerçeveleri, okyanus ısınma modelleri ve biyolojik çeşitlilik takibi.'
    },
    writingPrinciples: {
      EN: 'Submissions should follow the CSE (Council of Science Editors) citation style. All geographical datasets must be uploaded to open-access repositories.',
      TR: 'Sunumlar CSE (Council of Science Editors) atıf stilini takip etmelidir. Tüm coğrafi veri kümeleri açık erişimli depolara yüklenmelidir.'
    },
    publisher: {
      EN: 'Academia Nexus Earth Press.',
      TR: 'Academia Nexus Dünya Yayınları.'
    },
    contact: {
      EN: 'Email: ees@academianexus.com',
      TR: 'E-posta: ees@academianexus.com'
    },
    editorialBoard: [
      { role: 'Editor-in-Chief', name: 'Prof. Gaia Greenwood', title: 'Climate Change Center, Stockholm' }
    ],
    advisoryBoard: [
      { name: 'Dr. Charles Darwin IV', institution: 'Galapagos Conservation Trust' }
    ],
    articles: [
      {
        id: 1,
        title: 'Spatio-Temporal Mapping of Carbon Sequestration in Boreal Forests Utilizing Sentinel-2 Imagery',
        author: 'Prof. Gaia Greenwood',
        doi: '10.5512/ees.2026.0245',
        abstract: 'Utilizing multispectral satellite imagery, this paper analyzes the carbon absorption rates in Nordic forest ranges over a 5-year study cycle.',
        pages: '12-25'
      }
    ],
    announcements: []
  },
  {
    id: 'AI',
    slug: 'ai',
    name: 'Artificial Intelligence Horizon',
    tr: 'Yapay Zeka Ufku',
    issn: '9912-445X',
    index: 'Scopus Indexed',
    indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
    impactFactor: '6.4',
    reviewTime: '4 Weeks Avg',
    acceptRate: '14%',
    articlesCount: '456',
    description: {
      EN: 'Deep learning breakthroughs, neural networks, natural language processing, and robotic vision.',
      TR: 'Derin öğrenme atılımları, sinir ağları, doğal dil işleme ve robotik vizyon.'
    },
    about: {
      EN: 'Artificial Intelligence Horizon (AIH) is at the cutting edge of machine intelligence literature. We feature innovative models in deep learning, cognitive robotics, agentic systems, ethics in computing, and natural language understanding.',
      TR: 'Yapay Zeka Ufku (AIH), makine zekası literatürünün en ön saflarında yer almaktadır. Derin öğrenme, bilişsel robotik, etmen tabanlı sistemler, hesaplama etiği ve doğal dil anlama konularında yenilikçi modellere yer veriyoruz.'
    },
    aimsScope: {
      EN: 'Aims & Scope: Neural architecture search, reinforcement learning safety, generative transformers, and computer vision alignment.',
      TR: 'Amaç & Kapsam: Sinirsel mimari arama, pekiştirmeli öğrenme güvenliği, üretken transformatörler og bilgisayarlı görü hizalaması.'
    },
    writingPrinciples: {
      EN: 'Pre-trained weights and training scripts must be made public under MIT or Apache 2.0 license. References should be in ACM format.',
      TR: 'Önceden eğitilmiş ağırlıklar ve eğitim betikleri MIT veya Apache 2.0 lisansı altında kamuya açıklanmalıdır. Referanslar ACM formatında olmalıdır.'
    },
    publisher: {
      EN: 'Academia Nexus Intelligent Press.',
      TR: 'Academia Nexus Akıllı Yayıncılık.'
    },
    contact: {
      EN: 'Email: aih.editorial@academianexus.com',
      TR: 'E-posta: aih.editorial@academianexus.com'
    },
    editorialBoard: [
      { role: 'Editor-in-Chief', name: 'Prof. Alan Turing Jr.', title: 'Institute for Advanced Machine Learning, Cambridge' }
    ],
    advisoryBoard: [
      { name: 'Dr. Ada Lovelace II', institution: 'Algorithmic Safety Initiative' }
    ],
    articles: [
      {
        id: 1,
        title: 'Scalable Alignment in Large Language Models via Multi-Agent Reward Shifting',
        author: 'Prof. Alan Turing Jr.',
        doi: '10.9912/aih.2026.0410',
        abstract: 'We outline an alignment technique that coordinates several helper agent models to shift reinforcement learning rewards dynamically, mitigating drift.',
        pages: '12-29'
      }
    ],
    announcements: []
  }
];

export const getJournalBySlug = async (slug: string): Promise<MockJournal | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return MOCK_JOURNALS.find((j) => j.slug === slug.toLowerCase() || j.id.toLowerCase() === slug.toLowerCase());
};
