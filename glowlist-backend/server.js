const express = require('express');
const app =  express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Selamat Datang di GlowList API 💄');
});

app.listen(PORT, () => {
    console.log(`Server GlowList jalan di http://localhost:${PORT}`)
});
