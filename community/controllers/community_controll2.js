const db = require('../config/notice_board_db');

const controller = {};

controller.find_user = async (community, t_id) => {
    try {
      const queryResult = await new Promise((resolve, reject) => {
        db.query(`SELECT user FROM ${community} WHERE ID = ?`, [t_id], (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        });
      });
  
      if (queryResult.length > 0) {
        return queryResult[0].user;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
};

controller.find_title = async (community, t_id) => {
    try {
      const queryResult = await new Promise((resolve, reject) => {
        db.query(`SELECT title FROM ${community} WHERE ID = ?`, [t_id], (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        });
      });
  
      if (queryResult.length > 0) {
        return queryResult[0].title;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
};

controller.find_main_text = async (community, t_id) => {
    try {
      const queryResult = await new Promise((resolve, reject) => {
        db.query(`SELECT main_text FROM ${community} WHERE ID = ?`, [t_id], (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        });
      });
  
      if (queryResult.length > 0) {
        return queryResult[0].main_text;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
};

controller.find_date = async (community, t_id) => {
    try {
      const queryResult = await new Promise((resolve, reject) => {
        db.query(`SELECT date FROM ${community} WHERE ID = ?`, [t_id], (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        });
      });
  
      if (queryResult.length > 0) {
        return queryResult[0].date;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
};

controller.find_time = async (community, t_id) => {
    try {
      const queryResult = await new Promise((resolve, reject) => {
        db.query(`SELECT time FROM ${community} WHERE ID = ?`, [t_id], (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        });
      });
  
      if (queryResult.length > 0) {
        return queryResult[0].time;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
}

controller.find_image = async (community, t_id) => {
    try {
      const queryResult = await new Promise((resolve, reject) => {
        db.query(`SELECT image FROM ${community} WHERE ID = ?`, [t_id], (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        });
      });
  
      if (queryResult.length > 0) {
        return queryResult[0].image;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
};

controller.delete_community = async (community, ID) => {
  try {
      const deleteCommentQuery = `DELETE FROM comment WHERE ID = ?`;
      
      const commentQueryResult = await new Promise((resolve, reject) => {
          db.query(`SELECT * FROM comment WHERE ID = ?`, [ID], (error, rows) => {
              if (error) reject(error);
              resolve(rows);
          });
      });

      if (commentQueryResult.length > 0) {
          await new Promise((resolve, reject) => {
              db.query(deleteCommentQuery, [ID], (error) => {
                  if (error) reject(error);
                  resolve();
              });
          });

          console.log(`Deleted from comment table.`);
      }

      const deleteQuery = `DELETE FROM ${community} WHERE ID = ?`;
      await new Promise((resolve, reject) => {
          db.query(deleteQuery, [ID], (error) => {
              if (error) reject(error);
              resolve();
          });
      });

      console.log(`Deleted from ${community} table.`);
  } catch (error) {
      throw error;
  }
};



controller.find_comment_user = async (community, t_id) => {
  try {
      const queryResult = await new Promise((resolve, reject) => {
          db.query(`SELECT comment_user FROM comment WHERE ID = ? AND community = ?`, [t_id, community], (error, rows) => {
              if (error) reject(error);
              resolve(rows);
          });
      });

      if (queryResult.length > 0) {
          const commentUsers = queryResult.map(row => row.comment_user);
          return commentUsers;
      } else {
          return [];
      }
  } catch (error) {
      throw error;
  }
};

controller.find_comment = async (community, t_id) => {
  try {
      const queryResult = await new Promise((resolve, reject) => {
          db.query(`SELECT comment FROM comment WHERE ID = ? AND community = ?`, [t_id, community], (error, rows) => {
              if (error) reject(error);
              resolve(rows);
          });
      });

      if (queryResult.length > 0) {
          const comments = queryResult.map(row => row.comment);
          return comments;
      } else {
          return [];
      }
  } catch (error) {
      throw error;
  }
};

controller.find_comment_date = async (community, t_id) => {
  try {
      const queryResult = await new Promise((resolve, reject) => {
          db.query(`SELECT DATE FROM comment WHERE ID = ? AND community = ?`, [t_id, community], (error, rows) => {
              if (error) reject(error);
              resolve(rows);
          });
      });

      if (queryResult.length > 0) {
          const dates = queryResult.map(row => row.DATE);
          return dates;
      } else {
          return [];
      }
  } catch (error) {
      throw error;
  }
};

controller.find_comment_time = async (community, t_id) => {
  try {
      const queryResult = await new Promise((resolve, reject) => {
          db.query(`SELECT TIME FROM comment WHERE ID = ? AND community = ?`, [t_id, community], (error, rows) => {
              if (error) reject(error);
              resolve(rows);
          });
      });

      if (queryResult.length > 0) {
          const times = queryResult.map(row => row.TIME);
          return times;
      } else {
          return [];
      }
  } catch (error) {
      throw error;
  }
};

controller.find_c_id = async (community, t_id) => {
  try {
      const queryResult = await new Promise((resolve, reject) => {
          db.query(`SELECT C_ID FROM comment WHERE ID = ? AND community = ?`, [t_id, community], (error, rows) => {
              if (error) reject(error);
              resolve(rows);
          });
      });

      if (queryResult.length > 0) {
          const c_id = queryResult.map(row => row.C_ID);
          return c_id;
      } else {
          return [];
      }
  } catch (error) {
      throw error;
  }
};

controller.create_comment_table = async () => {
  try {
      const checkTableQuery = `SHOW TABLES LIKE 'comment'`;
      const tableCheckResult = await new Promise((resolve, reject) => {
          db.query(checkTableQuery, (error, rows) => {
              if (error) reject(error);
              resolve(rows);
          });
      });

      if (tableCheckResult.length === 0) {
          const createTableQuery = `
              CREATE TABLE comment (
                  C_ID INT AUTO_INCREMENT PRIMARY KEY,
                  ID VARCHAR(255),
                  community VARCHAR(255),
                  comment VARCHAR(255),
                  comment_user VARCHAR(255),
                  date DATE,
                  time TIME
              )
          `;
          await new Promise((resolve, reject) => {
              db.query(createTableQuery, (error) => {
                  if (error) reject(error);
                  resolve();
              });
          });
      }
  } catch (error) {
      throw error;
  }
};

controller.insert_comment = async (t_id, community, comment, comment_user, date, time) => {
  try {
      await controller.create_comment_table();

      const insertCommentQuery = `
          INSERT INTO comment (ID, community, comment, comment_user, date, time)
          VALUES (?, ?, ?, ?, ?, ?)
      `;
      await new Promise((resolve, reject) => {
          db.query(insertCommentQuery, [t_id, community, comment, comment_user, date, time], (error) => {
              if (error) reject(error);
              resolve();
          });
      });
  } catch (error) {
      throw error;
  }
};

controller.delete_comment = async (c_id) => {
  try {
    const deleteQuery = `DELETE FROM comment WHERE c_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(deleteQuery, [c_id], (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = controller;