import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
const router = Router();
import  {healthcheck}  from "../Controllers/healthCheck.contorller.js";



/*************  Secured Routes Heath checking **********************/
router.get("/health-check", verifyJwt, healthcheck);

export default router;