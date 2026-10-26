import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Equipo: las personas detrás de la comunidad';
export default function Image() {
  return renderPageImage({ eyebrow: 'Equipo', title: 'Las personas detrás de la comunidad', path: '/team' });
}
