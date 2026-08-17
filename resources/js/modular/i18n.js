import { createI18n } from 'vue-i18n';

const messages = {
    sk: {
        nav: {
            new_report: 'Nové hlásenie',
            history: 'História',
            failure_detail: 'Detail poruhy'
        },
        report: {
            title: 'Nahlásiť novú poruchu',
            vehicle: 'Vozidlo',
            select_vehicle: 'Vyber vozidlo',
            description: 'Popis poruchy / Kategória',
            placeholder: 'Napr. nejdú otvoriť dvere...',
            submit: 'Uložiť poruchu',
            success: 'Porucha bola uložená offline.',
            accepted: 'Hlásenie prijaté',
            success_sub: 'Porucha bola úspešne zaznamenaná do systému.',
            unknown_vehicle: 'Neznáme vozidlo',
            load_again: 'Načítať vozidlo znova',
            select_failure_btn: 'Vybrať poruchu',
            add_photo: 'Pridať foto (nepovinné)',
            error_scan_first: '⚠ NAJSKÔR NASKENUJTE VOZIDLO!',
            modal_title: 'Výber poruchy',
            back: '← SPÄŤ'
        },
        history: { 
            title: 'História hlásení', 
            empty: 'Žiadne nahlásené poruchy',
            loading: 'Načítavam históriu...',
            no_photo: 'Bez fotky',
            code_label: 'Kód',
            no_note: 'Bez poznámky'
        },
        status: {
            pending_sync: 'Čaká na sieť',
            synced: 'Odoslané',
            reported: 'Nahlásené',
            accepted: 'Prijaté',
            resolved: 'Vyriešené'
        }
    },
    en: {
        nav: {
            new_report: 'New Report',
            history: 'History',
            failure_detail: 'Failure Detail'
        },
        report: {
            title: 'Report New Failure',
            vehicle: 'Vehicle',
            select_vehicle: 'Select vehicle',
            description: 'Description / Category',
            placeholder: 'E.g., third door is jammed...',
            submit: 'Save Report',
            success: 'Failure saved offline.',
            accepted: 'Report accepted',
            success_sub: 'The failure has been successfully recorded in the system.',
            unknown_vehicle: 'Unknown vehicle',
            load_again: 'Change vehicle',
            select_failure_btn: 'Select failure',
            add_photo: 'Add photo (optional)',
            error_scan_first: '⚠ SCAN VEHICLE FIRST!',
            modal_title: 'Select failure',
            back: '← BACK'
        },
        history: { 
            title: 'Failure History', 
            empty: 'No failures found.',
            loading: 'Loading history...',
            no_photo: 'No photo',
            code_label: 'Code',
            no_note: 'No note'
        },
        status: {
            pending_sync: 'Pending sync',
            synced: 'Sent',
            reported: 'Reported',
            accepted: 'Accepted',
            resolved: 'Resolved'
        }
    },
    ru: {
        nav: {
            new_report: 'Новый отчет',
            history: 'История',
            failure_detail: '???'
        },
        report: {
            title: 'Сообщить о неисправности',
            vehicle: 'Транспортное средство',
            select_vehicle: 'Выберите транспорт',
            description: 'Описание неисправности / Категория',
            placeholder: 'Например, не открывается третья дверь...',
            submit: 'Сохранить',
            success: 'Неисправность сохранена автономно.',
            accepted: 'Отчет принят',
            success_sub: 'Неисправность была успешно зарегистрирована в системе.',
            unknown_vehicle: 'Неизвестный транспорт',
            load_again: 'Повторить',
            select_failure_btn: 'Выбрать неисправность',
            add_photo: 'Добавить фото (опция)',
            error_scan_first: '⚠ СНАЧАЛА ОТСКАНИРУЙТЕ ТРАНСПОРТ!',
            modal_title: 'Выбор неисправности',
            back: '← НАЗАД'
        },
        history: { 
            title: 'История неисправностей', 
            empty: 'История пуста.',
            loading: 'Загрузка истории...',
            no_photo: 'Без фото',
            code_label: 'Код',
            no_note: 'Без примечания'
        },
        status: {
            pending_sync: 'Ожидание сети',
            synced: 'Отправлено',
            reported: 'Заявлено',
            accepted: 'Принято',
            resolved: 'Решено'
        }
    }
};

export const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('dpb_locale') || 'sk',
    fallbackLocale: 'en',
    messages
});