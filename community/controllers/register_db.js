const db = require('../config/login_db');

const controller = {};

controller.register = async (id, password) => {
  try {
    const tableExists = await checkTableExists('user');       //테이블 존재 확인

    if (!tableExists) {             //테이블이 존재하지 않을 때 user라는 테이블을 새로 만들음
      await createTable('user');
    }

    const idExists = await checkIdExists('user', id);
    if (idExists) {                 //ID가 이미 존재할 때
      return 0;
    }

    await insertData('user', id, password);

    return 1;
  } catch (error) {                 //오류 발생시
    console.error(error);
    return -1;
  }
};

controller.login = async(id, password) => {
  try{
    const idExists = await checkIdExists('user', id);

    if (idExists) {
      const passwordMatch = await checkPasswordMatch('user', id, password);

      if (passwordMatch) {
        return 1; // ID와 PASSWORD가 일치하는 경우 1을 반환
      } else {
        return 0; // ID는 존재하지만 PASSWORD가 일치하지 않는 경우 0을 반환
      }
    } else {
      return 2; // ID가 존재하지 않는 경우 2을 반환
    }
  }catch(error){
    console.error(error);
    return -1;
  }
}

const checkTableExists = (tableName) => {         //테이블 존재 확인
  return new Promise((resolve, reject) => {
    const query = `SHOW TABLES LIKE '${tableName}'`;
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

const createTable = (tableName) => {            //테이블 생성
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE ${tableName} (id VARCHAR(255) PRIMARY KEY, password VARCHAR(255))`;
    db.query(query, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const checkIdExists = (tableName, id) => {            //ID여부 확인
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) AS count FROM ${tableName} WHERE id = ?`;
    db.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
};

const insertData = (tableName, id, password) => {           //ID및 PASSWORD를 테이블에 저장
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ${tableName} (id, password) VALUES (?, ?)`;
    db.query(query, [id, password], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const checkPasswordMatch = (tableName, id, password) => {     //Password 확인
  return new Promise((resolve, reject) => {
    const query = `SELECT password FROM ${tableName} WHERE id = ?`;
    db.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          const storedPassword = results[0].password;
          resolve(storedPassword === password);
        } else {
          resolve(false);
        }
      }
    });
  });
};


module.exports = controller;
