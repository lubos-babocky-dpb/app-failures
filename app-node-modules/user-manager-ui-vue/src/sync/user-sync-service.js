import { flashMessages } from '@dpb/flash-messages-vue/sw';
import { UserManagerApiService } from '../api/user-manager-api-service';
import { userManagerDb } from '../db';

export class UserSyncService
{
    /** @type {UserManagerApiService} */
    #apiService;

    constructor(apiService) {
        this.#apiService = apiService;
    }

    async syncAllFromApi() {
        try {
            const response = await this.#apiService.getUsers();
            const users = await response.json();
            await userManagerDb.users.clear();
            await userManagerDb.users.bulkPut(users);
        } catch(ex) {
            console.error('syncAllFromApi', ex);
        }
    }

    /**
     * 
     * @param {string} modelUuid 
     * @param {object} delta 
     * @returns {boolean}
     */
    async create(modelUuid, delta) {
        const response = await this.#apiService.createUser(delta);
        if(response.status !== 201) {
            const message = (await response.json()).message;
            console.warn(`Error while creating user: ${message}`);
            return false;
        }
        return true;
    }

    async update(modelUuid, delta)
    {
        try {
            const response = await this.#apiService.updateUser(modelUuid, delta);
    
            console.log(`Update user ${modelUuid}`, delta);
            console.log('response: ', response);
            console.log('response json: ', await response.json());
        } catch (ex) {
            console.log(ex);
        }
    }

    /**
     * 
     * @param {string} uuid 
     * @returns {boolean}
     */
    async delete(uuid) {
        try {
            const response = await this.#apiService.deleteUser(uuid);
            if(response.status !== 204) {
                const responseJson = await response.json();
                await userManagerDb.users.put(responseJson.user);
                await flashMessages.create({
                    title: 'Error',
                    body: responseJson.message,
                    severity: 'error'
                })
            }
            return true;
        } catch (error) {
            console.error('UserSyncService.delete(): ', error);
            return false;
        }
    }
}