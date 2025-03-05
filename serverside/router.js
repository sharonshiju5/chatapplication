import { Router } from "express";
import * as rh from "./requesthandler/user.request.js"
// import Auth from "./midileware/auth.js";


const router=Router();
router.route("/adduser").post(rh.adduser)
router.route("/login").post(rh.logine)

export default router
