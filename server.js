const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env
	.USER_PASS}@cluster0.ireya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		console.log('database connected successfully!');
	} finally {
		//   await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('start need spactacle server!');
});

app.listen(port, () => {
	console.log('start server', port);
});
