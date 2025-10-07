import { api } from './http';

export async function sendFeedback(message) {
    return api('/feedback', {
        method: 'POST',
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function getFeedback() {
    return api('/feedback');
}