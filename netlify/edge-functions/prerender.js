const BOT_PATTERN = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|telegrambot|whatsapp|slackbot|discordbot|applebot|duckduckbot/i;

const STATIC_FILE_PATTERN = /\.(xml|txt|json|ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf)$/i;

export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  if (!BOT_PATTERN.test(userAgent) || STATIC_FILE_PATTERN.test(url.pathname)) {
    return context.next();
  }

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