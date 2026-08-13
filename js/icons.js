// Minimalist line icons (stroke-based) — shared by the store and admin panel.

const PATHS = {
  bag: '<path d="M5.5 8h13l1 12.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5L5.5 8Z"/><path d="M8.5 8V6.75a3.5 3.5 0 0 1 7 0V8"/>',
  bagSimple: '<path d="M6 8h12l1 13H5l1-13Z"/><path d="M9 11V6.5a3 3 0 0 1 6 0V11"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  moon: '<path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a7 7 0 0 0 10 10Z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none"/>',
  chevronDown: '<path d="M6 9.5l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pencil: '<path d="M16.5 3.5l4 4L8 20l-5 1 1-5L16.5 3.5Z"/><path d="M14.5 5.5l4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6.5 7l.8 13h9.4l.8-13M9 7V4.5h6V7"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/>',
  check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
  save: '<path d="M12 3v11m0 0l-4-4m4 4l4-4"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',
  heartFill: '<path d="M12 20.2S3.5 15.4 3.5 9.7A4.9 4.9 0 0 1 12 7.2a4.9 4.9 0 0 1 8.5 2.5c0 5.7-8.5 10.5-8.5 10.5Z" fill="currentColor" stroke="none"/>',
  pin: '<path d="M12 21s-6.5-5.7-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.3 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.3"/>',
  inbox: '<path d="M3.5 13h4.2l1.6 2.6h5.4l1.6-2.6h4.2"/><path d="M5 4.5h14l2.5 9.5v5A2 2 0 0 1 19.5 21h-15A2 2 0 0 1 2.5 19v-5L5 4.5Z"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V13"/><circle cx="12" cy="16.3" r="0.7" fill="currentColor" stroke="none"/>',
  user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  arrowUpRight: '<path d="M6.5 17.5L17.5 6.5M17.5 6.5H9M17.5 6.5v8.5"/>',
  flag: '<path d="M5.5 21V4"/><path d="M5.5 4.5h11.5l-2.2 4 2.2 4H5.5"/>',
  imageOutline: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M3.5 16.5l4.5-4 3.5 3 3-3 6 5.5"/>',
};

const sizes = { sm: '16', md: '20', lg: '84' };

export function icon(name, { klass = 'svg-icon', size = 'md' } = {}) {
  const w = size === 'lg' ? sizes.lg : size === 'sm' ? sizes.sm : sizes.md;
  return `<svg class="${klass}" width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name] || ''}</svg>`;
}