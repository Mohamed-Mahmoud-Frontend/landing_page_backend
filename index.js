const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // مكتبة لإنشاء معرفات فريدة

const app = express();
const PORT = process.env.PORT || 5000; // إعداد المنفذ

// إعداد CORS للسماح بجميع النطاقات (للتطوير فقط)
const corsOptions = {
  origin: '*', // السماح بالطلبات من أي نطاق
  methods: 'GET,POST,PUT,DELETE', // السماح بالطرق المختلفة
  allowedHeaders: 'Content-Type,Authorization', // السماح بالعناوين المطلوبة
};

app.use(cors(corsOptions)); // استخدام الـ CORS
app.use(bodyParser.json()); // استخدام body-parser لتحليل JSON

// مصفوفة لتخزين الطلبات
let orders = [];
let lastId = 0; // متغير لتتبع آخر ID مستخدم

// إضافة طلب جديد
app.post('/api/orders', (req, res) => {
  const order = req.body;

  lastId += 1; // زيادة الرقم
  const orderWithIdAndTimestamp = {
    ...order,
    id: lastId, // إضافة الـ ID
    timestamp: new Date().toISOString(), // إضافة التوقيت
  };

  orders.push(orderWithIdAndTimestamp); // إضافة الطلب للمصفوفة
  res.status(201).send({ message: 'Order received', order: orderWithIdAndTimestamp }); // إرسال رد بالطلب الجديد
});

// جلب جميع الطلبات
app.get('/api/orders', (req, res) => {
  res.status(200).json(orders); // إرسال كل الطلبات
});

// تعديل طلب بناءً على ID
app.put('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id); // تحويل الـ ID إلى رقم
  const updatedOrder = req.body;

  const orderIndex = orders.findIndex(order => order.id === id);

  if (orderIndex !== -1) {
    // تحديث الطلب مع الحفاظ على الـ id والتاريخ
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updatedOrder,
      timestamp: new Date().toISOString(), // تحديث الوقت عند التعديل
    };
    res.status(200).send({ message: 'Order updated', order: orders[orderIndex] });
  } else {
    res.status(404).send({ message: 'Order not found' });
  }
});

// حذف طلب بناءً على ID
app.delete('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id); // تحويل الـ ID إلى رقم

  const orderIndex = orders.findIndex(order => order.id === id);

  if (orderIndex !== -1) {
    const deletedOrder = orders.splice(orderIndex, 1); // حذف الطلب
    res.status(200).send({ message: 'Order deleted', order: deletedOrder });
  } else {
    res.status(404).send({ message: 'Order not found' });
  }
});

// حذف جميع الطلبات
app.delete('/api/orders', (req, res) => {
  orders = []; // إعادة تعيين مصفوفة الطلبات
  lastId = 0; // إعادة تعيين الـ id الأخير
  res.status(200).send({ message: 'All orders deleted' });
});

// بدء السيرفر
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
