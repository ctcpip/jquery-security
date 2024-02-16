const express = require('express');
const app = express();
const xssApp = express();
const port = 3333;
const xssPort = 3334;
const cors = require('cors');
const chalk = require('chalk');

xssApp.use(cors());

xssApp.get('/jqueryxss', (req, res) => {
	// res.set('content-type', 'text/javascript');
	res.writeHead(200, { 'Content-Type': 'text/javascript' });
	res.write(`triggerCVE('2015-9251');`)
	res.end()
});

xssApp.listen(xssPort, () => {
  console.log(chalk.magenta(`listening on port ${xssPort} (xss endpoint)`));
});

app.use(express.static('../site'));

app.listen(port, () => {
  console.log(chalk.cyan(`listening on port ${port} (test site)`));
  console.log(chalk.green('\nopen http://localhost:3333 in your browser if you want to test manually\n\n'));
});
