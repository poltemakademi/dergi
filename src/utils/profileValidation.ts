export const isProfileComplete = (role: string | null | undefined, profile: any): { isValid: boolean; missingFields: string[] } => {
  if (!profile) return { isValid: false, missingFields: ['name', 'email'] };

  const name = profile.name || profile.name_surname;
  const email = profile.email || profile.academic_email;

  // CRITICAL: Check if profile has basic data populated (institution, country, department, orcid, etc.)
  if (name && email && (profile.institution || profile.country || profile.department || profile.orcid || profile.phone || profile.bio)) {
    return { isValid: true, missingFields: [] };
  }

  const missingFields: string[] = [];

  // ALL ROLES: Require name and email
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');

  if (!role || role === 'super_admin') return { isValid: missingFields.length === 0, missingFields };

  // Role-specific soft requirements
  switch (role) {
    case 'author':
    case 'yazar':
      if (!profile.institution && !profile.country) missingFields.push('institution');
      break;

    case 'reviewer':
    case 'hakem':
      if (!profile.institution && !profile.department) missingFields.push('institution');
      break;

    case 'editor':
    case 'layout_editor':
      break;

    default:
      break;
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
