import type { Metadata } from 'next';
import {
  getCoupon,
  getUpcomingEvents,
  getFreeCourses,
  getFreeCodeCampArticles,
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
  const [coupon, events, courses, articles, blogs, orientations] = await Promise.all([
    getCoupon(),
    getUpcomingEvents(),
    getFreeCourses(),
    getFreeCodeCampArticles(),
    getKubernetesBlogs(),
    getNewContributorOrientations(),
  ]);
  return (
    <ResourcesView
      coupon={coupon}
      events={events}
      courses={courses}
      articles={articles}
      blogs={blogs}
      orientations={orientations}
    />
  );
}
