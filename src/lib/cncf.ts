/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getCncfData() {
  try {
    const res = await fetch('https://community.cncf.io/cloud-native-santo-domingo/', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const html = await res.text();
    
    // Extract the __NEXT_DATA__ script content using string splitting
    const startTag = '<script id="__NEXT_DATA__" type="application/json">';
    const endTag = '</script>';
    const startIndex = html.indexOf(startTag);
    if (startIndex === -1) throw new Error("No data found");
    
    const contentStart = startIndex + startTag.length;
    const endIndex = html.indexOf(endTag, contentStart);
    if (endIndex === -1) throw new Error("No data found");
    
    const nextData = html.substring(contentStart, endIndex);
    const data = JSON.parse(nextData);
    const { upcomingEvents, pastEvents, chapterTeam } = data.props.pageProps.prerenderData;
    
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

    return { organizers, upcoming, past };
  } catch (error: any) {
    console.error("Error fetching CNCF data:", error);
    return { organizers: [], upcoming: [], past: [] };
  }
}
