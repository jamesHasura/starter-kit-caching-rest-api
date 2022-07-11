import { EmployeeInfo } from "../utils/types"
import { fetch } from "cross-fetch"
import { BusinessObjectSyncProvider } from "./BusinessObjectSynchronizerProvider"

async function fetchById(businessObjectId: string): Promise<EmployeeInfo> {
    try {
        const employeeInfo = await fetch(
            `https://random-data-api.com/api/users/random_user/?=${businessObjectId}`,
        )

        if (employeeInfo.status >= 400) {
            throw new Error("Bad response from server")
        }
        const { first_name, last_name, date_of_birth } =
            await employeeInfo.json()
        return {
            id: businessObjectId,
            first_name: first_name,
            last_name: last_name,
            birth_date: date_of_birth,
        }
    } catch (e) {
        throw e
    }
}

const upsertEmployeeInfoMutation = `
mutation UpsertEmployeeById($employeeObject: employee_cached_model_insert_input!, $event_id: uuid!) {

	insert_employee_cached_model_one(
      object:$employeeObject
      on_conflict: {
        constraint:employees_pkey,
        update_columns:[id, first_name, last_name, birth_date]
      }
    ) {
      id
    }
    update_business_object_events(where: {event_id: {_eq: $event_id}}, _set: {finished_at: "now()"}) {
      affected_rows
    }
    }
`
const deleteEmployeeInfoByIdMutation = `
mutation deleteEmployeeByIdMutation ($event_id:uuid!, $object_id: String!) {
  delete_employee_cached_model_by_pk (id:$object_id) {
    id
  }
  update_business_object_events(
    where: { event_id: { _eq: $event_id} },
    _set: { finished_at: "now()" }
  ) {
    affected_rows
  }
}
`

export const EmployeeInfoProvider: BusinessObjectSyncProvider = {
    fetchById: fetchById,
    deleteById: deleteEmployeeInfoByIdMutation,
    upsert: upsertEmployeeInfoMutation,
}
