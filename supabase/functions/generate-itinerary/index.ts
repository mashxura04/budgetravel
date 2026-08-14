import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { city, days, interests } = await req.json()

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // pull real, bookable listings for this city
    const { data: listings, error } = await supabase
      .from("listings")
      .select("id, name, category, description, city, price_label")
      .ilike("city", `%${city}%`)

    if (error) throw error

    const systemPrompt = `You are a local Uzbekistan travel guide creating a day-by-day itinerary.
Rules:
- Use well-known real landmarks/sights for the city from general knowledge.
- Wherever a listing from the provided list fits naturally (lunch, craft workshop, homestay, cafe), use it INSTEAD of a generic suggestion, and include its "listing_id".
- Return ONLY valid JSON in this exact shape:
{
  "days": [
    { "day": 1, "stops": [
      { "time": "09:00", "title": "Ark Fortress", "description": "...", "listing_id": null },
      { "time": "12:00", "title": "Lunch — Homestay Name", "description": "...", "listing_id": "abc123" }
    ]}
  ]
}
No text outside the JSON.`

    const userPrompt = `City: ${city}
Number of days: ${days}
Traveler interests: ${interests || "general sightseeing, food, culture"}
Available bookable listings (use listing_id when you use one):
${JSON.stringify(listings)}`

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    })

    const aiData = await aiRes.json()
    const itinerary = JSON.parse(aiData.choices[0].message.content)

    return new Response(JSON.stringify(itinerary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})