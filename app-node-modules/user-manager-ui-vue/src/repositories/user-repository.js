import { liveQuery } from 'dexie';
import { userManagerDb } from '../db';

class UserRepository
{
    live() {
        return liveQuery(() => userManagerDb.users.toArray());
    }

    async all() {
        return userManagerDb.users.toArray();
    }

    async get(uuid) {
        return userManagerDb.users.get(uuid);
    }
}

export const userRepository = new UserRepository();