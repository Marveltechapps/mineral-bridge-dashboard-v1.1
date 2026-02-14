/**
 * MongoDB connection helper for Node.js backend.
 * Use when you add Express/MongoDB server (e.g. in /backend).
 *
 * const { MongoClient } = require('mongodb');
 * const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mineral-bridge';
 * let client, db;
 *
 * async function connect() {
 *   client = new MongoClient(uri);
 *   await client.connect();
 *   db = client.db();
 *   return db;
 * }
 *
 * function getDb() { return db; }
 *
 * module.exports = { connect, getDb };
 */
