// server.js
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3001; // اختر المنفذ الذي تريده

app.use(bodyParser.json());

app.post("/submit", (req, res) => {
  const data = req.body;

  // قراءة البيانات السابقة من ملف JSON
  fs.readFile("data.json", "utf8", (err, jsonData) => {
    if (err) {
      return res.status(500).send("فشل في قراءة الملف");
    }

    const json = JSON.parse(jsonData);
    json.push(data); // إضافة البيانات الجديدة

    // كتابة البيانات المحدثة إلى الملف
    fs.writeFile("data.json", JSON.stringify(json, null, 2), (err) => {
      if (err) {
        return res.status(500).send("فشل في كتابة الملف");
      }
      res.status(200).send("تم إرسال البيانات بنجاح");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
