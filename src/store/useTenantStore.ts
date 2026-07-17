import { create } from 'zustand';
import { apiClient } from '../services/api/client';
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
      const response = await apiClient.get(`/api/tenant/${slug}/metadata`);
      const fetched = response.data;
      
      // Load fallback mock match to ensure UI remains complete and visually premium
      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase()
      );

      const mergedMetadata: TenantMetadata = {
        id: fetched?.id || mockMatch?.id || 'JOURNAL',
        slug: fetched?.slug || slug,
        name: fetched?.name || mockMatch?.name || '',
        tr: fetched?.tr || mockMatch?.tr || fetched?.name || '',
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
        description: fetched?.description || mockMatch?.description || { EN: '', TR: '' },
        about: fetched?.about || mockMatch?.about || { EN: '', TR: '' },
        aimsScope: fetched?.aimsScope || mockMatch?.aimsScope || { EN: '', TR: '' },
        writingPrinciples: fetched?.writingPrinciples || mockMatch?.writingPrinciples || { EN: '', TR: '' },
        publisher: fetched?.publisher || mockMatch?.publisher || { EN: '', TR: '' },
        contact: fetched?.contact || mockMatch?.contact || { EN: '', TR: '' },
        editorialBoard: fetched?.editorialBoard || mockMatch?.editorialBoard || [],
        advisoryBoard: fetched?.advisoryBoard || mockMatch?.advisoryBoard || [],
        featuredArticles: fetched?.featuredArticles || mockMatch?.articles || []
      };

      set({ metadata: mergedMetadata, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch dynamic tenant metadata, using mock fallback:', err.message || err);
      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase()
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
      const response = await apiClient.get(`/api/tenant/${slug}/issues/latest`);
      set({ currentIssue: response.data, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch latest issue, using mock fallback:', err.message || err);
      // Map mock match articles as fallback
      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase()
      ) || MOCK_JOURNALS[0];

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
    }
  },

  fetchArchives: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/tenant/${slug}/issues/archive`);
      set({ archives: response.data, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch archives, using mock fallback:', err.message || err);
      const fallbackArchives: TenantIssue[] = [
        {
          id: 'mock-vol-5',
          journal_id: 'mock',
          issue_title_native: 'Cilt 5, Sayı 2',
          issue_title_english: 'Volume 5, Issue 2',
          issue_volume: '5',
          issue_number: '2',
          published_at: '2025-12-01',
          articles: []
        },
        {
          id: 'mock-vol-5-1',
          journal_id: 'mock',
          issue_title_native: 'Cilt 5, Sayı 1',
          issue_title_english: 'Volume 5, Issue 1',
          issue_volume: '5',
          issue_number: '1',
          published_at: '2025-06-01',
          articles: []
        }
      ];
      set({ archives: fallbackArchives, isLoading: false });
    }
  },

  fetchArticleDetail: async (slug: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/tenant/${slug}/articles/${id}`);
      set({ activeArticle: response.data, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch article details, using mock fallback:', err.message || err);
      
      const mockMatch = MOCK_JOURNALS.find(
        (mj) => mj.slug.toLowerCase() === slug.toLowerCase()
      ) || MOCK_JOURNALS[0];
      
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
    }
  },

  fetchPageContent: async (slug: string, alias: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/tenant/${slug}/pages/${alias}`);
      set({ pageContent: response.data, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch CMS page content, using mock fallback:', err.message || err);
      
      const fallbackPage: TenantPage = {
        id: 'mock-page',
        journal_id: 'mock',
        page_title: alias === 'policies' ? 'Ethical Guidelines & Policies' : 'Editorial Board',
        page_alias: alias,
        page_content: alias === 'policies' 
          ? `
            <h3>1. Double-Blind Peer Review Policy</h3>
            <p>This journal employs a strict double-blind peer review process...</p>
            <h3>2. Open Access Policy</h3>
            <p>This journal provides immediate open access to its content...</p>
          `
          : `
            <div class="space-y-6">
              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Editor-in-Chief</h4>
                <h3 class="text-lg font-bold text-slate-900">Doç. Dr. Hüsamettin KARATAŞ</h3>
              </div>
            </div>
          `
      };
      
      set({ pageContent: fallbackPage, isLoading: false });
    }
  },

  trackDownload: async (id: string | number) => {
    try {
      await apiClient.post(`/api/metrics/download/${id}`);
    } catch (err: any) {
      console.warn('Failed to track download metric:', err.message || err);
    }
  }
}));
