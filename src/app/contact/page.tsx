
import type { Metadata } from 'next';
import ContactView from "@/components/ContactView";

export const metadata: Metadata = {
  title: 'Contact Us | Cloud Native Santo Domingo',
  description: 'Have questions or want to collaborate with Cloud Native Santo Domingo? Reach out to us!',
  alternates: {
    canonical: 'https://cloudnativesdq.org/contact',
  },
};

export default function ContactPage() {
  return <ContactView />;
}
