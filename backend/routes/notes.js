const express = require('express')
const router = express.Router()


router.get('/',(req,res)=>{
    const obj = {
        name :"One two ka Four",
        number : 421
    }
    res.json(obj);
})


module.exports = router 