const express = require('express');
const server = express();
const nunjucks = require('nunjucks');

const { pageLanding, pageStudy, pageGiveClasses, saveClasses } = require('./src/pages/pages.js');

// config nunjucks (template engine)
nunjucks.configure('src/pages', {
    express: server,
    noCache: true,
});

// config static files (html, css, imgs, ...)
// app routes
server.use(express.static("src"))
.use(express.urlencoded({ extended: true }))
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/giveClasses", pageGiveClasses)
.post("/saveClasses", saveClasses);

// listening
const port = 8080;
server.listen(port, () => {
    console.log(`Server is running in localhost:${port}`);
});
