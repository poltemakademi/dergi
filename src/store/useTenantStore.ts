import { create } from 'zustand';
import { apiClient } from '../services/api/client';

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
      
      const mergedMetadata: TenantMetadata = {
        id: fetched?.id || 'JOURNAL',
        slug: fetched?.slug || slug,
        name: fetched?.name || '',
        tr: fetched?.tr || fetched?.name || '',
        issn: fetched?.issn || 'XXXX-XXXX',
        index: fetched?.index || 'Crossref Indexed',
        indexColor: fetched?.indexColor || 'text-slate-700 bg-slate-50 border-slate-200',
        cover: fetched?.cover || fetched?.cover_image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
        impactFactor: fetched?.impactFactor || '0.0',
        reviewTime: fetched?.reviewTime || '4 Weeks Avg',
        acceptRate: fetched?.acceptRate || '20%',
        articlesCount: fetched?.articlesCount || '0',
        primaryColor: fetched?.primaryColor || fetched?.brand_color || '#4f46e5',
        secondaryColor: fetched?.secondaryColor || '#6366f1',
        description: fetched?.description || { EN: '', TR: '' },
        about: fetched?.about || { EN: '', TR: '' },
        aimsScope: fetched?.aimsScope || { EN: '', TR: '' },
        writingPrinciples: fetched?.writingPrinciples || { EN: '', TR: '' },
        publisher: fetched?.publisher || { EN: '', TR: '' },
        contact: fetched?.contact || { EN: '', TR: '' },
        editorialBoard: fetched?.editorialBoard || [],
        advisoryBoard: fetched?.advisoryBoard || [],
        featuredArticles: fetched?.featuredArticles || [],
        announcements: fetched?.announcements || []
      };

      set({ metadata: mergedMetadata, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch dynamic tenant metadata:', err.message || err);
      set({ metadata: null, error: err.message || 'Failed to fetch metadata', isLoading: false });
    }
  },

  fetchCurrentIssue: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/tenant/${slug}/issues/latest`);
      set({ currentIssue: response.data, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch latest issue:', err.message || err);
      set({ currentIssue: null, error: err.message || 'Failed to fetch latest issue', isLoading: false });
    }
  },

  fetchArchives: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/tenant/${slug}/issues/archive`);
      set({ archives: response.data, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch archives:', err.message || err);
      set({ archives: [], error: err.message || 'Failed to fetch archives', isLoading: false });
    }
  },

  fetchArticleDetail: async (slug: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/tenant/${slug}/articles/${id}`);
      set({ activeArticle: response.data, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch article details:', err.message || err);
      set({ activeArticle: null, error: err.message || 'Failed to fetch article', isLoading: false });
    }
  },

  fetchPageContent: async (slug: string, alias: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/tenant/${slug}/pages/${alias}`);
      set({ pageContent: response.data, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch CMS page content:', err.message || err);
      set({ pageContent: null, error: err.message || 'Failed to fetch page content', isLoading: false });
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
