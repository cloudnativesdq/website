import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Contacto: hablemos';
export default function Image() {
  return renderPageImage({ eyebrow: 'Contacto', title: 'Hablemos', path: '/contact' });
}
