import { size, contentType, renderHomeImage } from '@/lib/og-image';

export { size, contentType };
export const alt = 'Cloud Native Santo Domingo: la comunidad Cloud Native de República Dominicana';
export default function Image() {
  return renderHomeImage();
}
