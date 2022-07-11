import { BusinessObjectSyncProvider } from "./BusinessObjectSynchronizerProvider"
import { EmployeeInfoProvider } from "./EmployeeSynchronizer"
// NOTE: Add new providers to this config map
export const businessObjectProviderMap: {
    [key: string]: BusinessObjectSyncProvider
} = {
    employee: EmployeeInfoProvider,
}
