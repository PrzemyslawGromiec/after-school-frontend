<template>
  <main class="page cart-page">
    <h1 class="page-title">Cart</h1>

    <section v-if="!items.length" class="empty">
      <p>Your cart is empty.</p>
      <router-link to="/">Browse lessons →</router-link>
    </section>

    <section v-else class="cart-wrap">
      <ul class="cart-list">
        <li v-for="it in items" :key="it.id" class="row">
          <div class="title">{{ it.title }}</div>
          <div class="price">£{{ it.price }}</div>

          <div class="qty">
            <button type="button" class="pill" @click="dec(it)" aria-label="Decrease quantity">−</button>
            <input type="number" min="1" v-model.number="it.qty" @change="onQtyChange(it)" aria-label="Quantity" />
            <button type="button" class="pill" @click="inc(it)" aria-label="Increase quantity">+</button>
          </div>

          <div class="subtotal">£{{ (it.price * it.qty).toFixed(2) }}</div>
          <button type="button" class="remove" @click="remove(it.id)" aria-label="Remove item">×</button>
        </li>
      </ul>

      <aside class="summary">
        <div class="line"><span>Items</span><strong>{{ count }}</strong></div>
        <div class="line total"><span>Total</span><strong>£{{ total.toFixed(2) }}</strong></div>

        <form class="customer" @submit.prevent="checkout">
          <label>
            Name
            <input v-model.trim="customer.name" placeholder="Your name" required />
          </label>
          <label>
            Phone
            <input v-model.trim="customer.phone" placeholder="+44 7700 900123" inputmode="tel" required />
          </label>

          <p v-if="!isValid && touched" class="error">Enter a valid name and phone.</p>

          <button class="primary wfull" type="submit" :disabled="!isValid">Checkout</button>
          <button class="secondary wfull" type="button" @click="clear">Clear cart</button>
        </form>
      </aside>
    </section>
  </main>
</template>

<script>
import { useCart } from '@/stores/cart';
import { api } from '@/api/http';

export default {
  name: 'Cart',
  data: () => ({
    customer: { name: '', phone: '' },
    touched: false
  }),

  watch: {
    'customer.name'(val) {
      this.customer.name = val.trim().replace(/\s+/g, ' ');
    }
  },

  computed: {
    cart() { return useCart(); },
    items() { return this.cart.items || []; },
    count() { return this.cart.count ?? this.items.reduce((a, i) => a + i.qty, 0); },
    total() { return this.cart.total ?? this.items.reduce((a, i) => a + i.qty * i.price, 0); },

    isCorrectNameNoDigitsAndOtherCharacters() {
       return /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(this.customer.name);
    },

    isValid() {
      const nameOk = this.isCorrectNameNoDigitsAndOtherCharacters;
      // simple phone check: digits/space/+/- between 7–15 chars
      const phoneOk = /^\+?[0-9\s-]{7,15}$/.test(this.customer.phone);
      return nameOk && phoneOk && this.items.length > 0;
    }
  },

  methods: {
    inc(it) {
      if (typeof this.cart.add === 'function') {
        this.cart.add({ id: it.id, title: it.title, price: it.price });
      } else {
        it.qty = (it.qty || 1) + 1;
      }
    },

    dec(it) {
      const idx = this.items.findIndex(x => x.id === it.id);
      if (idx === -1) return;
      if ((this.items[idx].qty || 1) > 1) this.items[idx].qty--;
      else this.items.splice(idx, 1);
    },

    remove(id) {
      const idx = this.items.findIndex(x => x.id === id);
      if (idx > -1) this.items.splice(idx, 1);
    },

    onQtyChange(it) {
      if (!it.qty || it.qty < 1) it.qty = 1;
    },

    clear() {
      if (typeof this.cart.clear === 'function') this.cart.clear();
      else this.cart.items = [];
    },

    async checkout() {
      this.touched = true;
      if (!this.isValid) return;

      const payload = {
        customer: { name: this.customer.name, phone: this.customer.phone },
        items: this.items.map(i => ({ id: i.id, qty: i.qty, price: i.price, title: i.title }))
      };

      try {
        const res = await api('/orders', { method: 'POST', body: JSON.stringify(payload) });
        alert(`Order placed! ID: ${res.orderId || 'OK'}`);
        this.clear();
        this.customer.name = '';
        this.customer.phone = '';
        this.$router.push('/');
      } catch (e) {
        alert('Checkout failed: ' + (e.message || e));
      }
    }
  }
};
</script>