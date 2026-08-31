# @dpb/app-base-vue

`@dpb/app-base-vue` je základný balíček znovupoužiteľných Vue komponentov a JavaScript helperov určených pre aplikácie DPB.

Balíček slúži ako spoločné miesto pre všeobecne použiteľné stavebné bloky, ktoré nie sú viazané na konkrétnu doménu alebo aplikáciu.

Cieľom balíčka je zabrániť duplicite spoločnej funkcionality a poskytovať jednotné, znovupoužiteľné riešenia pre Vue aplikácie.

## Obsah

Balíček môže obsahovať:

- znovupoužiteľné Vue komponenty
- JavaScript helpery
- utility triedy
- všeobecné API nástroje
- spoločné UI stavebné bloky
- ďalšie všeobecne použiteľné frontendové nástroje

Príklady komponentov:

- modaly
- formulárové sekcie
- tlačidlá
- layout komponenty
- všeobecné input komponenty

Príklady JavaScript nástrojov:

- API klienti
- helper triedy
- utility objekty
- všeobecné frontendové abstrakcie

---

## Inštalácia

Balíček používa Vue ako peer dependency.

```bash
npm install @dpb/app-base-vue
```

Projekt, v ktorom je balíček použitý, musí obsahovať kompatibilnú verziu Vue.

---

## Použitie

Komponenty a JavaScript nástroje sa importujú z balíčka podľa ich exportu.

```js
import { ApiClient } from '@dpb/app-base-vue';
```

Vue komponenty je možné používať v ďalších Vue komponentoch:

```vue
<script setup>
import { Modal } from '@dpb/app-base-vue';
</script>

<template>
    <Modal title="Ukážkový modal">
        Obsah modalu
    </Modal>
</template>
```

---

# Komponenty

## Modal

Univerzálny Vue modal komponent.

Podporuje:

- titulok
- vlastný header
- vlastný obsah
- vlastný footer
- rôzne veľkosti
- zatvorenie kliknutím na overlay
- zatvorenie klávesou `Escape`
- programové otvorenie a zatvorenie
- trigger slot
- automatické zatvorenie predchádzajúceho otvoreného modalu
- teleportovanie do `body`
- blokovanie scrollovania stránky počas otvoreného modalu

Podrobná dokumentácia:

[Modal](./docs/Modal.md)

---

## FormSection

Znovupoužiteľný vizuálny kontajner pre sekcie formulára.

Komponent slúži ako stavebný blok formulárov, ktorého obsah je plne definovaný rodičovským komponentom.

Príklad použitia:

```vue
<FormSection>
    <div v-if="selectedItem">
        <ItemInfo :item="selectedItem" />
    </div>

    <div v-else>
        Nebola vybraná žiadna položka.
    </div>
</FormSection>
```

`FormSection` nepozná konkrétnu doménovú logiku svojho obsahu.

Môže byť použitý napríklad pre:

- výber položky
- výber vozidla
- výber poruchy
- výber používateľa
- zobrazenie vybraného objektu
- vlastný formulárový obsah

---

# JavaScript nástroje

## ApiClient

Základný klient pre komunikáciu s HTTP API.

```js
import { ApiClient } from '@dpb/app-base-vue';

const apiClient = new ApiClient({
    baseUrl: '/api',
});
```

Klient podporuje konfiguráciu základnej URL a Bearer tokenu.

```js
const apiClient = new ApiClient({
    baseUrl: 'https://example.com/api',
    bearerToken: 'token',
});
```

### Konfigurácia

Základnú URL je možné zmeniť aj po vytvorení klienta.

```js
apiClient.configure('/api');
```

### Request

```js
const response = await apiClient.request(
    {
        url: '/users',
        method: 'GET',
    }
);
```

Request s dátami:

```js
const response = await apiClient.request(
    {
        url: '/users',
        method: 'POST',
    },
    {
        name: 'John Doe',
    }
);
```

Request s vlastným tokenom:

```js
const response = await apiClient.request(
    {
        url: '/users',
        method: 'GET',
    },
    null,
    'custom-token'
);
```

Request s dodatočnými headers:

```js
const response = await apiClient.request(
    {
        url: '/users',
        method: 'GET',
    },
    null,
    null,
    {
        'X-Custom-Header': 'value',
    }
);
```

---

# Architektúra

Balíček je určený pre všeobecne použiteľné komponenty a nástroje.

Doménová logika konkrétnej aplikácie sem nepatrí.

Napríklad:

```text
@dpb/app-base-vue
├── components
│   ├── actions
│   │   └── Modal.vue
│   │
│   ├── forms
│   │   └── FormSection.vue
│   │
│   └── ...
│
├── api
│   └── ApiClient.js
│
├── helpers
│   └── ...
│
├── utils
│   └── ...
│
└── index.js
```

Princíp je jednoduchý:

```text
Konkrétna aplikácia
        │
        ├── používa
        ▼
@dpb/app-base-vue
        │
        ├── Vue komponenty
        ├── JavaScript helpery
        ├── utility triedy
        └── všeobecné frontendové nástroje
```

---

# Čo do balíčka patrí

Do `@dpb/app-base-vue` patria veci, ktoré sú všeobecne znovupoužiteľné.

Napríklad:

```text
✓ Modal
✓ FormSection
✓ ApiClient
✓ všeobecný input komponent
✓ všeobecný button komponent
✓ všeobecný date picker
✓ všeobecný upload komponent
✓ všeobecný JavaScript helper
```

---

# Čo do balíčka nepatrí

Do balíčka nepatrí logika viazaná na konkrétnu doménu alebo aplikáciu.

Napríklad:

```text
✗ ReportableAsset
✗ FailureSelector
✗ ReportableAssetRepository
✗ konkrétna logika nahlasovania poruchy
✗ konkrétne API endpointy aplikácie
```

Takáto funkcionalita patrí do balíčka alebo aplikácie, ktorá vlastní príslušnú doménu.

---

# Dokumentácia

Dokumentácia jednotlivých komponentov a nástrojov sa nachádza v priečinku:

```text
docs/
```

Každý komplexnejší komponent alebo nástroj by mal mať vlastný dokumentačný súbor.

Príklad:

```text
docs/
├── Modal.md
├── FormSection.md
├── ApiClient.md
└── ...
```

---

# Princíp balíčka

`@dpb/app-base-vue` nie je balíček pre jednu konkrétnu stránku alebo jednu konkrétnu funkcionalitu.

Je to spoločný základ, z ktorého môžu ďalšie Vue aplikácie a balíčky skladať vlastné používateľské rozhrania a frontendovú funkcionalitu.

```text
Reusable
    ↓
@dpb/app-base-vue
    ↓
Application-specific components
    ↓
Application pages
```