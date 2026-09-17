import { flashMessageRepository } from "./repositories/flash-message-repository";

class FlashMessages
{
    async create({
        title,
        body,
        severity
    }) {
        return flashMessageRepository.create({
            title: title,
            body: body,
            severity: severity
        });
    }
}

export const flashMessages = new FlashMessages();