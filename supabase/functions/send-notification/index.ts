Deno.serve(async (req) => {
  // Simple shared-secret check so random internet strangers can't trigger this
  const webhookSecret = req.headers.get("x-webhook-secret");
  if (webhookSecret !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  const { table, record } = payload;

  let subject = "";
  let body = "";

  if (table === "booking_requests") {
    subject = `New booking request: ${record.listing_title}`;
    body = `
      <h2>New booking request</h2>
      <p><strong>Listing:</strong> ${record.listing_title} (${record.listing_type})</p>
      <p><strong>Guest:</strong> ${record.guest_name}</p>
      <p><strong>Email:</strong> ${record.guest_email}</p>
      <p><strong>Phone:</strong> ${record.guest_phone || "not provided"}</p>
      ${record.check_in ? `<p><strong>Dates:</strong> ${record.check_in} to ${record.check_out}</p>` : ""}
      <p><strong>Guests:</strong> ${record.guests}</p>
    `;
  } else if (table === "host_applications") {
    subject = `New host application: ${record.full_name}`;
    body = `
      <h2>New host application</h2>
      <p><strong>Name:</strong> ${record.full_name}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      <p><strong>Phone:</strong> ${record.phone || "not provided"}</p>
      <p><strong>Telegram:</strong> ${record.telegram || "not provided"}</p>
      <p><strong>City:</strong> ${record.city}</p>
      <p><strong>Wants to offer:</strong> ${record.listing_type}</p>
      <p><strong>Description:</strong> ${record.description}</p>
    `;
  } else {
    return new Response("Unknown table", { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "budgetravel <notifications@budgetravel.uz>",
      to: "mashhurakkk@gmail.com",
      subject,
      html: body,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Resend error:", errorText);
    return new Response("Failed to send email", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});