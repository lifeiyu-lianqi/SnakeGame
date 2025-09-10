const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // 获取请求的文件路径
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // 获取文件扩展名
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    // 读取文件
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 文件不存在
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <h1>404 - 文件未找到</h1>
                    <p>请求的文件 ${req.url} 不存在。</p>
                    <a href="/">返回首页</a>
                `);
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end(`服务器错误: ${error.code}`);
            }
        } else {
            // 成功返回文件
            res.writeHead(200, { 'Content-Type': mimeType + '; charset=utf-8' });
            res.end(content);
        }
    });
});

server.listen(port, () => {
    console.log(`🎮 贪食蛇游戏服务器启动成功！`);
    console.log(`🌐 请在浏览器中访问: http://localhost:${port}`);
    console.log(`🛑 按 Ctrl+C 停止服务器`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 服务器正在关闭...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});
