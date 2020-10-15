//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const date=require(__dirname+"/date.js");



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  }
});

const Item=mongoose.model("Item",itemSchema);

const item1 = new Item({
  name:"Welcome to your todolist!"
});

const item2 = new Item({
  name:"Hit the + button to add new item."
});

const item3 = new Item({
  name:"<-- Hit this to delete an item."
});

const defaultItems=[item1,item2,item3];



app.get("/", function(req, res) {
  const day=date.getDate();

  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("items successfully saved in todolistDB");
        }
        res.redirect("/");
      });
    } else{
      res.render('list', {listTitle: day,newListItem:foundItems});
    }
  });
});


app.post("/",function(req,res){

const newItem=req.body.newItem;

  const item=new Item({
    name:newItem
  });
  item.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const delItem=req.body.checkbox;
  Item.deleteOne({_id:delItem},function(err){
    if(err){
      console.log(err);
    }else{
      console.log("deleted one item successfully");
    }
    res.redirect("/");
  });
});

app.get("/work",function(req,res){
  res.render("list",{listTitle:" Work List",newListItem:workItems});
});


app.listen(3000, function() {
  console.log("server started at port 3000");
});
