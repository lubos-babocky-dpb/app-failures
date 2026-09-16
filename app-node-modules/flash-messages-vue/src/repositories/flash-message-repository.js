import { liveQuery } from 'dexie';
import { flashMessageDb } from '../db.js';
import { FlashMessage } from '../models/flash-message.js';

class FlashMessageRepository
{
    async create(data) {
        const message = new FlashMessage(data);

        await flashMessageDb.flashMessages.add({
            uuid: message.uuid,
            title: message.title,
            body: message.body,
            severity: message.severity,
            createdAt: message.createdAt,
            readAt: message.readAt,
        });

        return message;
    }

    async deleteAll() {
        await flashMessageDb.flashMessages.clear();
    }

    async markAsRead(uuid) {
        await flashMessageDb.flashMessages.update(uuid, {
            readAt: Date.now(),
        });
    }

    async markAllAsRead() {
        await flashMessageDb.flashMessages
            .toCollection()
            .modify({
                readAt: Date.now(),
            });
    }

    live() {
        return liveQuery(() =>
            flashMessageDb.flashMessages
                .orderBy('createdAt')
                .reverse()
                .toArray()
        );
    }

    liveUnread() {
        return liveQuery(() =>
            flashMessageDb.flashMessages
                .toCollection()
                .filter(message => message.readAt === null)
                .toArray()
        );
    }
}

export const flashMessageRepository = new FlashMessageRepository();