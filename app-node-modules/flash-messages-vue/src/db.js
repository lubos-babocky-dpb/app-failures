import Dexie from "dexie";

export const flashMessageDb = new Dexie('DPB_FlashMessages');

flashMessageDb.version(1).stores({
    flashMessages: 'uuid, severity, createdAt, readAt'
});