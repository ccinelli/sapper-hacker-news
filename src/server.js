import express from 'express';
import compression from 'compression';
import serve from 'serve-static';
import * as sapper from '../__sapper__/server.js';

const app = express() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		serve('static'),
		sapper.middleware()
	);

app.listen(process.env.PORT || 8080);

import spdy from 'spdy';
if (process.env.SSL_PORT !== 0) {
	const sslPort = process.env.SSL_PORT || 8443;
	const fs = require('fs');
	try {
		const sslOpt = {
			key:  fs.readFileSync(`${__dirname}/../../certificates/server.key`),
			cert: fs.readFileSync(`${__dirname}/../../certificates/server.crt`),
		};
		spdy.createServer(sslOpt, app).listen(sslPort, () => console.log(`Listening HTTP2 on port ${sslPort}`));
	} catch (e) {
		console.log(e.stack || e);
	}
}