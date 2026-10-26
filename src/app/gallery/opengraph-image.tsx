import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Galería: fotos de nuestros encuentros';
export default function Image() {
  return renderPageImage({ eyebrow: 'Galería', title: 'Fotos de nuestros encuentros', path: '/gallery' });
}
