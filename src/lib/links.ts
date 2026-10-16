
export const links = {
  // Community
  cncfCommunity: "https://ocgroups.dev/cncf/group/cqecyjw",
  cncfMain: "https://www.cncf.io/",
  
  // Socials
  instagram: "https://instagram.com/cncf_sd",
  linkedin: "https://www.linkedin.com/company/cncg-santo-domingo",
  youtube: "https://www.youtube.com/@CNCFSantoDomingo",
  whatsapp: "https://chat.whatsapp.com/K4Og9I6CPn14mF59LVgQea",
  github: "https://github.com/cloudnativesdq/website",
  githubOrg: "https://github.com/cloudnativesdq",
  
  kcds: "https://www.cncf.io/kcds/",
  cloudNativeDays: "https://cloudnativedays.org/",
  cloudNativeDaysAbout: "https://cloudnativedays.org/about/",
  chapterApply: "https://github.com/cncf/communitygroups/issues/new?template=new-group-request.yaml",
  chapterGuidelines: "https://github.com/cncf/communitygroups",
  chapterBestPractices: "https://github.com/cncf/communitygroups/blob/main/best_practices.md",
  chapterBranding: "https://github.com/cncf/communitygroups/blob/main/branding.md",
  chapterMeetupVsKcd: "https://github.com/cncf/communitygroups/blob/main/meetups-vs-communityday.md",
  chapterOfficeHours: "https://ocgroups.dev/cncf/group/gcprdx7",
  ocgDocs: "https://ocgroups.dev/docs",
  cncfCodeOfConduct: "https://github.com/cncf/foundation/blob/main/code-of-conduct.md",
  cncfCertifications: "https://www.cncf.io/training/certification/",
  kubestronautProgram: "https://www.cncf.io/training/kubestronaut/",
  cncfAmbassadors: "https://www.cncf.io/people/ambassadors/",
  cncfCourses: "https://www.cncf.io/training/courses/",
  cncfEvents: "https://www.cncf.io/events/",
  kubecons: "https://www.cncf.io/kubecon-cloudnativecon-events/",
  aaifEvents: "https://aaif.io/events/",
  cncfCommunityGroups: "https://community.cncf.io/",
  cncfSlack: "https://slack.cncf.io/",
  lfCoupons: "https://github.com/techiescamp/linux-foundation-coupon",
  kodekloud: "https://kodekloud.com/",
  lfTraining: "https://training.linuxfoundation.org/",
  killercoda: "https://killercoda.com/",
  freeCodeCampDevOps: "https://www.youtube.com/playlist?list=PLWKjhJtqVAbkzvvpY12KkfiIGso9A_Ixs",
  k8sBlog: "https://kubernetes.io/blog/",
  k8sDevBlog: "https://www.kubernetes.dev/blog/",
  k8sCalendar: "https://www.kubernetes.dev/resources/calendar/",
  k8sContributorGuide: "https://www.kubernetes.dev/docs/guide/",
  k8sMembership: "https://github.com/kubernetes/community/blob/main/community-membership.md",
  k8sDevMailingList: "https://groups.google.com/a/kubernetes.io/g/dev",
  k8sCommunityGroups: "https://www.kubernetes.dev/community/community-groups/",
  k8sVolunteer: "https://github.com/kubernetes/community/blob/main/events/events-team/operations/volunteers.md",

  // Resources
  slides: "https://drive.google.com/drive/folders/1A0KR_mcGsH6ggXnFOB9dG_QooiNpaZEj?usp=drive_link",
  cfp: "https://sessionize.com/cloud-native-santo-domingo-2026/",
  
  // Contact
  email: "organizers@cloudnativesdq.org",
  emailMailto: "mailto:organizers@cloudnativesdq.org",
  
  // External Assets & Fallbacks
  eventFallbackImage: "/images/logo.png",
  organizerFallbackImage: "/images/logo.png",
  
  // Site Info
  siteUrl: "https://cloudnativesdq.org",
  siteLogo: "https://cloudnativesdq.org/favicon.svg",

  // Luma Events (fetched by LumaScraperProvider)
  lumaEvents: [
    {
      url: "https://luma.com/event/evt-zln7Flow0wdYSZR",
      type: "Meetup",
    },
    {
      url: "https://luma.com/domini-7g5q",
      type: "Meetup",
    },
  ] as { url: string; type?: string; image?: string; location?: string }[],
};

// Latin American CNCF chapters and KCDs shown on the landing page.
export const latamCommunities = [
  { name: "Cloud Native Colombia", href: "https://community.cncf.io/cloud-native-colombia/" },
  { name: "Cloud Native Bogotá", href: "https://community.cncf.io/cloud-native-bogota/" },
  { name: "Cloud Native Lima", href: "https://community.cncf.io/cloud-native-lima" },
  { name: "Cloud Native Guadalajara", href: "https://community.cncf.io/cloud-native-guadalajara/" },
  { name: "KCD Panamá", href: "https://community2.cncf.io/kcd-panama/" },
];
