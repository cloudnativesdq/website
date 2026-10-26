import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Recursos: cursos, descuentos y certificaciones';
export default function Image() {
  return renderPageImage({ eyebrow: 'Recursos', title: 'Cursos, descuentos y certificaciones', path: '/resources' });
}
