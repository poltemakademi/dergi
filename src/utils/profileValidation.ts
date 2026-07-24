export const isProfileComplete = (_role: string | null | undefined, profile: any): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  if (!profile) {
    return {
      isValid: false,
      missingFields: ['name', 'email', 'phone', 'institution', 'department', 'title_field', 'country', 'orcid']
    };
  }

  const name = profile.name || profile.name_surname;
  const email = profile.email || profile.academic_email;
  const phone = profile.phone;
  const institution = profile.institution;
  const department = profile.department || profile.field;
  const title_field = profile.title_field || profile.title;
  const country = profile.country;
  const orcid = profile.orcid || profile.orcid_id;

  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!phone) missingFields.push('phone');
  if (!institution) missingFields.push('institution');
  if (!department) missingFields.push('department');
  if (!title_field) missingFields.push('title_field');
  if (!country) missingFields.push('country');
  if (!orcid) missingFields.push('orcid');

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

