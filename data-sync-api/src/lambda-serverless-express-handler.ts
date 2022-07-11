import serverlessExpress from "@vendia/serverless-express"
import app from "./main"

export const handler = serverlessExpress({ app })
