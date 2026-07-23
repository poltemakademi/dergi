import { supabase } from '../lib/supabaseClient';
import { MOCK_JOURNALS } from '../lib/mockData';

// Map mock IDs to fixed, valid UUIDs for schema compliance
const JOURNAL_UUIDS: { [key: string]: string } = {
  PA: 'f0a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c',
  JS: 'a3b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d',
  AM: 'b4c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e',
  ET: 'c5d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
  QC: 'd6e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a',
  ES: 'e7f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b',
  AI: 'f8a5b6c7-d8e9-0f1a-2b3c-4d5e6f7a8b9c'
};

const AUTHOR_UUIDS: { [key: string]: string } = {
  PA: 'e0000000-0000-0000-0000-000000000000',
  JS: 'e1111111-1111-1111-1111-111111111111',
  AM: 'e2222222-2222-2222-2222-222222222222',
  ET: 'e3333333-3333-3333-3333-333333333333',
  QC: 'e4444444-4444-4444-4444-444444444444',
  ES: 'e5555555-5555-5555-5555-555555555555',
  AI: 'e6666666-6666-6666-6666-666666666666'
};

export async function seedSupabaseDatabase() {
  try {
    // 1. Check if database already has journals
    const { data: existingJournals, error: checkError } = await supabase
      .from('journals')
      .select('id')
      .limit(1);

    if (checkError) {
      console.warn('Seeder: Error checking existing journals. Database connection might be missing.', checkError.message);
      return;
    }

    if (existingJournals && existingJournals.length > 0) {
      console.log('Seeder: Database is already seeded.');
      return;
    }

    console.log('Seeder: Starting database seeding...');

    // 2. Insert Journals
    const journalsToInsert = MOCK_JOURNALS.map((j) => ({
      id: JOURNAL_UUIDS[j.id] || crypto.randomUUID(),
      name: j.name,
      created_at: new Date().toISOString()
    }));

    const { error: journalErr } = await supabase.from('journals').insert(journalsToInsert);
    if (journalErr) throw new Error(`Journals seed error: ${journalErr.message}`);
    console.log('Seeder: Seeded journals.');

    // For each mock journal, seed its issues, articles, pages
    for (const j of MOCK_JOURNALS) {
      const journalId = JOURNAL_UUIDS[j.id];
      if (!journalId) continue;

      // 3. Seed Issues
      const latestIssueId = crypto.randomUUID();
      const archiveIssue1Id = crypto.randomUUID();
      const archiveIssue2Id = crypto.randomUUID();

      const issuesToInsert = [
        {
          id: latestIssueId,
          journal_id: journalId,
          issue_title_native: 'Son Sayı (Güz)',
          issue_title_english: 'Latest Issue (Autumn)',
          publication_place: 'Ankara, Turkey',
          issue_volume: '5',
          issue_number: '1',
          published_at: new Date().toISOString()
        },
        {
          id: archiveIssue1Id,
          journal_id: journalId,
          issue_title_native: 'Cilt 4, Sayı 2',
          issue_title_english: 'Volume 4, Issue 2',
          publication_place: 'Ankara, Turkey',
          issue_volume: '4',
          issue_number: '2',
          published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString() // 6 months ago
        },
        {
          id: archiveIssue2Id,
          journal_id: journalId,
          issue_title_native: 'Cilt 4, Sayı 1',
          issue_title_english: 'Volume 4, Issue 1',
          publication_place: 'Ankara, Turkey',
          issue_volume: '4',
          issue_number: '1',
          published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString() // 1 year ago
        }
      ];

      const { error: issueErr } = await supabase.from('issues').insert(issuesToInsert);
      if (issueErr) throw new Error(`Issues seed error: ${issueErr.message}`);

      // 4. Seed Submissions & Authors
      const authorId = AUTHOR_UUIDS[j.id];

      // Add mock articles for this journal
      for (let index = 0; index < j.articles.length; index++) {
        const art = j.articles[index];
        const submissionId = crypto.randomUUID();

        // Determine which issue to link to (spread them out)
        const issueId = index === 0 ? latestIssueId : index === 1 ? archiveIssue1Id : archiveIssue2Id;

        // Insert Submission
        const { error: subErr } = await supabase.from('submissions').insert({
          id: submissionId,
          journal_id: journalId,
          author_id: authorId,
          title: art.title,
          status: 'PUBLISHED',
          created_at: new Date().toISOString()
        });
        if (subErr) throw new Error(`Submissions seed error: ${subErr.message}`);

        // Insert Submission Author
        const { error: authorErr } = await supabase.from('submission_authors').insert({
          id: crypto.randomUUID(),
          submission_id: submissionId,
          display_name: art.author,
          institution: 'Poltem Akademi Research Institute',
          email: `${art.author.toLowerCase().replace(/\s+/g, '')}@poltem-akademi.org`,
          orcid_id: '0000-0002-1825-0097',
          sort_order: 0,
          created_at: new Date().toISOString()
        });
        if (authorErr) throw new Error(`Submission Authors seed error: ${authorErr.message}`);

        // Link Submission to Issue
        const { error: linkErr } = await supabase.from('issue_articles').insert({
          id: crypto.randomUUID(),
          issue_id: issueId,
          submission_id: submissionId,
          sort_order: index,
          created_at: new Date().toISOString()
        });
        if (linkErr) throw new Error(`Issue Articles seed error: ${linkErr.message}`);
      }

      // 5. Seed CMS Pages
      const pagesToInsert = [
        {
          id: crypto.randomUUID(),
          journal_id: journalId,
          page_title: 'Ethical Guidelines & Policies',
          page_alias: 'policies',
          page_content: `
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">1. Double-Blind Peer Review Policy</h3>
              <p class="text-slate-600 leading-relaxed text-sm">This journal employs a strict double-blind peer review process. Both the reviewer and author identities are concealed throughout the review process. To facilitate this, authors must ensure that their manuscripts are prepared in a way that does not give away their identity.</p>
              
              <h3 class="text-xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">2. Open Access Policy</h3>
              <p class="text-slate-600 leading-relaxed text-sm">This journal provides immediate open access to its content on the principle that making research freely available to the public supports a greater global exchange of knowledge.</p>
              
              <h3 class="text-xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">3. Plagiarism Policy</h3>
              <p class="text-slate-600 leading-relaxed text-sm">All submitted manuscripts are checked for plagiarism using industry-standard software. Manuscripts with a similarity index above 15% will be rejected immediately without entering the review process.</p>
            </div>
          `,
          sort_order: 1,
          page_placement: 'footer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          journal_id: journalId,
          page_title: 'Editorial Board',
          page_alias: 'board',
          page_content: `
            <div class="space-y-6">
              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Editor-in-Chief</h4>
                <h3 class="text-lg font-bold text-slate-900">${j.editorialBoard[0]?.name || 'Doç. Dr. Hüsamettin KARATAŞ'}</h3>
                <p class="text-sm text-slate-500">${j.editorialBoard[0]?.title || 'Poltem Akademi, Computer Engineering, Turkey'}</p>
              </div>
              
              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Assistant Editor</h4>
                <h3 class="text-lg font-bold text-slate-900">${j.editorialBoard[1]?.name || 'Dr. Zaidan Arif AL-ZEBARI'}</h3>
                <p class="text-sm text-slate-500">${j.editorialBoard[1]?.title || 'Poltem Akademi, Assistant Professor'}</p>
              </div>

              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Editorial Advisory Board</h4>
                <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
                  ${j.advisoryBoard.map(b => `<li>${b.name}, ${b.institution}</li>`).join('') || '<li>Prof. Dr. Jane Doe, MIT, USA</li><li>Prof. Dr. John Smith, Oxford, UK</li>'}
                </ul>
              </div>
            </div>
          `,
          sort_order: 2,
          page_placement: 'footer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const { error: pageErr } = await supabase.from('pages').insert(pagesToInsert);
      if (pageErr) throw new Error(`Pages seed error: ${pageErr.message}`);
    }

    console.log('Seeder: Database successfully seeded with mock data!');
  } catch (err: any) {
    console.error('Seeder: Error seeding database:', err.message || err);
  }
}
