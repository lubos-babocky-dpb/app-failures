import Dexie from "dexie";

const database = new Dexie('AdminUiDatabase');

database.version(1).stores({
    auth: 'id'
});

export default database;