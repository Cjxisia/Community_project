const express = require('express');
const app = express();
const mainrouter = require('./routes/mainrouter.js')
const notice_board_router = require('./routes/notice_board_router.js')
const community_router = require('./routes/community_router.js')

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use('/', mainrouter);
app.use('/', notice_board_router);
app.use('/', community_router);

app.use((req, res, next) => { // 다른곳 진입했을경우 실행
    res.status(404).send('Not Found');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
 });
 