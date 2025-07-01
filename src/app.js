const express = require("express");

const app = express();

app.use((req ,res) => {
    res.send("Hello Welcome")
})

app.listen(3000,() =>{
    console.log("Server is running in http://localhost:3000 ")
});