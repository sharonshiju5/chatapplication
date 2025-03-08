import { Router } from "express";
import * as rh from "./requesthandler/user.request.js"
import * as ms from "./requesthandler/message.requst.js"
// import Auth from "./midileware/auth.js";


const router=Router();

router.route("/adduser").post(rh.adduser)
router.route("/login").post(rh.logine)
router.route("/editeuser").post(rh.editeuser)
router.route("/fetchuser").post(rh.fetchuser)
router.route("/viewusers").post(rh.viewusers)
router.route("/chattedaccount").post(rh.chattedaccount)
router.route("/fetchchats").post(rh.fetchedchattedaccount)


router.route("/addmsg").post(ms.addmsg)
router.route("/fetchmessage").post(ms.fetchmessage)


export default router
