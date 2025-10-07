<template>
    <secttion class="feedback-page">
        <h1>Feedback</h1>
        <form @submit.prevent="submitFeedback">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="name" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required />
            </div>
            <textarea v-model="message" placeholder="Share your thoughts" rows="5"></textarea>
            <button type="submit">Submit</button>
        </form>

        <div v-if="feedbacks.length">
            <h2>Previous Feedback</h2>
            <ul>
                <li v-for="(fb, index) in feedbacks" :key="index">
                    <strong>{{ fb.name }} ({{ fb.email }}):</strong>
                    <p>{{ fb.message }}</p>
                </li>
            </ul>
        </div>
    </secttion>
</template>

<script>
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
    methods: {
        submitFeedback() {
            if (this.name && this.email && this.message) {
                this.feedbacks.push({
                    name: this.name,
                    email: this.email,
                    message: this.message
                });
                this.name = '';
                this.email = '';
                this.message = '';
            } else {
                alert('Please fill in all fields.');
            }
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
