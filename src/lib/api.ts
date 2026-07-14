import { supabase } from './supabase';

/**
 * Example API Service to show the team how to connect to the Supabase tables
 */

// Fetch all journals
export const getJournals = async () => {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching journals:', error);
    throw error;
  }
  
  return data;
};

// Fetch a specific journal by ID
export const getJournalById = async (id: string) => {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching journal:', error);
    throw error;
  }
  
  return data;
};

// Fetch public submissions (Articles)
export const getSubmissions = async () => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, journals(name), profiles!author_id(name_surname)')
    .eq('status', 'published') // Example filter
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
  
  return data;
};
