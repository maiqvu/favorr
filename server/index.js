
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:nUU1mLYzQqEm8KPx@cluster0.0f8ww.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("favor").collection("users");
  // perform actions on the collection object
  var myobj = { username: "admin", password: "admin" };
  collection.insertOne(myobj, () => {
      if (err) throw err;
      console.log("1 document inserted");
  })
  client.close();
});
