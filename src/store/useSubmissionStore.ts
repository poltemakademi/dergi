import { create } from 'zustand';

interface Metadata {
  titleEn: string;
  titleTr: string;
  abstractEn: string;
  abstractTr: string;
  keywordsEn: string;
  keywordsTr: string;
}

interface Author {
  id: string;
  name: string;
  email: string;
  institution: string;
  orcid: string;
  isCorresponding: boolean;
}

interface SubmissionState {
  currentStep: number;
  metadata: Metadata;
  authors: Author[];
  fileUploaded: boolean;
  
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  updateMetadata: (data: Partial<Metadata>) => void;
  addAuthor: (author: Author) => void;
  removeAuthor: (id: string) => void;
  setFileUploaded: (status: boolean) => void;
  reset: () => void;
}

const initialMetadata: Metadata = {
  titleEn: '', titleTr: '',
  abstractEn: '', abstractTr: '',
  keywordsEn: '', keywordsTr: '',
};

export const useSubmissionStore = create<SubmissionState>((set) => ({
  currentStep: 1,
  metadata: initialMetadata,
  authors: [],
  fileUploaded: false,

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  updateMetadata: (data) => set((state) => ({ metadata: { ...state.metadata, ...data } })),
  addAuthor: (author) => set((state) => ({ authors: [...state.authors, author] })),
  removeAuthor: (id) => set((state) => ({ authors: state.authors.filter(a => a.id !== id) })),
  setFileUploaded: (status) => set({ fileUploaded: status }),
  reset: () => set({ currentStep: 1, metadata: initialMetadata, authors: [], fileUploaded: false }),
}));
