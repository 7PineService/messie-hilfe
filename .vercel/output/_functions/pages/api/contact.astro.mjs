import {Resend}from'resend';export{b as renderers}from'../../chunks/vendor_Bxy5riAS.mjs';const prerender = false;
const resend = new Resend("re_HXUEK16z_46ERJp8iuBwHL4VtpTA56D8z");
function isLeadForm(body) {
  return typeof body === "object" && body !== null && "first_name" in body && "last_name" in body;
}
function buildLeadFormEmail(body) {
  const services = body["services[]"];
  const servicesList = Array.isArray(services) ? services.join(", ") : services || "Keine angegeben";
  const html = `
    <h2>Neue Anfrage von ${body.salutation} ${body.first_name} ${body.last_name}</h2>

    <h3>Kontaktdaten</h3>
    <p><strong>E-Mail:</strong> ${body.email}</p>
    <p><strong>Telefon:</strong> ${body.phone}</p>

    <h3>Adresse</h3>
    <p>${body.street} ${body.street_number}<br>${body.postal_code} ${body.city}</p>

    ${body.has_different_address ? `
      <h3>Einsatzadresse (abweichend)</h3>
      <p>${body.job_street} ${body.job_street_number}<br>${body.job_postal_code} ${body.job_city}</p>
    ` : ""}

    ${body.has_different_contact ? `
      <h3>Alternativer Ansprechpartner</h3>
      <p><strong>Name:</strong> ${body.alt_salutation} ${body.alt_first_name} ${body.alt_last_name}</p>
      <p><strong>E-Mail:</strong> ${body.alt_email}</p>
      <p><strong>Telefon:</strong> ${body.alt_phone}</p>
    ` : ""}

    <h3>Angefragte Leistungen</h3>
    <p>${servicesList}</p>

    <h3>Objektdetails</h3>
    <p><strong>Objektart:</strong> ${body.object_type || "Nicht angegeben"}</p>
    <p><strong>Aufzug:</strong> ${body.elevator || "Nicht angegeben"}</p>
    <p><strong>Möblierung:</strong> ${body.furnishing || "Nicht angegeben"}</p>
    <p><strong>Zustand:</strong> ${body.condition || "Nicht angegeben"}</p>
    <p><strong>Vermüllungsgrad:</strong> ${body.clutter_level || "Nicht angegeben"}</p>

    <h3>Zeitrahmen</h3>
    <p><strong>Gewünschter Zeitraum:</strong> ${body.timing || "Nicht angegeben"}</p>
    ${body.preferred_date ? `<p><strong>Wunschtermin:</strong> ${body.preferred_date}</p>` : ""}

    <hr>
    <p><small>Anfrage eingegangen am: ${body.timestamp ? new Date(body.timestamp).toLocaleString("de-DE") : (/* @__PURE__ */ new Date()).toLocaleString("de-DE")}</small></p>
  `;
  return {
    subject: `Neue Anfrage: ${servicesList} - ${body.first_name} ${body.last_name}`,
    html,
    replyTo: body.email
  };
}
function buildContactFormEmail(body, fileNames = []) {
  const contactInfo = body.contact;
  const isEmail = contactInfo.includes("@");
  const html = `
    <h2>Neue Kontaktanfrage</h2>

    <h3>Kontaktdaten</h3>
    ${body.name ? `<p><strong>Name:</strong> ${body.name}</p>` : "<p><strong>Name:</strong> Anonym</p>"}
    <p><strong>Kontakt:</strong> ${contactInfo}</p>

    <h3>Nachricht</h3>
    <p>${body.message.replace(/\n/g, "<br>")}</p>

    ${fileNames.length > 0 ? `
      <h3>Anhänge (${fileNames.length})</h3>
      <ul>
        ${fileNames.map((name) => `<li>${name}</li>`).join("")}
      </ul>
      <p><em>Hinweis: Die Dateien wurden als Anhang an diese E-Mail gesendet.</em></p>
    ` : ""}

    <hr>
    <p><small>Quelle: ${body.source || "Webseite"}</small></p>
    <p><small>Anfrage eingegangen am: ${body.timestamp ? new Date(body.timestamp).toLocaleString("de-DE") : (/* @__PURE__ */ new Date()).toLocaleString("de-DE")}</small></p>
  `;
  return {
    subject: `Kontaktanfrage${body.name ? ` von ${body.name}` : " (Anonym)"}`,
    html,
    replyTo: isEmail ? contactInfo : void 0
  };
}
const POST = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body;
    let files = [];
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        name: formData.get("name") || "",
        contact: formData.get("contact") || "",
        message: formData.get("message") || "",
        privacy: formData.get("privacy") === "true",
        timestamp: formData.get("timestamp") || (/* @__PURE__ */ new Date()).toISOString(),
        source: formData.get("source") || "contact-form"
      };
      const fileEntries = formData.getAll("files");
      files = fileEntries.filter((entry) => entry instanceof File);
    } else if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid content type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    let emailConfig;
    let attachments = [];
    if (isLeadForm(body)) {
      emailConfig = buildLeadFormEmail(body);
    } else {
      const fileNames = files.map((f) => f.name);
      emailConfig = buildContactFormEmail(body, fileNames);
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(arrayBuffer)
        });
      }
    }
    const { data, error } = await resend.emails.send({
      from: "Messie-Hilfe <onboarding@resend.dev>",
      to: "jmeyers@mrcleaner.com",
      replyTo: emailConfig.replyTo,
      subject: emailConfig.subject,
      html: emailConfig.html,
      attachments: attachments.length > 0 ? attachments : void 0
    });
    if (error) {
      console.error("Resend error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};const _page=/*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({__proto__:null,POST,prerender},Symbol.toStringTag,{value:'Module'}));const page = () => _page;export{page};