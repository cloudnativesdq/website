export async function onRequest(context: any) {
  try {
    const res = await fetch('https://community.cncf.io/cloud-native-santo-domingo/');
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
    
    const organizers = chapterTeam.map((m: any) => ({
      name: m.user.full_name || `${m.user.first_name} ${m.user.last_name}`,
      role: m.title.split(' | ')[0] || m.title,
      company: m.title.split(' | ')[1] || m.user.company || "",
      image: m.user.cropped_avatar_url || m.user.avatar?.url || "",
      profileUrl: `https://community.cncf.io${m.user.profile_url}`
    }));

    const mapEvent = (e: any) => ({
      title: e.title,
      type: e.event_type_title,
      image: e.cropped_picture_url || e.cropped_banner_url || "",
      url: e.url,
      date: e.start_date
    });

    const upcoming = upcomingEvents.results ? upcomingEvents.results.map(mapEvent) : [];
    const past = pastEvents.results ? pastEvents.results.map(mapEvent) : [];

    return new Response(JSON.stringify({ organizers, upcoming, past }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: String(error.message || error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
