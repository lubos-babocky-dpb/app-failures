import { liveQuery } from 'dexie';
import { db } from '../db';

class UserRepository
{
    live() {
        return liveQuery(() => db.users.toArray());
    }

    async all() {
        return db.users.toArray();
    }

    async get(id) {
        return db.users.get(id);
    }

    async replaceAll(users) {
        await db.users.clear();
        await db.users.bulkPut(users);
    }
}

export const userRepository = new UserRepository();