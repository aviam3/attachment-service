import express, { Express, Request, Response } from "express"
import dotenv from 'dotenv';
import multer from "multer"
import attachmentRoutes from './Attachment/routes'
import auth_required from './Authentication/middleware/auth.middleware'
const app: Express = express();
const port = process.env.PORT || 3000;
dotenv.config();
const upload = multer({ dest: 'uploads/' })

app.get('/health', (req: Request, res: Response) => {
  res.send('Ok');
});

app.use("/attachment", auth_required, upload.single("file"),attachmentRoutes)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
