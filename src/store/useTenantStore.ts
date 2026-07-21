import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { MOCK_JOURNALS } from '../lib/mockData';

export interface TenantMetadata {
  id: string;
  slug: string;
  name: string;
  tr?: string;
  issn?: string;
  index?: string;
  indexColor?: string;
  cover?: string;
  impactFactor?: string;
  reviewTime?: string;
  acceptRate?: string;
  articlesCount?: string;
  description?: { EN: string; TR: string };
  about?: { EN: string; TR: string };
  aimsScope?: { EN: string; TR: string };
  writingPrinciples?: { EN: string; TR: string };
  publisher?: { EN: string; TR: string };
  contact?: { EN: string; TR: string };
  editorialBoard?: Array<{ role: string; name: string; title: string }>;
  advisoryBoard?: Array<{ name: string; institution: string }>;
  primaryColor?: string;
  secondaryColor?: string;
  featuredArticles?: Array<any>;
  announcements?: Array<{ type?: string; date?: string; title: string; content: string }>;
}

export interface TenantArticle {
  id: string | number;
  title: string;
  titleEn?: string;
  titleTr?: string;
  author?: string;
  authors?: Array<{ name: string; affiliation?: string; orcid?: string }>;
  doi?: string;
  abstract?: string;
  abstractEn?: string;
  abstractTr?: string;
  pages?: string;
  published?: string;
  published_at?: string;
  issue?: string;
  keywords?: string[];
  keywordsEn?: string[];
  keywordsTr?: string[];
  pdf_url?: string;
  downloads_count?: number;
  status?: string;
  created_at?: string;
}

export interface TenantIssue {
  id: string;
  journal_id: string;
  issue_title_native: string;
  issue_title_english: string;
  publication_place?: string;
  issue_volume?: string;
  issue_number?: string;
  published_at?: string;
  articles?: Array<TenantArticle>;
}

export interface TenantPage {
  id: string;
  journal_id: string;
  page_title: string;
  page_alias: string;
  page_content: string;
}

interface TenantState {
  metadata: TenantMetadata | null;
  currentIssue: TenantIssue | null;
  archives: TenantIssue[];
  activeArticle: TenantArticle | null;
  pageContent: TenantPage | null;
  isLoading: boolean;
  error: string | null;

  fetchMetadata: (slug: string) => Promise<void>;
  fetchCurrentIssue: (slug: string) => Promise<void>;
  fetchArchives: (slug: string) => Promise<void>;
  fetchArticleDetail: (slug: string, id: string) => Promise<void>;
  fetchPageContent: (slug: string, alias: string) => Promise<void>;
  trackDownload: (id: string | number) => Promise<void>;
}

