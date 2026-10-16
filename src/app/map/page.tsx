import type { Metadata } from 'next';
import { getMapData } from "@/lib/chapters";
import MapView from "@/components/MapView";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Mapa de la comunidad CNCF | Cloud Native Santo Domingo',
  description: 'Capítulos CNCF del mundo en un mapa: próximos eventos, KCDs, Cloud Native Days y Kubestronauts por país.',
  alternates: {
    canonical: 'https://cloudnativesdq.org/map',
  },
};

export default async function CommunityMap() {
  const data = await getMapData();
  return <MapView data={data} />;
}
