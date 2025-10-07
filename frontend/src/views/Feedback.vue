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

h1 {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1e3a8a;
  letter-spacing: -0.5px;
  position: relative;
}

h1::after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: #2563eb;
  margin: 0.5rem auto 0;
  border-radius: 2px;
}


input,
textarea {
    width: 100%;
    padding: .5rem .75rem;
    border: 1px solid #d1d5db;
    margin-bottom: 1rem;
    font-size: 1rem;
    background-color: #f9fafb;
    color: #111827;
    transition: border-color 0.2s, box-shadow 0.2s
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
    background-color: #fff;
}

label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 500;
    color: #374151;
}

button {
    background: #2563eb;
    color: #fff;
    padding: .5rem 1rem;
    border: none;
    border-radius: .25rem;
    cursor: pointer;
    transition: background 0.5s;
}

button:hover {
    background: #1e40af;
}

.feedback-list {
    margin-top: 2rem;
}
</style>
