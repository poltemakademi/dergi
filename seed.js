require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ocpctsqbvmnrtdilgyau.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cCnLkNzEqW_KfxLfMjKPHw_zN2s45Gs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const { data, error } = await supabase.from('journals').insert({ name: 'Demo Journal' }).select().single();
  if (error) {
    console.error('Error inserting journal:', error);
  } else {
    console.log('Inserted journal:', data);
  }
}

seed();
