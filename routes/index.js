var express = require('express');
var router = express.Router();
const userModel=require("./users")
const postModel=require("./posts");
const passport = require('passport');
const localStratergy=require("passport-local")
const upload=require("./multer")
passport.use(new localStratergy(userModel.authenticate()))
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/login",(req,res)=>{
  // console.log(req.flash("error"))
  res.render("login",{error:(req.flash("error"))})
})
router.get("/feed",isLoggedIn,async(req,res)=>{

  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  const posts=await postModel.find()
  .populate("user")

// console.log(posts+"this is posts")
  res.render("feed",{user,posts,nav:true})
})
router.post("/upload",isLoggedIn,upload.single('file'),async(req,res)=>{
  if(!req.file){
    return res.status(400).send('no files were uploaded')
  }
  const user=await userModel.findOne({username:req.session.passport.user})
  const postdata=await postModel.create({
    image:req.file.filename,
    text:req.body.filecaption,
    user:user._id
  })
 user.posts.push(postdata._id);
 await user.save();
  res.redirect("/profile")
})
router.get("/profile",isLoggedIn,async(req,res)=>{
let user=await userModel.findOne({
  username:req.session.passport.user
})
.populate("posts")


  res.render("profile",{user})
})

router.post("/register",function(req,res){
  const userdata=new userModel({
    username: req.body.username,
  
    email:req.body.email,
    fullname: req.body.fullname,
  })
  userModel.register(userdata,req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
  })
  router.post("/login",passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login",
    failureFlash:true
  }),function(req,res){

  })
  router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}


module.exports = router;


// router.get("/create",async function(req,res){
//   const data= await userModel.create({
//     username: "vishu",
//     password: "vish",
//     posts: [],
//     email:"vish@gmail.com",
//     fullname: "vishesh gaur",
//   })
//   res.send(data)
// })
// router.get("/createpost",async function(req,res){
//   const post= await postModel.create({
//     text: "hello post2",
//   user:'674ab94a2439445a9a3acf20'
  
//   })
//   let user=await userModel.findOne({_id:"674ab94a2439445a9a3acf20"})
//   user.posts.push(post._id)
//   await user.save()
//   res.send("done")
// })
// router.get("/all",async function(req,res){
//   const userdata=await userModel.findOne({_id:'674ab94a2439445a9a3acf20'}).populate('posts')
//   res.send(userdata)
// })