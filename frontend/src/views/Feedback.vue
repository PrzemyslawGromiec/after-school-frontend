<template>
    <section class="feedback-page">
        <h1>Feedback</h1>
        <form @submit.prevent="submitFeedback">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model.trim="name" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model.trim="email" required />
            </div>
            <textarea v-model="message" placeholder="Share your thoughts" rows="5"></textarea>
            <button type="submit">Submit</button>
        </form>

        <div v-if="feedbacks.length" class="feedback-list">
            <h2>Previous Feedback</h2>
            <ul>
                <li v-for="fb in feedbacks" :key="fb.id">
                    <strong>{{ fb.name }} ({{ fb.email }})</strong>
                    <small> — {{ new Date(fb.createdAt).toLocaleString() }}</small>
                    <p>{{ fb.message }}</p>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { sendFeedback, getFeedback } from '../api/feedback';

export default {
    name: 'Feedback',
    data() {
        return {
            name: '',
            email: '',
            message: '',
            feedbacks: []
        };
    },
    async mounted() {
        this.feedbacks = await getFeedback();
    },
    methods: {
        async submitFeedback() {
            if (!this.name || !this.email || !this.message) return
            await sendFeedback({ name: this.name, email: this.email, message: this.message })
            this.feedbacks = await getFeedback()
            this.message = '',
            this.name = '',
            this.email = ''

        }
    }
};
</script>

<style scoped>
.feedback-page {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
}

textarea {
    width: 100%;
    padding: .5rem;
    margin-bottom: 1rem;
}

button {
    background: #2563eb;
    color: #fff;
    padding: .5rem 1rem;
    border: none;
    border-radius: .25rem;
    cursor: pointer;
}

button:hover {
    background: #1e40af;
}

.feedback-list {
    margin-top: 2rem;
}
</style>
