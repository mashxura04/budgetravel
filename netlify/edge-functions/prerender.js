const BOT_PATTERN = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|telegrambot|whatsapp|slackbot|discordbot|applebot|duckduckbot/i;

export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";

  if (!BOT_PATTERN.test(userAgent)) {
    return context.next();
  }

  const url = new URL(request.url);
  const prerenderUrl = `https://service.prerender.io${url.pathname}${url.search}`;

  const prerenderResponse = await fetch(prerenderUrl, {
    headers: {
      "X-Prerender-Token": Netlify.env.get("PRERENDER_TOKEN"),
    },
  });

  return new Response(prerenderResponse.body, {
    status: prerenderResponse.status,
    headers: prerenderResponse.headers,
  });
};

export const config = {
  path: "/*",
};