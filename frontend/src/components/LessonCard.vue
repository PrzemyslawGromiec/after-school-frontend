<template>
  <article class="card">
    <img :src="imgUrl" alt="" class="lesson-img" loading="lazy" />
    <h3>{{ lesson.subject }}</h3>
    <p>Location: {{ lesson.location }} </p>
    <p>Price: £{{ lesson.price }} </p>
    <p :class="spacesLeft > 0 ? 'ok' : 'out'">
      {{ spacesLeft > 0 ? `${spacesLeft} left` : 'Sold out' }}
    </p>

    <button :disabled="!canAdd" @click="handleClick">
      Add to cart
    </button>

  </article>
</template>

<script>
import { useCart } from '../stores/cart';

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
    },

    // access Pinia cart store
    cart() {
      return useCart();
    },

     taken() {
    const same = this.cart.items.filter(i => i.id === this.lesson._id);
    if (same.length === 0) return 0;

    // If your cart stores quantities (qty or quantity), sum them.
    return same.reduce(
      (sum, item) => sum + (item.qty ?? item.quantity ?? 1),
      0
    );
  },

    // spaces shown on the card = DB spaces - how many already in cart
    spacesLeft() {
      return this.lesson.spaces - this.taken;
    },

    canAdd() {
      return this.spacesLeft > 0;
    }
  },

  methods: {
    handleClick(event) {
      this.$emit('add', this.lesson);
      const btn = event.target;
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 300);
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
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}

.card:is(:hover, :focus-within) {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, .20);
  border-color: #c7d2fe;
}

.card :is(a, button, input, select, textarea):focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
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

button.clicked {
  background: #16a34a;
  /* green */
  transition: background 0.4s;
}

button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
