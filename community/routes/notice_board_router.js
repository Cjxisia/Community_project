const express = require('express');
const session = require('express-session');
const router = express.Router();
const controller = require('../controllers/controll_board');

router.use(session({
    secret: 'password',      //세션 암호화 키
    resave: false,          //세션 데이터가 변경되지 않아도 저장할지 여부
    saveUninitialized: true //초기화 되지 않은 세션을 저장할지 여부
}));

router.get('/create_board', async(req, res) => {
    const boardTitle = req.query.board_title;
    const type = req.query.type;
    const userid = req.session.userid;                          //세션에 저장된 id

    if (type === '생성') {                                      //게시판 생성
      console.log('게시판 생성 요청:', boardTitle);
      try{
        const result = await controller.create_board(boardTitle);
        if(result === 1){
            res.redirect('/main/${userid}');
        }else if(result === 0){
            res.send("<script>alert('이미 존재하는 커뮤니티입니다.'); window.location.href = '/main/${userid}';</script>");
        }else{
            res.send("<script>alert('예상치 못한 오류입니다.'); window.location.href = '/main/${userid}';</script>");
        }
      }catch(error){
        console.error(error);
        res.status(500).send('An error occurred');
      }
    } else if (type === '삭제') {                           //게시판 삭제
      console.log('게시판 삭제 요청:', boardTitle);
      try{
        const result = await controller.delete_board(boardTitle);

        if(result === 1){
            res.redirect('/main/${userid}');
        }else if(result === 0){
            res.send("<script>alert('존재하지 않는 커뮤니티 입니다.'); window.location.href = '/main/${userid}';</script>");
        }else{
            res.send("<script>alert('예상치 못한 오류입니다.'); window.location.href = '/main/${userid}'';</script>");
        }
      }catch(error){
        console.error(error);
        res.status(500).send('An error occurred');
      }
    } else {
      res.status(400).send('잘못된 요청입니다.');
    }
});

module.exports = router;
