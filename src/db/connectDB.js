const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>console.log("DB connect")).catch(err=>console.log("DB cant connect " + err))