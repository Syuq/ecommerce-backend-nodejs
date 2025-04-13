'use strict';

const mysql = require('mysql2/promise');

class DatabaseService {
  constructor() {
    this.pools = {};
  }

  createPool(alias, config) {
    if (this.pools[alias]) {
      throw new Error(`Pool with alias ${alias} already exists`);
    }
    this.pools[alias] = mysql.createPool(config);
  }

  getPool(alias) {
    if (!this.pools[alias]) {
      throw new Error(`Pool with alias ${alias} does not exist`);
    }
    return this.pools[alias];
  }
}

module.exports = new DatabaseService();
