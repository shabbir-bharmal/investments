import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/config", (_req, res) => {
  res.json({
    apiBaseUrl: process.env.API_BASE_URL || "",
  });
});

export default router;
