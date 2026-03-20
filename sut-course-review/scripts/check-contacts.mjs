import { MongoClient } from 'mongodb'

async function checkContacts() {
  const client = new MongoClient('mongodb://admin:Admin1234@ac-gonrtld-shard-00-00.tbu8xyk.mongodb.net:27017,ac-gonrtld-shard-00-01.tbu8xyk.mongodb.net:27017,ac-gonrtld-shard-00-02.tbu8xyk.mongodb.net:27017/sut-review-db?authSource=admin&tls=true')
  try {
    await client.connect()
    const db = client.db('sut-review-db')
    const contacts = await db.collection('contacts').find({}).toArray()
    console.log(`Found ${contacts.length} contacts:`)
    contacts.forEach(c => console.log(`- [${c.refId}] ${c.name}: ${c.subject}`))
  } finally {
    await client.close()
  }
}

checkContacts()
