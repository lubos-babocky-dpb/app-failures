# Modal

Univerzálny Vue modal komponent.

Komponent poskytuje modal s podporou:

- titulku
- vlastného headeru
- vlastného obsahu
- vlastného footeru
- rôznych veľkostí
- zatvorenia kliknutím na overlay
- zatvorenia klávesou `Escape`
- programového otvorenia a zatvorenia
- trigger slotu
- automatického zatvorenia predchádzajúceho otvoreného modalu
- teleportovania modalu do `body`
- blokovania scrollovania stránky počas otvoreného modalu

---

## Základné použitie

```vue
<Modal title="Názov modalu">
    Obsah modalu
</Modal>
```

---

## Title

Titulok modalu je možné nastaviť pomocou `title`.

```vue
<Modal title="Potvrdenie">
    Naozaj chcete pokračovať?
</Modal>
```

Ak nie je nastavený `title` ani `header` slot, header sa vôbec nezobrazí.

---

## Veľkosť

Modal podporuje štyri veľkosti:

- `sm`
- `md`
- `lg`
- `xl`

Predvolená veľkosť je `md`.

```vue
<Modal
    title="Malý modal"
    size="sm"
>
    Obsah
</Modal>
```

```vue
<Modal
    title="Veľký modal"
    size="lg"
>
    Obsah
</Modal>
```

### Dostupné veľkosti

| Size | Tailwind class |
|---|---|
| `sm` | `max-w-sm` |
| `md` | `max-w-lg` |
| `lg` | `max-w-2xl` |
| `xl` | `max-w-4xl` |

---

## Vlastný header

Predvolený header je možné nahradiť pomocou `header` slotu.

```vue
<Modal>
    <template #header>
        <div class="flex items-center gap-2">
            <span>⚠</span>
            <strong>Upozornenie</strong>
        </div>
    </template>

    Obsah modalu
</Modal>
```

Ak použiješ vlastný `header` slot, stále sa zobrazí tlačidlo na zatvorenie modalu.

---

## Obsah

Hlavný obsah modalu sa vkladá do default slotu.

```vue
<Modal title="Detail">
    <p>Toto je obsah modalu.</p>
</Modal>
```

Môže obsahovať ľubovoľný Vue obsah alebo komponenty.

```vue
<Modal title="QR Scanner">
    <QrScanner />
</Modal>
```

---

## Footer

Pre vlastný footer je možné použiť `footer` slot.

```vue
<Modal title="Potvrdenie">
    Naozaj chcete pokračovať?

    <template #footer>
        <div class="flex justify-end gap-2">
            <button type="button">
                Zrušiť
            </button>

            <button type="button">
                Potvrdiť
            </button>
        </div>
    </template>
</Modal>
```

Footer sa zobrazí iba v prípade, že je definovaný `footer` slot.

---

## Otvorenie pomocou trigger slotu

Modal poskytuje `trigger` slot, cez ktorý je dostupná funkcia `open`.

```vue
<Modal>
    <template #trigger="{ open }">
        <button
            type="button"
            @click="open"
        >
            Otvoriť modal
        </button>
    </template>

    Obsah modalu
</Modal>
```

---

## Programové otvorenie pomocou ref

Modal je možné ovládať programovo pomocou Vue `ref`.

```vue
<script setup>
import { ref } from 'vue';

const modal = ref(null);

const openModal = () => {
    modal.value.open();
};

const closeModal = () => {
    modal.value.close();
};
</script>

<template>
    <button
        type="button"
        @click="openModal"
    >
        Otvoriť modal
    </button>

    <Modal ref="modal">
        Obsah modalu
    </Modal>
</template>
```

Komponent poskytuje tieto metódy:

```js
modal.value.open();
modal.value.close();
```

---

## Zatvorenie kliknutím na overlay

Predvolene je možné modal zatvoriť kliknutím mimo jeho obsahu.

```vue
<Modal
    :close-on-overlay="true"
>
    Obsah
</Modal>
```

Predvolená hodnota:

```js
true
```

Ak nechceš povoliť zatvorenie kliknutím na overlay:

```vue
<Modal
    :close-on-overlay="false"
>
    Obsah
</Modal>
```

---

## Zatvorenie klávesou Escape

Predvolene je možné modal zatvoriť stlačením klávesy `Escape`.

```vue
<Modal
    :close-on-escape="true"
>
    Obsah
</Modal>
```

Predvolená hodnota:

```js
true
```

Ak nechceš povoliť zatvorenie klávesou `Escape`:

```vue
<Modal
    :close-on-escape="false"
>
    Obsah
</Modal>
```

---

## Iba jeden otvorený modal

Komponent zabezpečuje, že v jednom okamihu je otvorený iba jeden modal.

Ak sa otvorí nový modal, predchádzajúci otvorený modal sa automaticky zatvorí.

```text
Modal A otvorený
        ↓
otvorenie Modal B
        ↓
Modal A sa zatvorí
        ↓
Modal B sa otvorí
```

Nie je potrebné manuálne sledovať, ktorý modal je aktuálne otvorený.

---

## Scroll lock

Počas otvoreného modalu komponent pridá na `body` triedu:

```text
overflow-hidden
```

Tým sa zabráni scrollovaniu stránky na pozadí.

Po zatvorení modalu sa trieda automaticky odstráni.

---

## Teleport

Modal je renderovaný priamo do `body` pomocou Vue `Teleport`.

```vue
<Teleport to="body">
    ...
</Teleport>
```

Vďaka tomu nie je modal obmedzený DOM hierarchiou rodičovského komponentu.

---

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `String` | `null` | Predvolený titulok modalu |
| `size` | `String` | `md` | Veľkosť modalu |
| `closeOnOverlay` | `Boolean` | `true` | Umožní zatvorenie kliknutím na overlay |
| `closeOnEscape` | `Boolean` | `true` | Umožní zatvorenie klávesou Escape |

### Slots

| Slot | Description |
|---|---|
| `default` | Hlavný obsah modalu |
| `trigger` | Obsah, ktorý môže modal otvoriť |
| `header` | Vlastný obsah headeru |
| `footer` | Obsah footeru |

### Exposed methods

| Method | Description |
|---|---|
| `open()` | Otvorí modal |
| `close()` | Zatvorí modal |