const express = require('express');
const app = express();
const xssApp = express();
const port = 3333;
const xssPort = 3334;
const cors = require('cors');

xssApp.use(cors());

xssApp.get('/jqueryxss', (req, res) => {
	// res.set('content-type', 'text/javascript');
	res.writeHead(200, { 'Content-Type': 'text/javascript' });
	res.write(`triggerCVE('2015-9251');`)
	res.end()
});

xssApp.listen(xssPort, () => {
  console.log(`listening on port ${xssPort} (xss endpoint)`);
});

app.use(express.static('../site'));

app.listen(port, () => {
  console.log(`listening on port ${port} (test site)`);
});

