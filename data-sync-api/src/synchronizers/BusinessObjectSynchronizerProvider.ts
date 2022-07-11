export interface BusinessObjectSyncProvider {
    // A function which fetchs data from an API that will be synced to the Business Object
    fetchById: Function

    // A function which receives the result of the fetchById query and returns the data to be upserted into the Business Object
    upsert: string

    // A function which deletes a Business Object by ID
    deleteById: string
}
