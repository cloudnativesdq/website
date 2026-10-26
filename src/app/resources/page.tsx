import type { Metadata } from 'next';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo';
import {
  getCoupon,
  getFreeCourses,
  getFreeCodeCampVideos,
  getKubernetesBlogs,
  getNewContributorOrientations,
} from "@/lib/cncf-resources";
import ResourcesView from "@/components/ResourcesView";

export const metadata: Metadata = {
  title: 'Recursos | Cloud Native Santo Domingo',
  description: 'Descuentos para certificaciones CNCF, cursos gratuitos, certificaciones, comunidades y próximos eventos Cloud Native.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/resources',
  },
  openGraph: { ...sharedOpenGraph, title: 'Recursos | Cloud Native Santo Domingo', description: 'Descuentos para certificaciones CNCF, cursos gratuitos, certificaciones, comunidades y próximos eventos Cloud Native.', url: '/resources' },
  twitter: { ...sharedTwitter, title: 'Recursos | Cloud Native Santo Domingo', description: 'Descuentos para certificaciones CNCF, cursos gratuitos, certificaciones, comunidades y próximos eventos Cloud Native.' },
};

export default async function Resources() {
  const [coupon, courses, videos, blogs, orientations] = await Promise.all([
    getCoupon(),
    getFreeCourses(),
    getFreeCodeCampVideos(),
    getKubernetesBlogs(),
    getNewContributorOrientations(),
  ]);
  return (
    <ResourcesView
      coupon={coupon}
      courses={courses}
      videos={videos}
      blogs={blogs}
      orientations={orientations}
    />
  );
}
