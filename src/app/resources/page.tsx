import type { Metadata } from 'next';
import {
  getCoupon,
  getFreeCourses,
  getFreeCodeCampVideos,
  getKubernetesBlogs,
  getNewContributorOrientations,
} from "@/lib/cncf-resources";
import ResourcesView from "@/components/ResourcesView";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Recursos | Cloud Native Santo Domingo',
  description: 'Descuentos para certificaciones CNCF, cursos gratuitos, certificaciones, comunidades y próximos eventos Cloud Native.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/resources',
  },
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
