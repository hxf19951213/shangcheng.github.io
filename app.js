// 引入express
let express = require('express');
// 引入ejs
let ejs = require('ejs');
// 服务器模块
let http = require('http')
let https = require('https')
// 引入fs和path
let fs = require('fs');
let path = require('path');

// 创建应用
let app = express();
// 拓展名
app.engine('.html', ejs.__express);

// 实现资源静态化
// static请求静态化
app.use('/static/', express.static(path.join(process.cwd(), './static/')))
app.use('/favicon.ico', express.static(path.join(process.cwd(), './static/favicon.ico')))

// 路由，
app.get('/', (req, res) => {
    res.render('home.html')
})
// 后台管理系统的路由
app.get('/admin', (req, res) => {
    res.render('admin.html')
})

// mock数据
app.use('/data/', (req, res, next) => {
    // 添加拓展名
    // req.url += '.json';
    // console.log(req.url)
    // 1 切割url
    let arr = req.url.split('?')
    // 2 添加拓展名
    arr[0] += '.json';
    // 3 拼接地址
    req.url = arr.join('?')
    // 进入下一个中间件
    next();
}, express.static(path.join(process.cwd(), './static/data/')))


// 服务器，
// 端口号
let httpPort = 3001;
let httpsPort = 3002;
// 读取秘钥文件
let key = fs.readFileSync(path.join(process.cwd(), './ssl/private.pem'));
let cert = fs.readFileSync(path.join(process.cwd(), './ssl/file.crt'));
// http
http.createServer(app)
    .listen(httpPort, res => console.log('http port listen at ' + httpPort))
// https
https.createServer({ key, cert }, app)
    .listen(httpsPort, res => console.log('https port listen at ' + httpsPort))
