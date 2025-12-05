<template>
  <main class="page lessons-page">
    <h1 class="page-title">
      <img src="@/images/academic.png" alt="" class="title-icon" />
      After School Lessons
    </h1>
    <header class="toolbar" role="search">
      <div class="search">
        <input type="search" v-model="qInput" @input="onSearchInput" placeholder="Search lessons…"
          aria-label="Search lessons" />
        <button v-if="qInput" class="icon-btn" type="button" @click="clearSearch" aria-label="Clear search">×</button>
      </div>

      <label class="visually-hidden" for="sortKey">Sort by</label>
      <select id="sortKey" v-model="sortKey" @change="applySort" aria-label="Sort by">
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="spaces">Spaces</option>
      </select>

      <button class="icon-btn" type="button" @click="toggleDir"
        :aria-label="`Sort ${dir === 'ASC' ? 'descending' : 'ascending'}`">
        {{ dir === 'ASC' ? '⬆️' : '⬇️' }}
      </button>

    </header>

    <section class="grid lessons-grid">
      <LessonCard v-for="l in view" :key="l._id" :lesson="l" @add="add" />
    </section>
  </main>
</template>

<script>
import { getLessons } from '../api/lessons';
import { useCart } from '../stores/cart';
import LessonCard from '../components/LessonCard.vue';

export default {
  components: { LessonCard },
  data: () => ({
    items: [], view: [],
    q: '',              // current query used to fetch
    qInput: '',         // what user is typing
    sortKey: 'subject',
    dir: 'ASC',
    _qTimer: null
  }),
  computed: {
    cartCount() {
      return useCart().count;
    }
  },
  async mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.items = await getLessons(this.q ? { q: this.q } : {});
      console.log('LESSONS FROM BACKEND:', this.items);
      this.view = [...this.items];
      this.applySort();
    },

    onSearchInput() {
      clearTimeout(this._qTimer);
      this._qTimer = setTimeout(async () => {
        this.q = this.qInput.trim();
        this.load();
      }, 300);
    },

    clearSearch() {
      this.qInput = '';
      this.q = '';
      this.load();
    },

    add(l) {
      useCart().add({ id: l._id, title: l.subject, price: l.price });
    },

    applySort() {
      const k = this.sortKey, d = this.dir === 'ASC' ? 1 : -1;
      this.view.sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * d);
    },

    toggleDir() {
      this.dir = this.dir === 'ASC' ? 'DESC' : 'ASC';
      this.applySort();
    }
  }
};
</script>