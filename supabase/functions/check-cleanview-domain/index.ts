const corsHeaders = {
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

function jsonResponse(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders,
  });
}

function canonicalHostname(value: unknown): string {
  const raw = String(value ?? "").trim().toLowerCase().replace(/\.$/, "");

  if (!raw || raw.length > 253 || raw.includes(":") || raw.includes("/")) {
    return "";
  }

  let parsed: URL;
  try {
    parsed = new URL(`https://${raw}/`);
  } catch {
    return "";
  }

  if (
    parsed.hostname !== raw ||
    raw === "localhost" ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(raw)
  ) {
    return "";
  }

  const labels = raw.split(".");
  if (
    labels.length < 2 ||
    labels.some((label) =>
      !label ||
      label.length > 63 ||
      !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
    )
  ) {
    return "";
  }

  return raw;
}

function secretKey(): string {
  const direct = Deno.env.get("SUPABASE_SECRET_KEY") ||
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (direct) {
    return direct;
  }

  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return typeof keys.default === "string" ? keys.default : "";
  } catch {
    return "";
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { allowed: false });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 2048) {
    return jsonResponse(400, { allowed: false });
  }

  let body: { hostname?: unknown };
  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > 2048) {
      return jsonResponse(400, { allowed: false });
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { allowed: false });
  }

  const hostname = canonicalHostname(body.hostname);
  if (!hostname) {
    return jsonResponse(400, { allowed: false });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const key = secretKey();
  if (!supabaseUrl || !key) {
    console.error("CleanView domain check is missing Supabase server configuration.");
    return jsonResponse(503, { allowed: false });
  }

  const query = new URL(`${supabaseUrl}/rest/v1/cleanview_allowed_domains`);
  query.searchParams.set("select", "hostname");
  query.searchParams.set("hostname", `eq.${hostname}`);
  query.searchParams.set("enabled", "is.true");
  query.searchParams.set("limit", "1");

  try {
    const response = await fetch(query, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("CleanView domain lookup failed with status", response.status);
      return jsonResponse(503, { allowed: false });
    }

    const rows = await response.json();
    return jsonResponse(200, { allowed: Array.isArray(rows) && rows.length === 1 });
  } catch (error) {
    console.error("CleanView domain lookup failed", error);
    return jsonResponse(503, { allowed: false });
  }
});
