const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const fs= require('fs');
const controller = require('../controllers/community_controll');
const subcontroller = require('../controllers/community_controll2');

router.use(bodyparser.urlencoded({ extended: false }));
router.use(express.static('public'));
router.use(session({
    secret: 'ijj2848',      //세션 암호화 키
    resave: false,          //세션 데이터가 변경되지 않아도 저장할지 여부
    saveUninitialized: true //초기화 되지 않은 세션을 저장할지 여부
}));

router.get('/community', async(req, res) => {
    const subjectText = req.query.community;
    req.session.stext = subjectText;
    
    const userid = req.session.userid;
    const login = req.session.login
    console.log("로그인코드:", login);

    try{
        const table_id = await controller.find_id(subjectText);
        const table_user = await controller.find_user(subjectText);
        const table_title = await controller.find_title(subjectText);
        const table_date = await controller.find_date(subjectText);
        const table_time = await controller.find_time(subjectText);

        console.log(table_id, table_user, table_title, table_date, table_time);
        res.render('community.ejs', { subjectText, login, userid, table_id, table_user, table_title, table_date, table_time });
    }catch(error){
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

router.get('/com_write_page', (req, res) => {
    res.render("community_write.ejs");
})

router.post('/com_write', upload.single('photo'), async(req, res) => {
    let user;
    let image;   
    if(req.session.userid !== undefined){
        user = req.session.userid;
    }else{
        user = "guest";
        req.session.userid = "guest";
    }
    if(req.file !== undefined){
        const relativeImagePath = path.relative(__dirname, req.file.path);
        image = relativeImagePath.replace(/\\/g, '/');
    }else{
        image = "0";
    }
    const currentDate = new Date();
    const community = req.session.stext;
    const title = req.body.title;
    const main_text = req.body.main_text;
    const date = currentDate.toISOString().slice(0, 10);
    const time = currentDate.toTimeString().slice(0, 8);

    try{
        await controller.insert(community, user, title, main_text, image, date, time);
        res.redirect(`/community?community=${encodeURIComponent(community)}`);
    }catch(error){
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

router.get('/show_image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '..', 'uploads', filename);
    res.sendFile(imagePath);
});

router.get('/com_read', async(req, res) => {
    const t_id = req.query.table_id
    const community = req.query.com_title
    try {
        if(req.session.userid === undefined){
            req.session.userid = "guest";
        }
        req.session.t_id = t_id;
        req.session.stext = community;

        subcontroller.create_comment_table();

        const t_user = await subcontroller.find_user(community, t_id);
        const t_title = await subcontroller.find_title(community, t_id);
        const t_main_text = await subcontroller.find_main_text(community, t_id);
        const t_date = await subcontroller.find_date(community, t_id);
        const t_time = await subcontroller.find_time(community, t_id);
        let t_image = await subcontroller.find_image(community, t_id);
        const comment_user = await subcontroller.find_comment_user(community, t_id);
        const comment = await subcontroller.find_comment(community, t_id);
        const comment_time = await subcontroller.find_comment_time(community, t_id);
        const comment_date = await subcontroller.find_comment_date(community, t_id);

        const formattedDate = t_date.toISOString().slice(0, 10).split('-').map(str => parseInt(str, 10)).join('. ');

        if (t_image === '0') {
            t_image = null;
        }
        
        res.render('community_read.ejs', { t_image, t_user, t_title, t_main_text, formattedDate, t_time, t_id, comment_user, comment, comment_time, comment_date });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

router.post('/com_delete', async(req, res) => {
    const community = req.session.stext;
    const t_id = req.session.t_id;
    
    try{
        subcontroller.delete_community(community, t_id)
        res.redirect(`/community?community=${encodeURIComponent(community)}`);
    }catch(error){
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

router.post('/comment_write', async(req, res) => {
    const currentDate = new Date();
    const community = req.session.stext;
    const t_id = req.session.t_id;
    const comment = req.body.comment;
    const userid = req.session.userid;
    const date = currentDate.toISOString().slice(0, 10);
    const time = currentDate.toTimeString().slice(0, 8);
    
    try{
        subcontroller.insert_comment(t_id, community, comment, userid, date, time);
        res.redirect(`/com_read?table_id=${encodeURIComponent(t_id)}&com_title=${encodeURIComponent(community)}`);
    }catch(error){
        console.error(error);
        res.status(500).send('An error occurred');
    }
})

module.exports = router;