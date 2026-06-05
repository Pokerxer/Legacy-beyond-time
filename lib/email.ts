import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.EMAIL_FROM ?? "Legacy Beyond Time <onboarding@resend.dev>"
const TO   = process.env.NOTIFICATION_EMAIL ?? ""

const SITE_URL  = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
const DECEASED  = "Christiana O. Opara"
const FULL_NAME = "Chief Ezinne Christiana Opara, JP"

// ─── Shared styles ─────────────────────────────────────────────────────────
const base = `
  <html><head><meta charset="utf-8">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#f4f1eb;font-family:Georgia,serif;color:#2a2a3e}
    .wrap{max-width:580px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)}
    .top-bar{height:5px;background:linear-gradient(90deg,#c9a84c,#e8c96a,#c9a84c)}
    .header{background:#1a1a2e;padding:32px 40px;text-align:center}
    .header .candle{font-size:28px;display:block;margin-bottom:10px}
    .header h1{color:#c9a84c;font-size:20px;letter-spacing:0.5px;font-weight:normal}
    .header p{color:rgba(255,255,255,0.55);font-size:12px;margin-top:5px;font-family:Arial,sans-serif}
    .body{padding:36px 40px}
    .body h2{font-size:17px;color:#1a1a2e;margin-bottom:18px;font-weight:normal;border-bottom:1px solid #e8c96a;padding-bottom:12px}
    .field{margin-bottom:14px}
    .field .label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;font-family:Arial,sans-serif;margin-bottom:3px}
    .field .value{font-size:14px;color:#2a2a3e;line-height:1.6}
    .message-box{background:#faf8f3;border-left:3px solid #c9a84c;padding:14px 18px;border-radius:0 8px 8px 0;margin:18px 0}
    .message-box p{font-size:14px;color:#2a2a3e;line-height:1.7;font-style:italic}
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-family:Arial,sans-serif;font-weight:600}
    .badge-green{background:#e8f5e9;color:#2e7d32}
    .badge-red{background:#fce4ec;color:#c62828}
    .badge-gold{background:#fff8e1;color:#b7791f}
    .cta{display:block;margin:24px 0 0;padding:12px 24px;background:linear-gradient(135deg,#c9a84c,#e8c96a);color:#1a1a2e;text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;text-align:center;letter-spacing:0.3px}
    .footer{background:#f4f1eb;padding:20px 40px;text-align:center}
    .footer p{font-size:11px;color:#999;font-family:Arial,sans-serif;line-height:1.6}
  </style></head>
`

function wrap(header: string, body: string, adminPath: string) {
  return `${base}
  <body><div class="wrap">
    <div class="top-bar"></div>
    <div class="header">
      <span class="candle">🕯️</span>
      <h1>Legacy Beyond Time</h1>
      <p>In Loving Memory of ${DECEASED}</p>
    </div>
    <div class="body">
      <h2>${header}</h2>
      ${body}
      <a class="cta" href="${SITE_URL}${adminPath}">View in Admin Panel →</a>
    </div>
    <div class="footer">
      <p>This is an automated notification from the Legacy Beyond Time memorial site.<br>
      You are receiving this because you are listed as the memorial administrator.</p>
    </div>
  </div></body></html>`
}

// ─── Senders ───────────────────────────────────────────────────────────────

export async function sendTributeNotification(data: {
  authorName: string
  relationship: string
  message: string
  email?: string
  location?: string
}) {
  if (!resend || !TO) return

  const html = wrap(
    "New Tribute Submitted",
    `
    <div class="field"><div class="label">From</div><div class="value">${data.authorName}</div></div>
    <div class="field"><div class="label">Relationship</div><div class="value">${data.relationship}</div></div>
    ${data.location ? `<div class="field"><div class="label">Location</div><div class="value">${data.location}</div></div>` : ""}
    ${data.email ? `<div class="field"><div class="label">Email</div><div class="value">${data.email}</div></div>` : ""}
    <div class="message-box"><p>${data.message}</p></div>
    <p style="font-size:12px;color:#888;font-family:Arial,sans-serif;margin-top:12px">
      This tribute is pending approval. Approve or reject it in the admin panel.
    </p>
    `,
    "/admin/tributes"
  )

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New tribute from ${data.authorName} — ${FULL_NAME} Memorial`,
    html,
  })
}

export async function sendCondolenceNotification(data: {
  authorName: string
  relationship: string
  location: string
  message: string
}) {
  if (!resend || !TO) return

  const html = wrap(
    "New Condolence Message",
    `
    <div class="field"><div class="label">From</div><div class="value">${data.authorName}</div></div>
    <div class="field"><div class="label">Relationship</div><div class="value">${data.relationship}</div></div>
    <div class="field"><div class="label">Location</div><div class="value">${data.location}</div></div>
    <div class="message-box"><p>${data.message}</p></div>
    <p style="font-size:12px;color:#888;font-family:Arial,sans-serif;margin-top:12px">
      This message is pending approval. Approve or reject it in the admin panel.
    </p>
    `,
    "/admin/condolence"
  )

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New condolence from ${data.authorName} — ${FULL_NAME} Memorial`,
    html,
  })
}

export async function sendRSVPNotification(data: {
  name: string
  email: string
  phone?: string
  attendees: number
  attending: boolean
  message?: string
}) {
  if (!resend || !TO) return

  const html = wrap(
    `Funeral RSVP — ${data.attending ? "Attending ✓" : "Not Attending"}`,
    `
    <div class="field">
      <div class="label">Response</div>
      <div class="value">
        <span class="badge ${data.attending ? "badge-green" : "badge-red"}">
          ${data.attending ? "Will Attend" : "Unable to Attend"}
        </span>
      </div>
    </div>
    <div class="field"><div class="label">Name</div><div class="value">${data.name}</div></div>
    <div class="field"><div class="label">Email</div><div class="value">${data.email}</div></div>
    ${data.phone ? `<div class="field"><div class="label">Phone</div><div class="value">${data.phone}</div></div>` : ""}
    ${data.attending ? `<div class="field"><div class="label">Number Attending</div><div class="value">${data.attendees}</div></div>` : ""}
    ${data.message ? `<div class="message-box"><p>${data.message}</p></div>` : ""}
    `,
    "/admin"
  )

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Funeral RSVP: ${data.name} — ${data.attending ? "Attending" : "Not Attending"}`,
    html,
  })
}

export async function sendDonationNotification(data: {
  donorName: string
  amount?: string
  currency?: string
  message?: string
  isAnonymous: boolean
  donorEmail?: string
}) {
  if (!resend || !TO) return

  const displayName = data.isAnonymous ? "Anonymous" : data.donorName
  const amountLine = data.amount
    ? `<div class="field"><div class="label">Amount</div><div class="value" style="font-size:18px;font-weight:bold;color:#c9a84c">${data.amount} ${data.currency ?? ""}</div></div>`
    : ""

  const html = wrap(
    "New Donation Recorded",
    `
    <div class="field"><div class="label">Donor</div><div class="value">${displayName}</div></div>
    ${!data.isAnonymous && data.donorEmail ? `<div class="field"><div class="label">Email</div><div class="value">${data.donorEmail}</div></div>` : ""}
    ${amountLine}
    ${data.message ? `<div class="message-box"><p>${data.message}</p></div>` : ""}
    `,
    "/admin/donations"
  )

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New donation from ${displayName} — ${FULL_NAME} Memorial`,
    html,
  })
}
