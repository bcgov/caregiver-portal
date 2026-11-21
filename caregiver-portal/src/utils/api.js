export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/';

// The message the middleware sent with an error response, or the fallback.
export async function readErrorMessage(res, fallback) {
    try {
        const body = await res.json();
        const message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
        return message || fallback;
    } catch {
        return fallback; // no JSON body
    }
}

async function request(method, path, body, fallbackMessage) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await readErrorMessage(res, fallbackMessage));
    return res.status === 204 ? null : res.json();
}

// Each throws an Error with a message fit to show the user.
export const getJson = (path, fallbackMessage) => request('GET', path, undefined, fallbackMessage);
export const sendJson = (method, path, body, fallbackMessage) =>
    request(method, path, body, fallbackMessage);



