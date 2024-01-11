import * as cheerio from 'cheerio';

export default function extractMetaTags(html: string): Record<string, string> {
  const $ = cheerio.load(html);
  const metaTags: Record<string, string> = {};

  $('meta').each((_, element) => {
    const name = $(element).attr('property') || $(element).attr('name');
    const content = $(element).attr('content');
    if (name) {
      metaTags[name] = content;
    }
  });

  return metaTags;
}
