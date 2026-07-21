export const isProfileComplete = (role: string | null | undefined, profile: any): { isValid: boolean; missingFields: string[] } => {
  if (!profile) return { isValid: false, missingFields: ['name', 'email'] };

  const missingFields: string[] = [];

  // ALL ROLES: Require name and email
  if (!profile.name) missingFields.push('name');
  if (!profile.email) missingFields.push('email');

  if (!role) return { isValid: missingFields.length === 0, missingFields };

  // Role-specific requirements
  switch (role) {
    case 'author':
    case 'yazar':
      if (!profile.institution) missingFields.push('institution');
      if (!profile.orcid) missingFields.push('orcid');
      if (!profile.country) missingFields.push('country');
      break;

    case 'reviewer':
    case 'hakem':
      if (!profile.institution) missingFields.push('institution');
      if (!profile.department) missingFields.push('department');
      if (!profile.bio) missingFields.push('bio');
      if (!profile.country) missingFields.push('country');
      break;

    case 'editor':
    case 'layout_editor':
      if (!profile.phone) missingFields.push('phone');
      if (!profile.department) missingFields.push('department');
      break;

    default:
      break;
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
