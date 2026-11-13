import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Comunidad: comunidades aliadas';
export default function Image() {
  return renderPageImage({ eyebrow: 'Comunidad', title: 'Comunidades aliadas', path: '/partners' });
}
