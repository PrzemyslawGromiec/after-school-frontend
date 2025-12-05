<template>
    <section class="feedback-page">
        <h1 class="feedback-title">Feedback</h1>
        <form class="feedback-form" @submit.prevent="submitFeedback">
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