export const useTenantStore = create<TenantState>((set) => ({
  metadata: null,
  currentIssue: null,
  archives: [],
  activeArticle: null,
  pageContent: null,
  isLoading: false,
  error: null,

  fetchMetadata: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      // Detect if the "slug" is actually a UUID (journal ID from the URL)
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID = UUID_REGEX.test(slug);

      let fetched: any = null;

      if (isUUID) {
        // Fetch directly by journal ID
        const { data: byId, error: idErr } = await supabase
          .from('journals')
          .select('*')
          .eq('id', slug)
          .maybeSingle();

        if (!idErr && byId) {
          fetched = byId;
        }
      } else {
        // Try to find by slug field if it exists
        const { data: bySlug, error: slugErr } = await supabase
          .from('journals')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!slugErr && bySlug) {
          fetched = bySlug;
        } else {
          // Fallback: scan all journals by name
          const { data: allJournals } = await supabase.from('journals').select('*');
          if (allJournals) {
            fetched = allJournals.find(
              (j: any) =>
                (j.slug && j.slug.toLowerCase() === slug.toLowerCase()) ||
                (j.name && j.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase())
            );
          }
        }
      }

      // Try to find a matching mock journal by ID, slug, or name (case-insensitive)
      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase() ||
          mj.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
          mj.id.toLowerCase() === (fetched?.id || '').toString().toLowerCase() ||
          mj.name.toLowerCase() === (fetched?.name || '').toString().toLowerCase()
      );

      const mergedMetadata: TenantMetadata = {
        id: fetched?.id || mockMatch?.id || 'JOURNAL',
        slug: fetched?.slug || fetched?.id || mockMatch?.slug || slug,
        name: fetched?.name || mockMatch?.name || 'Academic Journal',
        tr: fetched?.tr || fetched?.name || mockMatch?.tr || 'Akademik Dergi',
        issn: fetched?.issn || mockMatch?.issn || 'XXXX-XXXX',
        index: fetched?.index || mockMatch?.index || 'Crossref Indexed',
        indexColor: fetched?.indexColor || mockMatch?.indexColor || 'text-slate-700 bg-slate-50 border-slate-200',
        cover: fetched?.cover || fetched?.cover_image || mockMatch?.cover || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
        impactFactor: fetched?.impactFactor || mockMatch?.impactFactor || '0.0',
        reviewTime: fetched?.reviewTime || mockMatch?.reviewTime || '4 Weeks Avg',
        acceptRate: fetched?.acceptRate || mockMatch?.acceptRate || '20%',
        articlesCount: fetched?.articlesCount || mockMatch?.articlesCount || '0',
        primaryColor: fetched?.primaryColor || fetched?.brand_color || '#4f46e5', // Default Indigo-600
        secondaryColor: fetched?.secondaryColor || '#6366f1',
        description: fetched?.description || mockMatch?.description || { EN: fetched?.name || '', TR: fetched?.name || '' },
        about: fetched?.about || mockMatch?.about || { 
          EN: `Welcome to the official portal of ${fetched?.name || 'Academic Journal'}.`, 
          TR: `${fetched?.name || 'Akademik Dergi'} resmi portalına hoş geldiniz.` 
        },
        aimsScope: fetched?.aimsScope || mockMatch?.aimsScope || { EN: 'Aims and scope details will be added.', TR: 'Amaç ve kapsam detayları eklenecektir.' },
        writingPrinciples: fetched?.writingPrinciples || mockMatch?.writingPrinciples || { EN: 'Writing principles will be added.', TR: 'Yazım kuralları eklenecektir.' },
        publisher: fetched?.publisher || mockMatch?.publisher || { EN: 'Publisher details will be added.', TR: 'Yayıncı bilgileri eklenecektir.' },
        contact: fetched?.contact || mockMatch?.contact || { EN: 'Contact details will be added.', TR: 'İletişim bilgileri eklenecektir.' },
        editorialBoard: fetched?.editorialBoard || mockMatch?.editorialBoard || [],
        advisoryBoard: fetched?.advisoryBoard || mockMatch?.advisoryBoard || [],
        featuredArticles: fetched?.featuredArticles || mockMatch?.articles || []
      };

      set({ metadata: mergedMetadata, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch dynamic tenant metadata, using mock fallback:', err.message || err);
      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase() ||
          mj.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
      ) || MOCK_JOURNALS[0];

      const fallbackMetadata: TenantMetadata = {
        id: mockMatch.id,
        slug: mockMatch.slug,
        name: mockMatch.name,
        tr: mockMatch.tr,
        issn: mockMatch.issn,
        index: mockMatch.index,
        indexColor: mockMatch.indexColor,
        cover: mockMatch.cover,
        impactFactor: mockMatch.impactFactor,
        reviewTime: mockMatch.reviewTime,
        acceptRate: mockMatch.acceptRate,
        articlesCount: mockMatch.articlesCount,
        primaryColor: '#4f46e5',
        secondaryColor: '#6366f1',
        description: mockMatch.description,
        about: mockMatch.about,
        aimsScope: mockMatch.aimsScope,
        writingPrinciples: mockMatch.writingPrinciples,
        publisher: mockMatch.publisher,
        contact: mockMatch.contact,
        editorialBoard: mockMatch.editorialBoard,
        advisoryBoard: mockMatch.advisoryBoard,
        featuredArticles: mockMatch.articles
      };

      set({ metadata: fallbackMetadata, isLoading: false });
    }
  },

  fetchCurrentIssue: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID = UUID_REGEX.test(slug);

      let journalId: string | null = null;

      if (isUUID) {
        journalId = slug;
      } else {
        const { data: journal } = await supabase.from('journals').select('id, name, slug').eq('slug', slug).maybeSingle();
        if (journal) {
          journalId = journal.id;
        } else {
          const { data: all } = await supabase.from('journals').select('id, name, slug');
          const found = all?.find(
            (j: any) =>
              (j.slug && j.slug.toLowerCase() === slug.toLowerCase()) ||
              (j.name && j.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase())
          );
          journalId = found?.id;
        }
      }

      if (!journalId) throw new Error('Journal not found');

      const { data: issues, error: issueErr } = await supabase
        .from('issues')
        .select('*')
        .eq('journal_id', journalId)
        .order('published_at', { ascending: false })
        .limit(1);

      if (issueErr) throw issueErr;
      const latestIssue = issues && issues[0];

      if (latestIssue) {
        const { data: issueArticles, error: artErr } = await supabase
          .from('issue_articles')
          .select('*, submissions(*, submission_authors(*))')
          .eq('issue_id', latestIssue.id);

        const mockMatch = MOCK_JOURNALS.find(
          (mj) => mj.slug.toLowerCase() === slug.toLowerCase() ||
            mj.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
            mj.id.toLowerCase() === journalId?.toLowerCase()
        );

        const articles = !artErr && issueArticles ? issueArticles.map((ia: any) => {
          const art = ia.submissions;
          const matchedMockArt = mockMatch?.articles.find(
            (ma: any) => ma.title.toLowerCase() === (art?.title || '').toLowerCase()
          );

          return {
            id: art?.id || ia.submission_id,
            title: art?.title || matchedMockArt?.title || 'Untitled Article',
            titleEn: art?.title || matchedMockArt?.title || 'Untitled Article',
            titleTr: art?.title || matchedMockArt?.title || 'İsimsiz Makale',
            author: art?.submission_authors?.[0]?.display_name || matchedMockArt?.author || 'Unknown Author',
            authors: art?.submission_authors?.map((a: any) => ({
              name: a.display_name,
              affiliation: a.institution,
              orcid: a.orcid_id,
            })) || [{ name: matchedMockArt?.author || 'Unknown Author', affiliation: 'Academic Institution' }],
            doi: art?.doi || matchedMockArt?.doi || `10.2667/ijar.2026.${Math.floor(Math.random() * 1000) + 1042}`,
            pages: art?.pages || matchedMockArt?.pages || '1-10',
            abstract: art?.abstract || matchedMockArt?.abstract || '',
            abstractEn: art?.abstract_en || matchedMockArt?.abstract || '',
            abstractTr: art?.abstract_tr || matchedMockArt?.abstract || '',
            keywords: art?.keywords || matchedMockArt?.keywords || ['Research', 'Science'],
            pdf_url: art?.pdf_url || matchedMockArt?.pdf_url || '#',
            status: art?.status || 'PUBLISHED',
            created_at: art?.created_at,
          };
        }) : [];

        set({
          currentIssue: {
            id: latestIssue.id,
            journal_id: latestIssue.journal_id,
            issue_title_native: latestIssue.issue_title_native,
            issue_title_english: latestIssue.issue_title_english,
            issue_volume: latestIssue.issue_volume,
            issue_number: latestIssue.issue_number,
            published_at: latestIssue.published_at,
            articles,
          },
          isLoading: false
        });
      } else {
        set({ currentIssue: null, isLoading: false });
      }
    } catch (err: any) {
      console.warn('Failed to fetch latest issue, using mock fallback:', err.message || err);
      // Map mock match articles as fallback
      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase() ||
          mj.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
      );

      if (mockMatch) {
        const fallbackIssue: TenantIssue = {
          id: 'latest-issue-mock',
          journal_id: mockMatch.id,
          issue_title_native: 'Son Sayı',
          issue_title_english: 'Latest Issue',
          issue_volume: '5',
          issue_number: '1',
          published_at: new Date().toISOString(),
          articles: mockMatch.articles.map((art) => ({
            id: art.id,
            title: art.title,
            titleEn: art.title,
            titleTr: art.title,
            author: art.author,
            authors: [{ name: art.author, affiliation: 'Academic Institution' }],
            doi: art.doi,
            abstract: art.abstract,
            abstractEn: art.abstract,
            abstractTr: art.abstract,
            pages: art.pages,
            published: 'June 2026',
            issue: 'Vol. 5 No. 1 (2026)',
            keywords: ['Academic', 'Research']
          }))
        };
        set({ currentIssue: fallbackIssue, isLoading: false });
      } else {
        // Fallback for custom DB journal when fetch fails or database issue is missing
        const fallbackIssue: TenantIssue = {
          id: 'latest-issue-mock',
          journal_id: slug,
          issue_title_native: 'Son Sayı',
          issue_title_english: 'Latest Issue',
          issue_volume: '1',
          issue_number: '1',
          published_at: new Date().toISOString(),
          articles: [
            {
              id: 'mock-art-1',
              title: 'Giriş Makalesi',
              titleEn: 'Introductory Article',
              titleTr: 'Giriş Makalesi',
              author: 'Yazar Adı Soyadı',
              authors: [{ name: 'Yazar Adı Soyadı', affiliation: 'Poltem Akademi' }],
              doi: `10.2667/poltem.2026.1001`,
              abstract: 'Bu makale test ve önizleme amacıyla eklenmiştir.',
              abstractEn: 'This article is added for testing and preview purposes.',
              abstractTr: 'Bu makale test ve önizleme amacıyla eklenmiştir.',
              pages: '1-10',
              published: 'Temmuz 2026',
              issue: 'Cilt 1 Sayı 1 (2026)',
              keywords: ['Academic', 'Research']
            }
          ]
        };
        set({ currentIssue: fallbackIssue, isLoading: false });
      }
    }
  },

  fetchArchives: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID = UUID_REGEX.test(slug);

      let journalId: string | null = null;

      if (isUUID) {
        journalId = slug;
      } else {
        const { data: journal } = await supabase.from('journals').select('id, name, slug').eq('slug', slug).maybeSingle();
        if (journal) {
          journalId = journal.id;
        } else {
          const { data: all } = await supabase.from('journals').select('id, name, slug');
          const found = all?.find(
            (j: any) =>
              (j.slug && j.slug.toLowerCase() === slug.toLowerCase()) ||
              (j.name && j.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase())
          );
          journalId = found?.id;
        }
      }

      if (!journalId) throw new Error('Journal not found');

      // Fetch issues along with count/details of linked issue articles to display counts in the archives UI
      const { data: issues, error: issueErr } = await supabase
        .from('issues')
        .select('*, issue_articles(id)')
        .eq('journal_id', journalId)
        .order('published_at', { ascending: false });

      if (issueErr) throw issueErr;
      
      const mappedIssues = (issues || []).map((issue: any) => ({
        ...issue,
        articles: issue.issue_articles || []
      }));

      set({ archives: mappedIssues, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch archives:', err.message || err);
      set({ archives: [], error: err.message || 'Failed to fetch archives', isLoading: false });
    }
  },

  fetchArticleDetail: async (slug: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: art, error: artErr } = await supabase
        .from('submissions')
        .select('*, submission_authors(*)')
        .eq('id', id)
        .maybeSingle();

      if (artErr) throw artErr;
      if (!art) throw new Error('Article not found');

      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase() ||
          mj.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
      );
      
      const matchedMockArt = mockMatch?.articles.find(
        (ma: any) => ma.title.toLowerCase() === (art?.title || '').toLowerCase() || ma.id.toString() === id.toString()
      );

      const articleDetail: TenantArticle = {
        id: art.id,
        title: art.title,
        titleEn: art.title,
        titleTr: art.title,
        author: art.submission_authors?.[0]?.display_name || matchedMockArt?.author || 'Unknown Author',
        authors: art.submission_authors?.map((a: any) => ({
          name: a.display_name,
          affiliation: a.institution,
          orcid: a.orcid_id,
        })) || [{ name: matchedMockArt?.author || 'Unknown Author', affiliation: 'Academic Institution' }],
        status: art.status,
        created_at: art.created_at,
        abstract: art.abstract || matchedMockArt?.abstract || '',
        abstractEn: art.abstract_en || matchedMockArt?.abstract || '',
        abstractTr: art.abstract_tr || matchedMockArt?.abstract || '',
        keywordsEn: art.keywords_en || matchedMockArt?.keywords || ['Research', 'Science'],
        keywordsTr: art.keywords_tr || matchedMockArt?.keywords || ['Araştırma', 'Bilim'],
        doi: art.doi || matchedMockArt?.doi || `10.2667/ijar.2026.1042`,
        pages: art.pages || matchedMockArt?.pages || '1-10',
        published: art.published || 'July 15, 2026',
        issue: art.issue || 'Vol. 5 No. 1 (2026)',
        pdf_url: art.pdf_url || matchedMockArt?.pdf_url || '#',
      };

      set({ activeArticle: articleDetail, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch article details, using mock fallback:', err.message || err);
      
      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase() ||
          mj.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
      );
      
      if (mockMatch) {
        const matchedArt = mockMatch.articles.find((a) => a.id.toString() === id.toString()) || mockMatch.articles[0];

        const fallbackArt: TenantArticle = {
          id: matchedArt.id,
          title: matchedArt.title,
          titleEn: matchedArt.title,
          titleTr: matchedArt.title,
          author: matchedArt.author,
          authors: [
            { name: matchedArt.author, affiliation: 'Institution Name', orcid: '0000-0000-0000-0000' }
          ],
          doi: matchedArt.doi,
          abstract: matchedArt.abstract,
          abstractEn: matchedArt.abstract,
          abstractTr: matchedArt.abstract,
          pages: matchedArt.pages,
          published: 'July 15, 2026',
          issue: 'Vol. 5 No. 1 (2026)',
          keywordsEn: ['Research', 'Science'],
          keywordsTr: ['Araştırma', 'Bilim']
        };
        set({ activeArticle: fallbackArt, isLoading: false });
      } else {
        const fallbackArt: TenantArticle = {
          id: id,
          title: 'Örnek Makale Başlığı',
          titleEn: 'Sample Article Title',
          titleTr: 'Örnek Makale Başlığı',
          author: 'Yazar Adı',
          authors: [
            { name: 'Yazar Adı', affiliation: 'Poltem Akademi', orcid: '0000-0000-0000-0000' }
          ],
          doi: `10.2667/poltem.2026.${id}`,
          abstract: 'Bu makale detayı test ve önizleme amacıyla sunulmuştur.',
          abstractEn: 'This article detail is provided for testing and preview purposes.',
          abstractTr: 'Bu makale detayı test ve önizleme amacıyla sunulmuştur.',
          pages: '1-10',
          published: 'Temmuz 2026',
          issue: 'Cilt 1 Sayı 1 (2026)',
          keywordsEn: ['Research', 'Preview'],
          keywordsTr: ['Araştırma', 'Önizleme']
        };
        set({ activeArticle: fallbackArt, isLoading: false });
      }
    }
  },

  fetchPageContent: async (slug: string, alias: string) => {
    set({ isLoading: true, error: null });
    try {
      let journalId = null;
      const { data: journal } = await supabase.from('journals').select('id, name, slug').eq('slug', slug).maybeSingle();
      if (journal) {
        journalId = journal.id;
      } else {
        const { data: all } = await supabase.from('journals').select('id, name, slug');
        const found = all?.find(
          (j: any) =>
            (j.slug && j.slug.toLowerCase() === slug.toLowerCase()) ||
            (j.name && j.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase())
        );
        journalId = found?.id;
      }

      if (!journalId) throw new Error('Journal not found');

      const { data: page, error: pageErr } = await supabase
        .from('pages')
        .select('*')
        .eq('journal_id', journalId)
        .eq('page_alias', alias)
        .maybeSingle();

      if (pageErr) throw pageErr;
      set({ pageContent: page || null, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch CMS page content:', err.message || err);
      set({ pageContent: null, error: err.message || 'Failed to fetch page content', isLoading: false });
    }
  },

  trackDownload: async (id: string | number) => {
    try {
      await supabase.rpc('increment_downloads', { article_id: id });
    } catch (err: any) {
      console.warn('Failed to track download metric:', err.message || err);
    }
  }
}));
