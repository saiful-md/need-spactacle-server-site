const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env
	.USER_PASS}@cluster0.ireya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		console.log('database connected successfully!');
		const database = client.db('needSpactacle');
		const productCollection = database.collection('productCollection');
		const ordersCollection = database.collection('ordersCollection');
		const reviewsCollection = database.collection('reviewsCollection');
		const userProfileCollection = database.collection('userProfileCollection');

		// get product
		app.get('/products', async (req, res) => {
			const result = await productCollection.find({}).toArray();
			res.json(result);
		});
		// buy product
		app.get('/products/:id', async (req, res) => {
			const productId = req.params.id;
			const query = { _id: ObjectId(productId) };
			const result = await productCollection.findOne(query);
			res.json(result);
		});
		//post orders
		app.post('/orders', async (req, res) => {
			const order = req.body;
			const result = await ordersCollection.insertOne(order);
			console.log(result);
			res.json(result);
		});
		// get all orders
		app.get('/orders', async (req, res) => {
			const result = await ordersCollection.find({}).toArray();
			res.json(result);
		});
		// delete orders
		app.delete('/orders/:id', async (req, res) => {
			const deleteId = req.params.id;
			const query = { _id: ObjectId(deleteId) };
			const product = await ordersCollection.deleteOne(query);
			res.json(product);
		});
		//get user orders
		app.get('/user', async (req, res) => {
			const email = req.query.email;
			const query = { email: email };
			const result = await ordersCollection.find(query).toArray();
			res.json(result);
		});
		//post reviews
		app.post('/reviews', async (req, res) => {
			const review = req.body;
			const result = await reviewsCollection.insertOne(review);
			res.json(result);
		});
		app.get('/reviews', async (req, res) => {
			const result = await reviewsCollection.find({}).toArray();
			res.json(result);
		});
		// add a product
		app.post('/products', async (req, res) => {
			const query = req.body;
			const result = await productCollection.insertOne(query);
			res.json(result);
		});

		// post UserProfile info.
		app.post('/userProfile', async (req, res) => {
			const userProfile = req.body;
			const result = await userProfileCollection.insertOne(userProfile);

			res.json(result);
		});
		// get all user profileinfo
		app.get('/userProfile', async (req, res) => {
			const result = await userProfileCollection.find({}).toArray();
			res.json(result);
		});
		// PUT admin for userprofile..
		app.put('/userProfile/admin', async (req, res) => {
			const user = req.body;
			const filter = { email: user.email };
			const updateDoc = { $set: { role: 'admin' } };
			const result = await userProfileCollection.updateOne(filter, updateDoc);
			res.json(result);
		});
		// get admin role
		app.get('/userProfile/:id', async (req, res) => {
			const email = req.params.id;
			const filter = { email: email };
			const result = await userProfileCollection.findOne(filter);

			let isAdmin = false;

			if (result.role === 'admin') {
				isAdmin = true;
			}
			res.json({ admin: isAdmin });
		});
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
