import { Router, type IRouter } from "express";
import healthRouter from "./health";
import proxyRouter from "./proxy";
import configRouter from "./config";

const router: IRouter = Router();

router.use(healthRouter);
router.use(proxyRouter);
router.use(configRouter);

export default router;
