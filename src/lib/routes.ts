const rawBase = import.meta.env.BASE_URL;
export const BASE_PATH = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

/**
 * `numeral` is the compact form the desktop contents row shows beside each title.
 * Ares 2.1 dropped the Part numbering on desktop with `display: none` because it
 * would not fit a single squeezed strip; 2.2 gives the contents their own row and
 * shows the structure at every width (#30).
 */
export const publicationRoutes = [
  { path: '/framework', label: 'Part I', numeral: 'I', title: 'Framework' },
  { path: '/cases', label: 'Part II', numeral: 'II', title: 'Historical cases' },
  { path: '/comparison', label: 'Part III', numeral: 'III', title: 'Comparison' },
  { path: '/process', label: 'Part IV', numeral: 'IV', title: 'Process synthesis' },
  { path: '/implications', label: 'Part V', numeral: 'V', title: 'Implications' },
  { path: '/reflection', label: 'Part VI', numeral: 'VI', title: 'Critical reflection' },
  { path: '/glossary', label: 'Reference', numeral: 'Ref.', title: 'Glossary' },
  { path: '/references', label: 'Sources', numeral: 'Src.', title: 'References' },
] as const;

export function route(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}` || '/';
}

export function caseRoute(id: string): string {
  return route(`/cases/${id}`);
}
