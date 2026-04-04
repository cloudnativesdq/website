import HeroSection from "@/components/HeroSection";
import OrganizersSection from "@/components/OrganizersSection";
import EventsSection from "@/components/EventsSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import { getCncfData } from "@/lib/cncf";
import { Instagram, Linkedin, Mail } from "lucide-react";

export const runtime = 'edge';
const galleryImages = [
  // Google Photos Album
  "https://lh3.googleusercontent.com/pw/AP1GczOCcmb8M-0hVxC0XNnNe-rBbyx_qCXHZ0ZXj2Y-jK0uT3A70dtP0HDVPOjlp8dghuvlAUQXgiGhKVfA1sJ8ytsV-ulrzBRmz5wf7YnV2cuEc03IiYk=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczNNBlMtsqszNV28ssPquXoSdPcIuJXjFZ7u95L1ja0FFLO2XxfmpT9_w8DzZq7QmWLU_NHqsMnWNkT9odhivIfKqVchbJUtLM47ZY7bXRn_fjMg9gE=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczMvBjLIpVcO6pbjF4khGMbuA-R8Cscx6MrHh5vIQuQVTWEBvV7NP39MCUn7behBLAn_mNJJBFmHHnqtOCL69-PY5SmFewKy0vgwO5dAZCb0VesPbTg=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczP23K6VMh4zwJYg32Z1TBt7hLGDnp8SvrviXLfgd4hkcTmdxOpAizBhsYCKjF-jx0kWqZBh0Fm9-FXAKPd0qa0FeqaG7NndUCYA806ApBXSmRxAD1w=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczNX3NIONelV6jN2vZj5hySL1gnZvD5kW2eEkGqAAjY6UReyKSWdAOXb6NaqCCn4h1jdpDPeuApIxeJZqWkIjV-XAxLgsZQ6fbo2LzJrJJzwQwh9cgE=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczO5TPqxuEN35yuNjsLLycKHubTXlEc4wPaYhLTSaVlydArOB8ZOJe-9U-c66W8cu0q4URGnrY0Q46ZRYoq6PWllNE-NH3IdzR-MNfQz3O_e4bFxmOI=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczMsOKUxkbbLY24lvm6hhNb7gY1goDeWu1sz3FwNQNO69XtDS--l9k7ET_W6-y5J1vPlxsOXJayK-tWKZjs7FNHgWBu-bSwuR7IkKOwFnrXsZsGtIUI=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczMUdC76Mzeg5m5595ReWkPKanCrX_leTJH__TiWsBi2zK9AwAcXiKaezdWXFazCmwq7fPjDuxUC_Y4WetaL5-23AC4i9WgxaMBQOa1_NvNM3HFekE4=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczMVjZegrvXGA5wAS7wcTCR3z9xI99T3I7fwcT3z-QCI6qXwtERwP7rW623jQnNq1EeCLuhxzCD1Voragj1_-ybujRmHMQzDf9HHzh159-Imn7LoHjE=w1200",
  // Google Drive Folder
  "https://lh3.googleusercontent.com/d/1R0lpW1Y_4xOyVRuGe0UQ_uLwSAwW2Z3g=w1200",
  "https://lh3.googleusercontent.com/d/1ok4_aMmu01zuH0utAURbtDcLkwfw5HfQ=w1200",
  "https://lh3.googleusercontent.com/d/15ToewxUrZwoqWm7q4gYMOaELfagxXfPH=w1200",
  "https://lh3.googleusercontent.com/d/1a6ozSjd6FoYeNHbbWw0D6o2w5Ps_CucU=w1200",
  "https://lh3.googleusercontent.com/d/1OqPtIdFZW5sv411NYdSQZR4hhbQ7X98O=w1200",
  "https://lh3.googleusercontent.com/d/1J1Td_90NlmdEbX7Nf274fUesUrCytFbB=w1200",
  "https://lh3.googleusercontent.com/d/1uwZvZ5dJ9DSEJhId1B2nh5jzmPXC3nq0=w1200",
  "https://lh3.googleusercontent.com/d/17xUhWYWdfrYAEOE8Lgt0Ocnr_L9nF0xw=w1200",
  "https://lh3.googleusercontent.com/d/1mD1SGynsFPE8_4kt_452K85ZqEbws0T3=w1200",
  "https://lh3.googleusercontent.com/d/1zKJoTu3ffsSFkUbgd4_k-8zZkM3ebKJ4=w1200",
  "https://lh3.googleusercontent.com/d/1FnWjepU6OwhM17y2Ho2r0QfIZuJZa4IJ=w1200",
  "https://lh3.googleusercontent.com/d/1up_fco9eGZ0fpWyrhNHs0mMdSjD5thwn=w1200",
  "https://lh3.googleusercontent.com/d/1MZwJj3ycPSoKw62Q4pUNokSHyhFTXA_h=w1200",
  "https://lh3.googleusercontent.com/d/1SBYh9Y3rbWkAvMBJTTK4e9vUTBi3gjn9=w1200",
  "https://lh3.googleusercontent.com/d/1hKor_u2Ib4yGhUmtGV9XDaPvij5rH9Fp=w1200",
  "https://lh3.googleusercontent.com/d/1YUKg5usdZNqNpo3I4cQI_4ZuIvO8BsKf=w1200",
  "https://lh3.googleusercontent.com/d/1A0SxoY3M2hijijbGZb-tho2sD5SSXW22=w1200",
  "https://lh3.googleusercontent.com/d/1ConYKJsShf53AYmSsa98X7b2gY_XVSBF=w1200",
  "https://lh3.googleusercontent.com/d/1z3UJIECWkVWPMWqqJWL-bbzRZXjh2QYv=w1200",
  "https://lh3.googleusercontent.com/d/1OBbgtPepkKxzjf-XMyoQ_vxL-HE79Pdk=w1200",
  "https://lh3.googleusercontent.com/d/1J-01QK13ZobjjxPEElq2Ditap6hW8kxl=w1200",
  "https://lh3.googleusercontent.com/d/1G2dqR2kF5Dw08Q1_B69kBaOkRMZX6fte=w1200",
  "https://lh3.googleusercontent.com/d/15rc5QpB35kLhBVw1XUav3C0VB6Izna4_=w1200",
  "https://lh3.googleusercontent.com/d/1qouJanxHBaUeoNW8pDqOUqoZAnkoKB0P=w1200",
  "https://lh3.googleusercontent.com/d/1hxqIMSIRrNssgJodDcFAN_ZWZJJWJL1w=w1200",
  "https://lh3.googleusercontent.com/d/1cqOlyzPv7sjDidQmj12_LEkeQSi_gSgN=w1200",
  "https://lh3.googleusercontent.com/d/1Obs1k_r_5pSTvOO5yv_6wpC0nFsdFmiw=w1200",
  "https://lh3.googleusercontent.com/d/1ubww0H_7c3NxKzv67NNX6r0y7uX9kb5C=w1200",
  "https://lh3.googleusercontent.com/d/1gWrkMmYRRpbbS0Zumky5YV-fPhfdmLW8=w1200",
  "https://lh3.googleusercontent.com/d/1bAb2lG9xDhlwsXMAGjCRZaRemooD63Rp=w1200",
  "https://lh3.googleusercontent.com/d/1ZjTi22V9-gtuPrtk0YWe0VF28ZVKfyfj=w1200",
  "https://lh3.googleusercontent.com/d/1NZrn4suysi0kGkMHCLu5YdC685WOHlJ0=w1200",
  "https://lh3.googleusercontent.com/d/1HMH43C-SE6kcbDHwHBAaTQv4Ps7tpjLZ=w1200",
  "https://lh3.googleusercontent.com/d/153gkemtahu2lmu5qbwD7kj5Cmu3OOV0d=w1200",
  "https://lh3.googleusercontent.com/d/1r29G-lNIYOkyk9xKnKt49sZ5VwFHEQBl=w1200",
  "https://lh3.googleusercontent.com/d/102D-aBmDzZTphgS1-HSFTd3CUn0aWH5I=w1200",
  "https://lh3.googleusercontent.com/d/1mKKrIkm6FMHcNUBV5paFdCX5Gp1I4MXl=w1200",
  "https://lh3.googleusercontent.com/d/10jBAgO3EUpWZy3WkhzdhjiJ8rh5WYIuR=w1200",
  "https://lh3.googleusercontent.com/d/181YNIKMev9ITrSKm8qOz8tC4QCQ6504N=w1200",
  "https://lh3.googleusercontent.com/d/1EeC_h0mYoBnOj1Vsys7oS-Dhq47Bdj4H=w1200",
];

export default async function Home() {
  const data = await getCncfData();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <OrganizersSection organizers={data.organizers} />
      <GalleryCarousel images={galleryImages} />
      <EventsSection events={data.upcoming} title="Próximos Eventos" />
      <EventsSection events={data.past} title="Eventos Pasados" />
      <footer className="py-16 text-center border-t border-border bg-surface/30">
        <div className="container">
          <div className="flex justify-center gap-6 mb-8">
            <a
              href="https://www.instagram.com/cncfsdq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/cloud-native-santo-domingo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/cloudnativesdq/website"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="mailto:organizers@cloudnativesdq.org"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
          <p className="text-muted-foreground text-sm mb-2">
            Cloud Native Santo Domingo · Powered by{" "}
            <a
              href="https://www.cncf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CNCF
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            © {new Date().getFullYear()} Cloud Native SDQ
          </p>
        </div>
      </footer>
    </main>
  );
}

