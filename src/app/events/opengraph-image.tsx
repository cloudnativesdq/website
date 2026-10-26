import { size, contentType, renderPageImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Eventos: próximos meetups y charlas';
export default function Image() {
  return renderPageImage({ eyebrow: 'Eventos', title: 'Próximos meetups y charlas', path: '/events' });
}
