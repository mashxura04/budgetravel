import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const body = await req.json()
    const city = body.city || "Bukhara"
    const days = body.days || 1

    let listings = []
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      )
      const { data, error } = await supabase
        .from("listings")
        .select("id, name, category, description, city, price_label")
        .ilike("city", `%${city}%`)
      if (error) console.error("Supabase query error:", error)
      listings = data || []
    } catch (_e) {
      listings = []
    }

    const prompt = `You are a local Uzbekistan travel guide. Create a ${days}-day itinerary for ${city}.
Use real, well-known landmarks from general knowledge for sightseeing stops.
Here are the ONLY bookable listings you're allowed to recommend, with their real IDs: ${JSON.stringify(listings)}

STRICT RULES:
- ONLY include landmarks that are physically located IN ${city} itself — never suggest sites in a different city, even if they're famous or nearby.
- Limit each day to 3-4 stops MAX, realistically spaced (e.g. 09:00, 12:00, 15:00, 18:00) — do not cram 6+ stops into one day.
- If the provided listings list is NOT empty, you MUST include at least one of them in the itinerary (for a meal, stay, or experience slot), using its real "listing_id".
- NEVER invent or mention any website, URL, or booking link (no Booking.com, no external sites, nothing).
- NEVER invent hotel/cafe/restaurant names that aren't landmarks or in the listings above.
- If the listings list is empty, just describe a generic type of place (e.g. "a local restaurant near the old town") with listing_id set to null — do NOT make up a specific business name.
- Respond with ONLY raw JSON, no markdown code fences, no extra text, in exactly this shape:
{"days":[{"day":1,"stops":[{"time":"09:00","title":"...","description":"...","listing_id":null}]}]}`

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("GROQ_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const groqData = await groqRes.json()

    if (!groqData.choices || !groqData.choices[0]) {
      return new Response(JSON.stringify({ error: "Groq API error", raw: groqData }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    let rawText = groqData.choices[0].message.content
    rawText = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    const itinerary = JSON.parse(rawText)
    itinerary.debug_listings_found = listings.map(l => ({ id: l.id, name: l.name, city: l.city }))

    return new Response(JSON.stringify(itinerary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})