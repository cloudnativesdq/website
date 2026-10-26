import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Mapa: Cloud Native en el mundo';
export default function Image() {
  return renderPageImage({ eyebrow: 'Mapa', title: 'Cloud Native en el mundo', path: '/map' });
}
