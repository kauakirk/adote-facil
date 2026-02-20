import express, { NextFunction, Response, Request } from 'express'
import cors from 'cors'
import 'express-async-errors'
import { router } from './routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(router)

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    console.error(err)
    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    })
  },
)

export { app }
