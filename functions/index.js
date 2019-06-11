const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();


// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var itemsRef = db.collection('items');

app.post('/api/items', async (req, res) => {
    try {
        let querySnapshot = await itemsRef.get();
        let numRecords = querySnapshot.docs.length;
        let item = {
            id: numRecords + 1,
            title: req.body.title,
            path: req.body.path,
            description: req.body.description
        };
        itemsRef.doc(item.id.toString()).set(item);
        res.send(item);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.get('/api/items', async (req, res) => {
    try{
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

app.post('/api/items/:id', async (req, res) => {
	try
	{
		let id = parseInt(req.params.id);
		console.log(id);
		let querySnapshot = await itemsRef.get();
		let removeArray = querySnapshot.docs.map(item => 
		{
      		return item.id;
    	})
    	console.log(removeArray);
    	var removeIndex = -1;
    	for (var i = 0; i < removeArray.length; i++)
    	{
    		if (id === parseInt(removeArray[i]))
    		{
    			removeIndex = i;
    		}
    	}
    	console.log(removeIndex);
		if (removeIndex === -1) 
		{
    		res.status(404).send("Sorry, that item doesn't exist, BUTTSNERD.");
    		return;
  		}
  		itemsRef.doc(removeArray[removeIndex].toString()).delete();
  		res.sendStatus(200);
	}
	catch
	{

	}
});

app.post('/api/items/edit/:id', async (req, res) =>
{
	try
	{
		console.log("woofer");
		let querySnapshot = await itemsRef.get();
		let id = parseInt(req.params.id);
		let removeArray = querySnapshot.docs.map(item => 
		{
      		return item.id;
    	})
    	console.log(removeArray);
    	var removeIndex = -1;
    	for (var i = 0; i < removeArray.length; i++)
    	{
    		if (id === parseInt(removeArray[i]))
    		{
    			removeIndex = i;
    		}
    	}
    	console.log(removeIndex);
		if (removeIndex === -1) 
		{
    		res.status(404).send("Sorry, that item doesn't exist, nerd.");
    		return;
  		}
  		console.log("Editing the item");
  		let path = await itemsRef.doc(removeArray[removeIndex].toString()).get();
  		console.log(path);
  		let item = {
  			id: id,
            title: req.body.title,
            description: req.body.description
        };
        console.log(item);
  		itemsRef.doc(removeArray[removeIndex].toString()).set(item)
  		res.sendStatus(200);
	}
	catch
	{

	}
})
exports.app = functions.https.onRequest(app);