const express = require('express');
//明文改为秘文
const md5 =require('blueimp-md5');
const Users = require('../mode/users');
const router = new express.Router();

//解析请求体数据
router.use(express.urlencoded({extended: true}));

router.get('/',(req,res)=>{
    res.send('这是服务器返回的响应111');
})

//注册
router.post('/register', async (req, res) => {
    //获取用户提交请求参数信息
    const {username, password, type} = req.body;
    try {
        //去数据库查找当前用户是否存在
        const user = await Users.findOne({username});

        if (user) {
            //用户名被注册了
            res.json({
                code: 1,
                msg: '此用户已存在'
            })
        } else {
            //用户可以注册
            //保存在数据库中
            const user = await Users.create({username, password:md5(password), type});
            //返回成功的响应
            res.json({
                code: 0,
                data: {
                    username:user.username,
                    _id:user.id,
                    type:user.type
                }
            })
        }
    } catch (e) {
        res.json({
            code: 2,
            msg: '网络不稳定，请刷新试试~'
        })
    }
})
//登陆
router.post('/login', async (req, res) => {
    //获取用户提交请求参数信息
    const {username, password} = req.body;
    try {
        //去数据库查找当前用户是否存在
        const user = await Users.findOne({username,password:md5(password)});

        if (user) {
            //用户可登陆
            res.json({
                code: 0,
               data:{
                  _id:user.id,
                   type:user.type,
                   username:user.username
               }
            })
        } else {
            const user = await Users.create({username, password, type});
            //返回失败的响应
            //用户名或密码错误
            res.json({
                code: 1,
                msg:'用户名或密码错误'
            })
        }
    } catch (e) {
        res.json({
            code: 2,
            msg: '网络不稳定，请刷新试试~'
        })
    }
})

module.exports = router