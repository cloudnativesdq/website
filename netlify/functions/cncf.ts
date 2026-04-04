import { Handler } from '@netlify/functions';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export const handler: Handler = async () => {
  try {
    const res = await fetch('https://community.cncf.io/cloud-native-santo-domingo/');
    const html = await res.text();
    const $ = cheerio.load(html);
    const nextData = $('#__NEXT_DATA__').html();
    if (!nextData) throw new Error("No data found");
    
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      },
      body: JSON.stringify({ organizers, upcoming, past })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: String(error) }) };
  }
};
