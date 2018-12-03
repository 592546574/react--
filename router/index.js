const express = require('express');
const router = new express.Router();
router.get('/',(req,res)=>{
    res.send('这是服务器返回的响应111');
})
module.exports = router