import {
  getCoupon,
  getFreeCourses,
  getFreeCodeCampVideos,
  getKubernetesBlogs,
  getNewContributorOrientations,
} from "@/lib/cncf-resources";
import { links } from "@/lib/links";
import { json } from "@/lib/api";

export const revalidate = 21600;

export async function GET() {
  const [coupon, freeCourses, freeCodeCamp, kubernetesBlogs, newContributorOrientations] = await Promise.all([
    getCoupon(),
    getFreeCourses(),
    getFreeCodeCampVideos(),
    getKubernetesBlogs(),
    getNewContributorOrientations(),
  ]);
  return json({ coupon, freeCourses, freeCodeCamp, kubernetesBlogs, newContributorOrientations, links });
}
