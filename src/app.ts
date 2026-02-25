import 'tsconfig-paths/register' 
import dotenv from 'dotenv'
dotenv.config()

import express, { Application, Response, Request } from 'express'
import cors from 'cors'
import authRoutes from '@/routes/auth.routes'
import candidateRoutes from '@/routes/candidate.routes'
import { errorHandler } from '@/middlewares/error.handler'

const app: Application = express()

// MY app configs
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// MY app routes go here
app.get("/api/v1", (req: Request, res: Response) => {
  res.json({ 
    message: "Welcome to Zeno API!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      candidates: "/api/v1/candidates"
    }
  })
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/candidates", candidateRoutes)

// MY app error handler util
app.use(errorHandler)

export default app
