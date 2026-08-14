import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { category, message } = await req.json()
    // category comes in as "homes" | "crafts" | "cafes" (matches route names)
    const typeMap = { homes: "home", crafts: "craft", cafes: "cafe" }
    const listingType = typeMap[category] || "home"

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )
    const { data: listings } = await supabase
      .from("listings")
      .select("id, name, city, address, description, price, price_label, rating")
      .eq("type", listingType)

    const prompt = `You are budgetravel's assistant for the ${category} section (Uzbekistan travel marketplace).
A visitor asked: "${message}"

Here are the ONLY real listings you can recommend: ${JSON.stringify(listings || [])}

RULES:
- Answer naturally and helpfully in 2-4 sentences.
- Recommend 1-3 real listings from the list above if any genuinely fit the request, using their exact "id".
- NEVER invent listings, names, or external links.
- If nothing in the list fits, say so honestly and give general advice instead.
- Respond with ONLY raw JSON, no markdown fences, in this exact shape:
{"reply": "...", "suggested_ids": ["id1", "id2"]}`

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
      return new Response(JSON.stringify({ error: "AI error", raw: groqData }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    let rawText = groqData.choices[0].message.content
    rawText = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const result = JSON.parse(rawText)

    const suggested = (listings || []).filter(l => result.suggested_ids?.includes(l.id))

    return new Response(JSON.stringify({ reply: result.reply, suggested }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})