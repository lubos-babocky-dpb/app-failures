import { liveQuery } from 'dexie';
import { userManagerDb } from '../db';
import { dataSync, SyncableRepository } from '@dpb/data-sync';
import { UserSyncService } from '../sync/user-sync-service';

class UserRepository extends SyncableRepository
{
    static SYNC_SERVICE_ID = 'users';

    constructor() {
        super(userManagerDb.users, UserRepository.SYNC_SERVICE_ID);
        dataSync.registerSyncService(UserRepository.SYNC_SERVICE_ID, new UserSyncService());
    }

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