import { liveQuery } from "dexie";

export const watchableMixin = (Base) => class extends Base {

    watchByUuid(uuid) {
        return liveQuery(async () => this.findByUuid(uuid));
    }

    watchAll() {
        return liveQuery(async () => this.findAll());
    }
}