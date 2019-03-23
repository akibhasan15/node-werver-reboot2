const express=require('express');
const hbs=require('hbs')
var app=express();
const fs=require('fs');

const port = process.env.PORT || 3000;//run locally as well on heroku

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');
// app.get('/help1',(req,res)=>{
//     res.sendFile('public/help.html',{root:__dirname}); //send  html file
// });
app.use((req,res,next)=>{
 var now =new Date().toString();
 var log =`${now}:${req.method}, ${req.url}`;
 console.log(log);
 fs.appendFile('server.log',log +'\n',(err)=>{
     if(err){
         console.log('unable to append to server.log');
     }
 });
 next();
});
// app.use((req,res,next)=>{
//     res.render('maintenance.hbs')
    
// })
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('currentYear',()=>{
    return new Date().getFullYear()
});

app.get('/',(req,res)=>{
    // res.send('<h1>Hello express</h1>');
    res.render('home.hbs',{
        pageTitle:'home Page',
        welcomeMessage:'welcome to my website',
    })
});
app.get('/about',(req,res)=>{
    res.render('about.hbs',{
        pageTitle:'About Page',
    });
});
 app.get('/bad',(req,res)=>{
     res.send({
         errorMessage:'Unable to connect'   
     })
 })
app.listen(port,()=>{
    console.log(`server is up on port ${port}`)
});