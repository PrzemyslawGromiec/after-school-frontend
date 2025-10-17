import { http, HttpResponse, delay } from 'msw';
import Feedback from '../views/Feedback.vue';

let lessons = [
  {_id:'1', subject:'Math',    location:'Hendon',    price:100, spaces:5, image:'math.png'},
  {_id:'2', subject:'Music',   location:'Colindale', price: 80, spaces:5, image:'music.png'},
  {_id:'3', subject:'English', location:'Hendon',    price: 90, spaces:5, image:'eng.png'},
  {_id:'4', subject:'Art',     location:'Brent',     price: 70, spaces:5, image:'art.png'},
  {_id:'5', subject:'Drama',   location:'Brent',     price: 85, spaces:5, image:'drama.png'},
  {_id:'6', subject:'Physics', location:'Hendon',    price:110, spaces:5, image:'phys.png'},
  {_id:'7', subject:'Chem',    location:'Colindale', price:105, spaces:5, image:'chem.png'},
  {_id:'8', subject:'Bio',     location:'Hendon',    price: 95, spaces:5, image:'bio.png'},
  {_id:'9', subject:'CS',      location:'Online',    price:120, spaces:5, image:'cs.png'},
  {_id:'10',subject:'Geo',     location:'Online',    price: 75, spaces:5, image:'geo.png'},
];

let feedbacks = [];

export const handlers = [
  // GET /api/lessons?q=...
  http.get('/api/lessons', async ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const data = q ? lessons.filter(l =>
      l.subject.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
    ) : lessons;
    await delay(200);
    return HttpResponse.json(data);
  }),

  http.put('/api/lessons/:id', async ({ params, request }) => {
    const patch = await request.json();
    const i = lessons.findIndex(l => l._id === params.id);
    if (i === -1) return HttpResponse.json({ message:'not found' }, { status:404 });
    lessons[i] = { ...lessons[i], ...patch };
    return HttpResponse.json(lessons[i]);
  }),

  http.post('/api/orders', async ({ request }) => {
  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];
  const customer = body.customer || {};
  const { name = '', phone = '' } = customer;

  // simple validation
  if (!items.length) {
    return HttpResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }
  const nameOk = name.trim().length >= 2;
  const phoneOk = /^\+?[0-9\s-]{7,15}$/.test(phone);
  if (!nameOk || !phoneOk) {
    return HttpResponse.json({ error: 'Invalid name or phone' }, { status: 400 });
  }

  // update lesson spaces
  for (const it of items) {
    const i = lessons.findIndex(l => l._id === (it.id || it.lessonId));
    if (i !== -1) {
      const qty = Math.max(1, Number(it.qty || 1));
      lessons[i].spaces = Math.max(0, lessons[i].spaces - qty);
    }
  }

  // build order payload
  const order = {
    orderId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    customer: { name: name.trim(), phone: phone.trim() },
    items: items.map(i => ({ id: i.id || i.lessonId, qty: Number(i.qty || 1), price: Number(i.price || 0), title: i.title })),
    total: items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.qty || 1), 0)
  };

  return HttpResponse.json(order, { status: 201 });
}),


  //POST /api/feedback
 http.post('/api/feedback', async ({ request }) => {
    const { name, email, message } = await request.json()
    if (!name || !email || !message) {
      return HttpResponse.json({ error: 'name, email, message required' }, { status: 400 })
    }
    const fb = { id: crypto.randomUUID(), name, email, message, createdAt: new Date().toISOString() }
    feedbacks.unshift(fb)
    return HttpResponse.json(fb, { status: 201 })
  }),

  //GET /api/feedback
  http.get('/api/feedback', async () => {
    return HttpResponse.json(feedbacks);
  })
    
 ];