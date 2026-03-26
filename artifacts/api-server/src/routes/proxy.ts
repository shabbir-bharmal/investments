import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/Public/get-investments", async (req, res) => {
  const baseUrl = process.env.API_BASE_URL || "";

  if (!baseUrl) {
    req.log.error("API_BASE_URL environment variable is not set");
    res.status(500).json({ error: "API base URL is not configured" });
    return;
  }

  const queryParams = new URLSearchParams({
    IsActive: (req.query.IsActive as string) || "true",
    Themes: (req.query.Themes as string) || "",
    InvestmentTypes: (req.query.InvestmentTypes as string) || "",
    SpecialFilters: (req.query.SpecialFilters as string) || "",
  });

  const url = `${baseUrl}/api/Public/get-investments?${queryParams.toString()}`;
  req.log.info({ url }, "Proxying investment request");

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    req.log.info(
      {
        status: response.status,
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
      },
      "Upstream response received"
    );

    if (!response.ok) {
      const body = await response.text();
      req.log.error(
        { status: response.status, body },
        "Upstream API error"
      );
      res.status(response.status).json({
        error: `Upstream API error: ${response.status} ${response.statusText}`,
      });
      return;
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
      req.log.info("Upstream returned empty body, returning empty array");
      res.json([]);
      return;
    }

    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      req.log.error({ text: text.substring(0, 200) }, "Failed to parse upstream JSON");
      res.status(502).json({ error: "Invalid JSON from upstream API" });
    }
  } catch (err: any) {
    req.log.error({ err }, "Failed to proxy investment request");
    res.status(502).json({ error: "Failed to reach upstream API" });
  }
});

export default router;
