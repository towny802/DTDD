import { TypeSpace } from './Models/W2TaxReturn';
import { DomainType } from './DomainType'
import { TypeManifest } from './TypeManifest'
import { MongoClient, Db } from 'mongodb';

const bodyParser = require('body-parser');

//var Repository: DomainType[] = new Array<DomainType>()
const url: string = 'mongodb://localhost:27017';
const dbName: string = 'db';
const client: MongoClient = new MongoClient(url);
client.connect().then();
const db: Db = client.db(dbName);


const folderPath = './Models'; 
const classes = TypeManifest.getClassesInFolder(folderPath);
const Types = TypeManifest.createInstances(classes);



import express, { Request, Response } from 'express';
import { W2Statement } from './W2Statement';
import { Context } from './Context';
const app: express.Application = express();
app.use(bodyParser.json())
Context.context.UserAccessLevel = "Admin"

var collection = db.collection('W2Statement')
var testReturn = new TypeSpace.W2TaxReturn()
var testIncome = new W2Statement()
testIncome.W2Income = 30000
testIncome.WithheldIncomeTax = 3000
testReturn.W2Statements.push(testIncome)
collection.insertOne(testReturn)
var testReturn2 = new TypeSpace.W2TaxReturn
var testIncome2 = new W2Statement
testIncome2.W2Income = 30000
testIncome2.WithheldIncomeTax = 3000
testReturn.W2Statements.push(testIncome2)
collection.insertOne(testReturn2)

Context.context.UserAccessLevel = "User"


app.get('/:type', async (req: Request<{ type: string }>, res: Response) => {
  const type = req.params.type;
  const collection = db.collection(type)
  let itemsOfType = await collection.find().toArray()//Repository.filter(instance => Reflect.getPrototypeOf(instance)?.constructor.name == req.params.type)

  let structuredItems = itemsOfType.map((domainType, index, array) => {
    let structuredItem: any = {};
    const typeKeys = Object.keys(domainType);

    typeKeys.forEach(key => {
        structuredItem[key] = domainType[key as keyof typeof domainType];
    });

    return structuredItem;
  });

  res.send(structuredItems)
});

app.post('/:type', async (req: express.Request<{ type: string }>, res: express.Response) => {
  try {
    const type = req.params.type;
    const body = req.body;

    if (Types[type] !== undefined) {

      var typeInstance: any = {}
      Object.assign(typeInstance, Types[type])

      for (const key in body) {
        if (Object.prototype.hasOwnProperty.call(body, key) && Object.prototype.hasOwnProperty.call(typeInstance, key)) {
          typeInstance[key] = body[key];
        }
      }

      const collection = db.collection(type)
      collection.insertOne(typeInstance).then();
      //Repository.push(typeInstance);
      

      res.status(200).json({ message: "Object added successfully", data: typeInstance });
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error});
  }
});


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
