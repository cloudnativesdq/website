import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Programas: hazte Kubestronaut o CNCF Ambassador';
export default function Image() {
  return renderPageImage({ eyebrow: 'Programas', title: 'Hazte Kubestronaut o CNCF Ambassador', path: '/programs' });
}
