const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // مكتبة لإنشاء معرفات فريدة

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

let orders = [];

let orders = [];
let lastId = 0; // متغير لتتبع آخر ID مستخدم

// إضافة طلب جديد
app.post('/api/orders', (req, res) => {
  const order = req.body;

  lastId += 1; // زيادة الرقم
  const orderWithIdAndTimestamp = {
    ...order,
    id: lastId,
    timestamp: new Date().toISOString(),
  };

  orders.push(orderWithIdAndTimestamp);
  res.status(201).send({ message: 'Order received', order: orderWithIdAndTimestamp });
});


// جلب جميع الطلبات
app.get('/api/orders', (req, res) => {
  res.status(200).json(orders);
});

// تعديل طلب بناءً على ID
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
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
  const { id } = Number(req.params.id);

  const orderIndex = orders.findIndex(order => order.id === id);

  if (orderIndex !== -1) {
    const deletedOrder = orders.splice(orderIndex, 1); // حذف الطلب
    res.status(200).send({ message: 'Order deleted', order: deletedOrder });
  } else {
    res.status(404).send({ message: 'Order not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
