const db = require('../config/notice_board_db');

const controller = {};

controller.insert = async (community, user, title, main_text, image, date, time) => {
  await insert_table(community, user, title, main_text, image, date, time);
};

controller.find_id = async (community) => {
  try {
    const queryResult = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${community}`, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });

    const ids = queryResult.map((row) => row.ID);
    return ids;
  } catch (error) {
    throw error;
  }
};


controller.find_user = async (community) => {
  try {
    const queryResult = await new Promise((resolve, reject) => {
      db.query(`SELECT user FROM ${community}`, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });

    const users = queryResult.map((row) => row.user);
    return users;
  } catch (error) {
    throw error;
  }
};

controller.find_title = async (community) => {
  try {
    const queryResult = await new Promise((resolve, reject) => {
      db.query(`SELECT title FROM ${community}`, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });

    const titles = queryResult.map((row) => row.title);
    return titles;
  } catch (error) {
    throw error;
  }
};

controller.find_date = async (community) => {
  try {
    const queryResult = await new Promise((resolve, reject) => {
      db.query(`SELECT date FROM ${community}`, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });

    const dates = queryResult.map((row) => row.date);
    return dates;
  } catch (error) {
    throw error;
  }
};

controller.find_time = async (community) => {
  try {
    const queryResult = await new Promise((resolve, reject) => {
      db.query(`SELECT time FROM ${community}`, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });

    const times = queryResult.map((row) => row.time);
    return times;
  } catch (error) {
    throw error;
  }
};

const insert_table = (tableName, user, title, main_text, image, date, time) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkTableQuery = `SHOW TABLES LIKE '${tableName}'`;
      const tableExist = await db.query(checkTableQuery);

      if (tableExist.length === 0) {
        return reject(new Error(`Table '${tableName}' does not exist`));
      } else {
        const insertQuery = `INSERT INTO ${tableName} (user, title, main_text, image, date, time, community) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [user, title, main_text, image, date, time, tableName];

        await db.query(insertQuery, values);
        console.log('게시글 생성 완료!');
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = controller;