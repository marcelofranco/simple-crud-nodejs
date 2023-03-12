import * as express from "express";
import { healthcheck } from "../controller/hc.controller";

const router = express.Router();

router.route("/").get(healthcheck);

export default router;
