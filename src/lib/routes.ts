const rawBase = import.meta.env.BASE_URL;
export const BASE_PATH = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

export const publicationRoutes = [
  { path: '/framework', label: 'Part I', title: 'Framework' },
  { path: '/cases', label: 'Part II', title: 'Historical cases' },
  { path: '/comparison', label: 'Part III', title: 'Comparison' },
  { path: '/process', label: 'Part IV', title: 'Process synthesis' },
  { path: '/implications', label: 'Part V', title: 'Implications' },
  { path: '/reflection', label: 'Part VI', title: 'Critical reflection' },
  { path: '/glossary', label: 'Reference', title: 'Glossary' },
  { path: '/references', label: 'Sources', title: 'References' },
] as const;

export function route(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}` || '/';
}

export function caseRoute(id: string): string {
  return route(`/cases/${id}`);
}
