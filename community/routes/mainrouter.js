const express = require('express');
const session = require('express-session');
const router = express.Router();
const bodyparser = require('body-parser');
const controller = require('../controllers/register_db');
const sub_controller = require('../controllers/controll_board');

router.use(bodyparser.urlencoded({ extended: false }));
router.use(express.static('public'));
router.use(session({
    secret: 'ijj2848',      //세션 암호화 키
    resave: false,          //세션 데이터가 변경되지 않아도 저장할지 여부
    saveUninitialized: true //초기화 되지 않은 세션을 저장할지 여부
}));

router.get('/main', async(req, res) => {     //메인화면
    try {
        const tableNames = await sub_controller.show_board();
        console.log(tableNames);
        res.render('main.ejs', { tableNames });
    } catch (error) {
        console.error('테이블 목록 조회 오류:', error);
        res.status(500).send('테이블 목록 조회에 실패했습니다.');
    }
})

router.get('/register_page', (req, res) => {    //회원가입 화면
    res.render('register.html')
})

router.post('/register', async (req, res) => {    //회원가입 처리
    const id = req.body.register_id;
    const password = req.body.register_password;

    console.log("register:", id, password);

    try {
        const result = await controller.register(id, password);
        if (result === 1) {
            res.send("<script>alert('회원가입 완료!'); window.location.href = '/main';</script>");
          } else if (result === 0) {
            res.send("<script>alert('아이디가 이미 존재합니다.'); window.location.href = '/register_page';</script>");
          } else {
            res.send("<script>alert('예상치 못한 오류입니다.'); window.location.href = '/register_page';</script>");
          }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

router.post('/login', async (req, res) => {
    const id = req.body.ID;
    const password = req.body.PASSWORD;
    const formid = req.body.formid;

    console.log("login:", id, password);
    console.log('formid:', formid);
    
    try{
        const result = await controller.login(id, password);
        const community = req.session.stext;
        if (result === 1) {
            req.session.userid = id;                            //id를 세션에 저장
            req.session.login = 1;                              //로그인 여부를 세션에 저장
            if(formid === 'form1'){
                res.redirect('/main/${id}');
            }else if(formid === 'form2'){
                res.redirect(`/community?community=${encodeURIComponent(community)}`);
            }
        }else if(result === 0 || 2){
            if(formid === 'form1'){
                res.send("<script>alert('아이디가 존재하지 않거나 비밀번호가 다릅니다.'); window.location.href = '/main';</script>");
            }else if (formid === 'form2') {
                const errorMessage = "아이디가 존재하지 않거나 비밀번호가 다릅니다.";
                res.send(`<script>alert("${errorMessage}"); window.location.href="/community?community=${encodeURIComponent(community)}";</script>`);
            }
        }else{
            if(formid === 'form1'){
                res.send("<script>alert('예상치 못한 오류입니다.'); window.location.href = '/main';</script>")
            }else if (formid === 'form2') {
                const errorMessage = "예상치 못한 오류입니다.";
                res.send(`<script>alert("${errorMessage}"); window.location.href="/community?community=${encodeURIComponent(community)}";</script>`);
            }
        }
    }catch(error){
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

router.get('/main/:id', async(req, res) => {
    const userid = req.session.userid;

    try {
        const tableNames = await sub_controller.show_board();
        console.log(tableNames);
        res.render('session_login.ejs', { tableNames, userid });
    } catch (error) {
        console.error('테이블 목록 조회 오류:', error);
        res.status(500).send('테이블 목록 조회에 실패했습니다.');
    }
})

router.get('/logout', (req, res) => {
    const formid = req.body.formid;

    req.session.destroy();
    res.redirect('/main');
})

module.exports = router;