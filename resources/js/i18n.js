import { createI18n } from 'vue-i18n';

const messages = {
    sk: {
        nav: { new_report: 'Nové hlásenie', history: 'História' },
        report: {
            title: 'Nahlásiť novú poruchu',
            vehicle: 'Vozidlo',
            select_vehicle: 'Vyber vozidlo',
            description: 'Popis poruchy',
            placeholder: 'Napr. nejdú otvoriť dvere...',
            submit: 'Uložiť poruchu',
            success: 'Porucha bola uložená offline.'
        },
        history: { title: 'História nahlásených porúch', empty: 'Zoznam je prázdny.' }
    },
    en: {
        nav: { new_report: 'New Report', history: 'History' },
        report: {
            title: 'Report New Failure',
            vehicle: 'Vehicle',
            select_vehicle: 'Select vehicle',
            description: 'Description',
            placeholder: 'E.g., third door is jammed...',
            submit: 'Save Report',
            success: 'Failure saved offline.'
        },
        history: { title: 'Failure History', empty: 'No failures found.' }
    },
    ru: {
        nav: { new_report: 'Новый отчет', history: 'История' },
        report: {
            title: 'Сообщить о неисправности',
            vehicle: 'Транспортное средство',
            select_vehicle: 'Выберите транспорт',
            description: 'Описание неисправности',
            placeholder: 'Например, не открывается третья дверь...',
            submit: 'Сохранить',
            success: 'Неисправность сохранена автономно.'
        },
        history: { title: 'История неисправностей', empty: 'История пуста.' }
    }
};

export const i18n = createI18n({
    legacy: false,
    locale: 'sk',
    fallbackLocale: 'en',
    messages
});