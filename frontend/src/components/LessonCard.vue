<template>
  <article class="card">
    <img :src="imgUrl" alt="" class="lesson-img" loading="lazy" />
    <h3>{{ lesson.subject }}</h3>
    <p>Location: {{ lesson.location }} </p>
    <p>Price: £{{ lesson.price }} </p>
    <p :class="lesson.spaces > 0 ? 'ok' : 'out'">{{ lesson.spaces > 0 ? `${lesson.spaces} left` : 'Sold out' }}</p>
    <button :disabled="lesson.spaces === 0" @click="$emit('add', lesson)">Add to cart</button>
  </article>
</template>

<script>
const imageMap = import.meta.glob('@/images/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default'
});

function resolveImage(name) {
  return imageMap[`/src/images/${name}.png`] || imageMap['/src/images/placeholder.png'];
}

export default {
  props: { lesson: { type: Object, required: true } },
  computed: {
    imgUrl() {
      return resolveImage(this.lesson.subject.toLowerCase());
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  background: #fff;
}

.lesson-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: .5rem;
}

.ok {
  color: #0f766e
}

.out {
  color: #b91c1c
}

button {
  margin-top: auto;
  padding: .5rem 1rem;
  border: none;
  border-radius: .25rem;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
