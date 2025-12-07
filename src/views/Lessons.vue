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
      this.items = await getLessons({});
      console.log('LESSONS FROM BACKEND:', this.items);
      this.applyFiltersAndSort();
    },

    onSearchInput() {
      clearTimeout(this._qTimer);
      this._qTimer = setTimeout(() => {
        this.q = this.qInput.trim();
        this.applyFiltersAndSort();
      }, 300);
    },

    clearSearch() {
      this.qInput = '';
      this.q = '';
      this.applyFiltersAndSort();
    },

    applyFiltersAndSort() {
      let list = [...this.items];
      const q = this.q.trim().toLowerCase();

      if (q) {
        const qNum = Number(q);
        const isNumeric = !Number.isNaN(qNum);

        list = list.filter(l => {
          const subj = String(l.subject ?? "").toLowerCase();
          const loc = String(l.location ?? "").toLowerCase();

          if (!isNumeric) {
            return subj.includes(q) || loc.includes(q);
          }

          const price = Number(l.price);
          const spaces = Number(l.spaces);

          if (this.sortKey === "price") {
            return price === qNum;
          }

          if (this.sortKey === "spaces") {
            return spaces === qNum;
          }

          return subj.includes(q) || loc.includes(q);
        });
      }

      // sort AFTER filtering
      const k = this.sortKey;
      const d = this.dir === "ASC" ? 1 : -1;

      list.sort((a, b) => {
        const av = a[k];
        const bv = b[k];

        if (av > bv) return 1 * d;
        if (av < bv) return -1 * d;
        return 0;
      });

      this.view = list;
    },

    add(l) {
      useCart().add({ id: l._id, title: l.subject, price: l.price });
    },

    applySort() {
      this.applyFiltersAndSort();
    },

    toggleDir() {
      this.dir = this.dir === 'ASC' ? 'DESC' : 'ASC';
      this.applyFiltersAndSort();
    }
  }
};
</script>