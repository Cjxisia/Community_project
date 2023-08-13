const db = require('../config/notice_board_db');
const controller = {};

controller.create_board = async (board) => {                //테이블 생성
  try {
    const result = await create_board_table(board);
    return result;
  } catch (error) {
    console.error(error);
    return -1;
  }
};

controller.show_board = async () => {                       //모든 테이블 조회
  try {
    const tables = await show_board_table();
    return tables;
  } catch (error) {
    console.error('테이블 목록 조회 오류:', error);
    throw error;
  }
};

controller.delete_board = async (board) => {                //테이블 삭제
  try {
      const result = await checkAndDeleteTable(board);
      return result;
  } catch (error) {
      console.error('테이블 제거 오류:', error);
      return -1;
  }
};

const create_board_table = (tableName) => {               //테이블 존재하는지 확인 및 생성
  return new Promise((resolve, reject) => {
    const checkQuery = `
      SELECT COUNT(*) AS tableCount
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = '${db.config.database}' AND TABLE_NAME = '${tableName}'
    `;
    const createQuery = `
      CREATE TABLE ${tableName} (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        user VARCHAR(255),
        title VARCHAR(255),
        main_text TEXT,
        image VARCHAR(255),
        date DATE,
        time TIME,
        community VARCHAR(255)
      )`;

    const checkExists = () => { 
      return new Promise((resolve, reject) => {
        db.query(checkQuery, (error, results) => {
          if (error) {
            reject(error);
          } else {
            const tableCount = results[0].tableCount;
            resolve(tableCount);
          }
        });
      });
    };

    checkExists()
      .then((tableCount) => {
        if (tableCount > 0) {
          resolve(0); // 테이블이 이미 존재하는 경우
        } else {
          db.query(createQuery, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(1); // 테이블 생성 성공
            }
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const show_board_table = () => {
  return new Promise((resolve, reject) => {
    const query = 'SHOW TABLES';

    db.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const tableNames = result.map(table => table[`Tables_in_${db.config.database}`]);
        resolve(tableNames);
      }
    });
  });
};

const checkAndDeleteTable = (board) => {                          //테이블이 존재하는지 확인 및 삭제
  return new Promise((resolve, reject) => {
      const query = `SHOW TABLES LIKE '${board}'`;
      db.query(query, (err, rows) => {
          if (err) {
              console.error('테이블 조회 오류:', err);
              reject(err);
              return;
          }

          if (rows.length === 0) {
              resolve(0); // 테이블이 존재하지 않을 경우 0 반환
          } else {
              const dropQuery = `DROP TABLE ${board}`;
              db.query(dropQuery, (dropErr) => {
                  if (dropErr) {
                      console.error('테이블 제거 오류:', dropErr);
                      reject(dropErr);
                  } else {
                      resolve(1); // 테이블 삭제 완료시 1 반환
                  }
              });
          }
      });
  });
};

module.exports = controller;
