import { BusinessObjectSyncProvider } from "./synchronizers/BusinessObjectSynchronizerProvider"
import { runQuery } from "./utils/runQuery"

const dispatch = async function (
    provider: BusinessObjectSyncProvider,
    payload: Record<string, any>,
) {
    switch (payload.operation.toLowerCase()) {
        case "delete": {
            console.log("Deleting", payload.name, payload.object_id)
            const result = await runQuery(provider.deleteById, {
                event_id: payload.event_id,
                object_id: payload.object_id,
            })
            console.log("deleted result", result)
            return result
        }
        case "insert":
        case "update": {
            try {
                console.log("Upserting", payload.name, payload.object_id)
                const variables = await provider.fetchById(payload.object_id)
                const data = runQuery(provider.upsert, {
                    employeeObject: { ...variables },
                    event_id: payload.event_id,
                })
                return data
            } catch (e) {
                throw e
            }
        }
        default: {
            return Promise.reject(
                new Error(`Unsupported operation ${payload.operation}`),
            )
        }
    }
}

export default dispatch
