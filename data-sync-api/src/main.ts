import bodyParser from "body-parser"
import { assert } from "console"
import dotenv from "dotenv"
import Express from "express"
import { Request, Response } from "express"
import dispatch from "./synchronizer"
import { businessObjectProviderMap } from "./synchronizers/index"

dotenv.config()

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const PORT = process.env.PORT || 3000

// ENV variable configuration check
//assert(process.env.HASURA_GRAPHQL_API, "HASURA_GRAPHQL_API is not set")

if (!process.env.HASURA_GRAPHQL_ADMIN_SECRET) {
    console.warn("HASURA_GRAPHQL_ADMIN_SECRET is not set")
}

const app = Express()
app.use(bodyParser.json())

app.post("/bo-sync-event-handler", async (req: Request, res: Response) => {
    console.log("Received data!")

    const payload = req.body

    // Step 1: Check if this business-object-name has a config entry (case-insensitive)
    const tableName = payload.event.data.new.name.toLowerCase()
    const provider = businessObjectProviderMap[tableName]

    // Step 2: If not, no-op, return 200 OK
    if (!provider)
        return res.send(`No provider found for business object ${tableName}`)

    // Step 3: If yes, dispatch event
    const result = await dispatch(provider, payload.event.data.new)

    // Step 4: Return the result
    return res.json(result)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

export default app
