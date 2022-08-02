const fs = require('fs');
const util = require('util');
const axios = require('axios');
const crypto = require('crypto');
const amqplib = require('amqplib');


const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class FeedbackService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  // eslint-disable-next-line class-methods-use-this
  async addEntry(name, title, message) {
    const q = 'feedback';
    const conn = await amqplib.connect('amqp://localhost');
    const ch = conn.createChannel();
    await ch.assertQueue(q);
    const qm = JSON.stringify({name, title, message });
    // eslint-disable-next-line no-return-await
    return await ch.sendToQueue(q, Buffer.from(qm, 'utf8'));
  }

  async getList() {
    const data = await this.getData();
    return data;
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data);
  }
}

module.exports = FeedbackService;
