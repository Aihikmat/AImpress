// supabase/functions/register/index.ts
// ✅ One file: saves registration to Supabase + sends email with Mailjet

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
serve(async (req) => {
  try {
    const body = await req.json();
    const data = body.record;

    // 1. Init Supabase client


    // 2. Save registration in Supabase
    const { error } = await supabase.from("registrations").insert([data]);
    if (error) {
      console.error("Supabase insert error:", error);
      return new Response("Error saving registration", { status: 500 });
    }

    // 3. Send confirmation email with Mailjet
    const apiKey = Deno.env.get("MJ_APIKEY_PUBLIC");
    const apiSecret = Deno.env.get("MJ_APIKEY_PRIVATE");

    if (!apiKey || !apiSecret) {
      return new Response("Mailjet keys not set", { status: 500 });
    }

    const { email, first_name, workshop } = data;

    const resp = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${apiKey}:${apiSecret}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: "test@email.com", // must be verified in Mailjet
              Name: "Workshop Registration",
            },
            To: [{ Email: email, Name: first_name }],
            Subject: "✅ Registration Confirmation",
            TextPart: `Hello ${first_name},\n\nThank you for registering for ${workshop}.\nWe’ll contact you with more details soon.`,
            HTMLPart: `<h3>Hello ${first_name},</h3>
                       <p>Thank you for registering for <strong>${workshop}</strong>.</p>
                       <p>We’ll contact you with more details soon.</p>`,
          },
        ],
      }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Mailjet error:", errorText);
      return new Response("Failed to send email", { status: 500 });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Function error:", err);
    return new Response("Server error", { status: 500 });
  }
});


document.addEventListener("click", (e) => {
  console.log("test btn");

  if (e.target.classList.contains("register-btn")) {
    let form_container = document.querySelector("#registrationForm");
    form_container.classList.add("active"); // ✅ toggle CSS class
  }
});


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    workshop: workshopInput.value,
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    dob: document.getElementById("dob").value,
    address: document.getElementById("address").value,
  };

  try {
    const response = await fetch(
      "https://rdqzljpynbpjyvstgain.functions.supabase.co/register", // 👈 new endpoint
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: data }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save registration or send email");
    }

    alert("✅ Registration submitted! You'll receive a confirmation email soon.");
    registrationForm.style.display = "none";
  } catch (err) {
    console.error("Error:", err);
    alert("⚠️ Something went wrong. Please contact support.");
  }
});
