import Dexie from "dexie";

export const dataSyncDb = new Dexie('DPB_DataSync');

dataSyncDb.version(1).stores({
    syncQueue: 'uuid, syncService, modelUuid, changedAt'
})