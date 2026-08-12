// 외부 패키지 없이 Carrier GreenON 정적 파일을 제공하는 간단한 서버입니다.
// 이후 Render 배포 단계에서도 그대로 시작 명령으로 사용할 수 있습니다.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3000;
const publicFiles = { '/': 'index.html', '/index.html': 'index.html', '/styles.css': 'styles.css', '/app.js': 'app.js', '/assets/greenon-mascot.png':'assets/greenon-mascot.png' };
const rewardFiles = new Set(['eco-coffee-coupon.png', 'eco-snack-set.png', 'reusable-eco-bag.png', 'mini-plant-kit.png', 'filter-care-kit.png', 'carrier-care-package.png']);
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.png':'image/png' };

const server = http.createServer((request, response) => {
  // Publishable key만 브라우저에 전달합니다. service_role/secret key는 절대 이 경로에 포함하지 않습니다.
  if (request.url === '/config.js') {
    const config = {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
      weatherApiUrl: process.env.WEATHER_API_URL || '',
    };
    response.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(`window.__GREENON_CONFIG = ${JSON.stringify(config)};`);
    return;
  }

  // 주소에 등록된 파일만 반환해 의도하지 않은 파일 경로 접근을 막습니다.
  const rewardFile = request.url?.startsWith('/reward/') ? request.url.slice('/reward/'.length) : '';
  const fileName = publicFiles[request.url] || (rewardFiles.has(rewardFile) ? path.join('reward', rewardFile) : '');
  if (!fileName) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('페이지를 찾을 수 없습니다.');
    return;
  }
  fs.readFile(path.join(__dirname, fileName), (error, content) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('파일을 불러오는 중 문제가 발생했습니다.');
      return;
    }
    response.writeHead(200, { 'Content-Type': contentTypes[path.extname(fileName)] || 'text/plain; charset=utf-8' });
    response.end(content);
  });
});

server.listen(port, () => console.log(`Carrier GreenON이 http://localhost:${port} 에서 실행 중입니다.`));
