import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const KNOWN_CITIES = ["Khiva", "Tashkent", "Bukhara", "Samarkand"]

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { category, message } = await req.json()
    const typeMap: Record<string, string> = {
      homes: "home",
      crafts: "craft",
      cafes: "cafe",
    }
    const listingType = typeMap[category] || "home"

    // detect if the visitor mentioned a specific known city
    const lowerMsg = message.toLowerCase()
    const mentionedCity = KNOWN_CITIES.find((c) =>
      lowerMsg.includes(c.toLowerCase())
    )

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    let query = supabase
      .from("listings")
      .select(
        "id, name, city, address, description, price, price_label, rating, image"
      )
      .eq("type", listingType)

    if (mentionedCity) {
      query = query.ilike("city", `%${mentionedCity}%`)
    }

    const { data: listings } = await query

    const cityNote = mentionedCity
      ? `The visitor specifically asked about ${mentionedCity}. The list below has ALREADY been filtered to ONLY ${mentionedCity} listings. If this list is empty, there are simply no ${mentionedCity} options yet — say so honestly, do NOT suggest listings from other cities.`
      : `The visitor did not mention a specific city, so listings from all cities are included below — feel free to recommend across cities.`

    const prompt = `You are budgetravel's assistant for the ${category} section (Uzbekistan travel marketplace).
A visitor asked: "${message}"

${cityNote}

Available listings: ${JSON.stringify(listings || [])}

RULES:
- Answer naturally and helpfully in 2-4 sentences.
- ONLY recommend listings from the list above, using their exact "id". Never recommend a listing whose city doesn't match what the visitor asked for.
- NEVER invent listings, names, or external links.
- If the list is empty or nothing genuinely fits, say so honestly instead of forcing a suggestion.
- Respond with ONLY raw JSON, no markdown fences, in this exact shape:
{"reply": "...", "suggested_ids": ["id1", "id2"]}`

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("GROQ_API_KEY")}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    )

    const groqData = await groqRes.json()

    if (!groqData.choices || !groqData.choices[0]) {
      return new Response(
        JSON.stringify({ error: "AI error", raw: groqData }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    let rawText = groqData.choices[0].message.content

    rawText = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    const result = JSON.parse(rawText)

    const suggested = (listings || []).filter((l) =>
      result.suggested_ids?.includes(l.id)
    )

    return new Response(
      JSON.stringify({
        reply: result.reply,
        suggested,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })
  }
})