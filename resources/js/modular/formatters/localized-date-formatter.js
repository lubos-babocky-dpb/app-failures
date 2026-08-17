import { i18n } from '../i18n.js';

export class LocalizedDateFormatter
{
    static format(dateString)
    {
        if (!dateString) {
            return '';
        }

        const date = new Date(dateString);

        const localeMap = {
            sk: 'sk-SK',
            ru: 'ru-RU',
            en: 'en-US',
        };

        const locale = localeMap[i18n.global.locale.value] ?? 'en-US';

        return `${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit'
        })}`
    }
}