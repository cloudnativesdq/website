/* eslint-disable @typescript-eslint/no-explicit-any */

const FALLBACK_DATA = {
  organizers: [
    {
      name: "Enmanuel Marcial Medina Martinez",
      role: "Co-organizer",
      company: "Freelance Python Developer",
      image: "",
      profileUrl: "https://community.cncf.io/cloud-native-santo-domingo/"
    },
    {
      name: "Ayesha Diane Yege Peña",
      role: "Digital Transformation",
      company: "IT Manager",
      image: "",
      profileUrl: "https://community.cncf.io/cloud-native-santo-domingo/"
    },
    {
      name: "Victor S. Recio",
      role: "Technical Lead",
      company: "Senior SA",
      image: "",
      profileUrl: "https://community.cncf.io/cloud-native-santo-domingo/"
    },
    {
      name: "Miguel Los",
      role: "Co-Organizer",
      company: "",
      image: "",
      profileUrl: "https://community.cncf.io/cloud-native-santo-domingo/"
    },
    {
      name: "Lester Diaz",
      role: "DevOps Engineer",
      company: "",
      image: "",
      profileUrl: "https://community.cncf.io/cloud-native-santo-domingo/"
    }
  ],
  upcoming: [],
  past: [],
  pastCount: 25,
  membersCount: 481
};

export async function getCncfData() {
  try {
    const res = await fetch('https://community.cncf.io/cloud-native-santo-domingo/', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) throw new Error("Failed to fetch CNCF page");
    
    const html = await res.text();
    
    // Extract the __NEXT_DATA__ script content using string splitting
    const startTag = '<script id="__NEXT_DATA__" type="application/json">';
    const endTag = '</script>';
    const startIndex = html.indexOf(startTag);
    if (startIndex === -1) throw new Error("No data script found");
    
    const contentStart = startIndex + startTag.length;
    const endIndex = html.indexOf(endTag, contentStart);
    if (endIndex === -1) throw new Error("No data script end found");
    
    const nextData = html.substring(contentStart, endIndex);
    const data = JSON.parse(nextData);
    const { upcomingEvents, pastEvents, chapterTeam } = data.props.pageProps.prerenderData;
    const membersCount = data.props.pageProps.chapterData?.members_count || FALLBACK_DATA.membersCount;
    
    const organizers = chapterTeam.map((m: { user: any; title: string }) => {
      let image = m.user.cropped_avatar_url || m.user.avatar?.url || "";
      if (image && !image.startsWith('http')) {
        image = `https://community.cncf.io${image}`;
      }
      return {
        name: m.user.full_name || `${m.user.first_name} ${m.user.last_name}`,
        role: m.title.split(' | ')[0] || m.title,
        company: m.title.split(' | ')[1] || m.user.company || "",
        image,
        profileUrl: `https://community.cncf.io${m.user.profile_url}`
      };
    });

    const mapEvent = (e: { venue?: any; location_name?: string; city?: string; title: string; event_type_title: string; url: string; start_date: string; cropped_picture_url?: string; cropped_banner_url?: string }) => {
      const venue = e.venue;
      let location = "Santo Domingo, RD";
      
      if (venue) {
        const parts = [venue.name, venue.address, venue.city].filter(Boolean);
        location = parts.join(", ");
      } else if (e.location_name) {
        location = e.location_name;
      } else if (e.city) {
        location = e.city;
      }

      let image = e.cropped_picture_url || e.cropped_banner_url || "";
      if (image && !image.startsWith('http')) {
        image = `https://community.cncf.io${image}`;
      }

      return {
        title: e.title,
        type: e.event_type_title,
        image,
        url: e.url,
        date: e.start_date, // This is usually an ISO string with time
        location: location
      };
    };

    const upcoming = upcomingEvents.results ? upcomingEvents.results.map((e: any) => mapEvent(e)) : [];
    const past = pastEvents.results ? pastEvents.results.map((e: any) => mapEvent(e)) : [];
    const pastCount = pastEvents.count || past.length || FALLBACK_DATA.pastCount;

    return { organizers, upcoming, past, pastCount, membersCount };
  } catch (error: any) {
    console.error("Error fetching CNCF data, using fallback:", error);
    return FALLBACK_DATA;
  }
}
