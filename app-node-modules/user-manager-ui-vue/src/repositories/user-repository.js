import { liveQuery } from 'dexie';
import { userManagerDb } from '../db';
import { dataSync, SyncableRepository } from '@dpb/data-sync';
import { UserSyncService } from '../sync/user-sync-service';
import { User } from '../model/user';

class UserRepository extends SyncableRepository
{
    static SYNC_SERVICE_ID = 'users';

    constructor()
    {
        super(userManagerDb.users, UserRepository.SYNC_SERVICE_ID);
        dataSync.registerSyncService(UserRepository.SYNC_SERVICE_ID, new UserSyncService());
    }

    live()
    {
        return liveQuery(async () => this.all());
    }

    async all()
    {
        const records = await userManagerDb.users.toArray();
        return records.map(record => this.convertDatabaseRecordToModel(record));
    }

    async get(uuid)
    {
        return userManagerDb.users.get(uuid);
    }

    convertModelToDatabaseRecord(model)
    {
        return {
            uuid: model.uuid,
            name: model.name,
            email: model.email,
            personal_id: model.personalId,
            permissions: model.permissions,
        };
    }

    /**
     * 
     * @param {object} record 
     * @returns {User}
     */
    convertDatabaseRecordToModel(record)
    {
        return new User({
            uuid: record.uuid,
            name: record.name,
            email: record.email,
            personalId: record.personal_id,
            permissions: record.permissions,
        });
    }
}

export const userRepository = new UserRepository();