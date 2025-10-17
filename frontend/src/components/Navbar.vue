<template>
  <nav class="nav">
    <div class="wrap">
      <router-link to="/">Lessons</router-link>
      <router-link to="/cart" class="cart" :class="{ 'has-items': cart.count > 0 }">
        Cart <span class="badge">{{ cart.count }}</span>
      </router-link>
      <router-link to="/feedback">Feedback</router-link>
    </div>
  </nav>
</template>

<script>
import { useCart } from '../stores/cart.js';
export default { computed: { cart: () => useCart() } };
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, .75);
  border-bottom: 1px solid #e5e7eb;
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 1rem;
}

.nav a {
  text-decoration: none;
  color: #111827;
  padding: .45rem .7rem;
  border-radius: .5rem;
  transition: background .15s, color .15s, border-color .15s;
}

.nav a:hover {
  background: #f3f4f6;
}

.nav a:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.nav a.router-link-active {
  color: #1e3a8a;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
}

.nav a.cart .badge {
  display: inline-block;
  min-width: 1.4rem;
  margin-left: .4rem;
  padding: .05rem .35rem;
  border-radius: 999px;
  background: #fff;
  color: #1e3a8a;
  font-weight: 700;
  text-align: center;
}

.nav a.cart.has-items {
  background: #2563eb;
  color: #fff;
  border-color: transparent;
}

.nav a.cart.has-items:hover {
  background: #1e40af;
}

/* responsive spacing */
@media (max-width:640px) {
  .wrap {
    gap: .25rem;
  }

  .nav a {
    padding: .4rem .6rem;
  }
}
</style>
