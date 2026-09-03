# @dpb/app-base

`@dpb/app-base` je základný balíček znovupoužiteľných JavaScript helperov určených pre aplikácie DPB.

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
