<template>
  <article class="lesson-card card">
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

    cart() {
      return useCart();
    },

    taken() {
      const same = this.cart.items.filter(i => i.id === this.lesson._id);
      if (same.length === 0) return 0;

      // If your cart stores quantities sum them.
      return same.reduce(
        (sum, item) => sum + (item.qty ?? item.quantity ?? 1), 0);
    },

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