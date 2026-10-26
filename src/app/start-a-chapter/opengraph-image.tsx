import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Capítulos: abre un capítulo en tu ciudad';
export default function Image() {
  return renderPageImage({ eyebrow: 'Capítulos', title: 'Abre un capítulo en tu ciudad', path: '/start-a-chapter' });
}
