const http = require('http');
const fs = require('fs');
const path = require('path');

// Load mock data
const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock-data.json'), 'utf8'));

const PORT_NUMMER = 3001;
const API_VERSION = 'v4';

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function send404(res) {
  sendJSON(res, 404, { error: 'Not found' });
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT_NUMMER}`);
  const pathname = url.pathname;

  const cleanPath = pathname.replace(/^\//, '').replace(`${API_VERSION}/`, '');

  // Routes
  switch (req.method) {
    case 'HEAD':
      if (cleanPath === 'ping') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return;
      }
      break;

    case 'GET':
      if (cleanPath === 'contributors') {
        sendJSON(res, 200, mockData.contributors);
        return;
      }

      if (cleanPath === 'manager') {
        sendJSON(res, 200, mockData.manager);
        return;
      }

      if (cleanPath === 'patches/list') {
        sendJSON(res, 200, mockData.patches);
        return;
      }
 
      if (cleanPath === 'team') {
        sendJSON(res, 200, mockData.team);
        return;
      }


      if (cleanPath === 'about') {
        sendJSON(res, 200, mockData.about);
        return;
      }

      if (cleanPath === 'announcements') {
        const tags = url.searchParams.get('tags');
        const count = url.searchParams.get('count');
        const cursor = url.searchParams.get('cursor');

        let filtered = [...mockData.announcements];

        if (tags) {
          const tagList = tags.split(',');
          filtered = filtered.filter(a => 
            a.tags && a.tags.some(tag => tagList.includes(tag))
          );
        }

        if (cursor) {
          const cursorNum = parseInt(cursor);
          filtered = filtered.filter(a => a.id > cursorNum);
        }

        if (count) {
          filtered = filtered.slice(0, parseInt(count));
        }

        sendJSON(res, 200, filtered);
        return;
      }

      const announcementMatch = cleanPath.match(/^announcements\/(\d+)$/);
      if (announcementMatch) {
        const id = parseInt(announcementMatch[1]);
        const announcement = mockData.announcements.find(a => a.id === id);
        if (announcement) {
          sendJSON(res, 200, announcement);
        } else {
          send404(res);
        }
        return;
      }

      if (cleanPath === 'announcements/tags') {
        sendJSON(res, 200, mockData.announcementTags);
        return;
      }

      // Token endpoint (for auth)
      if (cleanPath === 'token') {
        // Simple mock - in real implementation this would use Digest auth
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzUwMDAwMDAsImlzcyI6InJldmFuY2VkIiwiaWF0IjoxNzM0MDAwMDAwfQ.mock_signature';
        sendJSON(res, 200, { token: mockToken });
        return;
      }

      break;

    case 'POST':
      // Admin endpoints - just acknowledge for now
      if (cleanPath.startsWith('announcements')) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          console.log('POST body:', body);
          sendJSON(res, 200, { success: true, message: 'Mock: Announcement created/modified' });
        });
        return;
      }
      break;

    case 'PATCH':
      if (cleanPath.startsWith('announcements')) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          console.log('PATCH body:', body);
          sendJSON(res, 200, { success: true, message: 'Mock: Announcement updated' });
        });
        return;
      }
      break;

    case 'DELETE':
      if (cleanPath.startsWith('announcements')) {
        sendJSON(res, 204, null);
        return;
      }
      break;
  }

  // Default 404
  send404(res);
});

server.listen(PORT_NUMMER, () => {
  console.log(`\nMock API Server running at http://localhost:${PORT_NUMMER}`);
  console.log(`API Base: http://localhost:${PORT_NUMMER}/${API_VERSION}/`);
  console.log(`\nTo use with frontend:`);
  console.log(`   1. Open browser console`);
  console.log(`   2. Run: localStorage.setItem('revanced_api_url', 'http://localhost:${PORT_NUMMER}')`);
  console.log(`   3. Reload the page\n`);
});
