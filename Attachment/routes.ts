import express from "express"
import { upload } from"./controller"
const router = express.Router()

router.route("/upload").post(upload)

export default router