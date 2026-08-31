export class ApiClient {

    /** @type {string} */ #baseUrl;
    /** @type {string|null} */ #bearerToken;

    constructor({
        baseUrl = '',
        bearerToken = null
    } = {}) {
        this.#baseUrl = baseUrl;
        this.#bearerToken = bearerToken;
    }

    /**
     * @param {string} baseUrl 
     */
    configure(baseUrl) {
        this.#baseUrl = baseUrl;
    }

    /**
     * @param {{url: string, method: string}} endpoint
     * @param {object|null} body
     * @param {string|null} token
     * @param {HeadersInit} additionalHeaders
     * @returns {Promise<any>}
     */
    async request(
        endpoint = {url: '', method: 'GET'},
        body = null,
        token = null,
        additionalHeaders = {}
    ) {
        token ??= this.#bearerToken;
        const options = {
            method: endpoint.method,
            ...(body ? {body: JSON.stringify(body)} : {}),
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...(additionalHeaders || {})
            }
        };
        const response = await fetch(`${this.#baseUrl}${endpoint.url}`, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        if(response.status === 204) {
            return null;
        }

        return await response.json();
    }
}