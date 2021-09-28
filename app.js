const express = require("express");
const date = require(__dirname + "/dateGen.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://admin-apurv:apayvkak123@cluster0.b5tmv.mongodb.net/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Hit + to add a new todo item."
});
const item2 = new Item({
  name: "<-- Hit this to delete a todo item."
});
var default_item = [item1, item2];
let currentDay = date.getDate();
app.get("/", (req, res) => {
  Item.find((err, item) => {
    if (err)
      console.log(err);
    else {
      if (item.length === 0) {
        Item.insertMany(default_item, (err) => {
          if (err)
            console.log(err);
          else
            console.log("Items added successfully!");
        });
        res.redirect("/");
      } else {
        res.render("lists", {
          listTitle: "Today",
          newItem: item
        });
      }
    }
  });
});
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});
const List = new mongoose.model("List", listSchema);
app.get("/:category", (req, res) => {
  const categoryname = _.capitalize(req.params.category);
  List.findOne({
    name: categoryname
  }, (err, foundList) => {
    if (!err) {
      if (foundList) {
        res.render("lists", {
          listTitle: categoryname,
          newItem: foundList.items
        });
      } else {
        const list = new List({
          name: categoryname,
          items: default_item
        });
        list.save();
        res.redirect("/" + categoryname);
      }
    }
  })

});
app.post("/", (req, res) => {
  const newItem = req.body
    .nextItem;
  const listTitle = _.capitalize(req.body.button);
  const nextItem = new Item({
    name: newItem
  });
  if (listTitle === "Today") {
    nextItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listTitle
    }, (err, foundList) => {
      foundList.items.push(nextItem);
      foundList.save();
    });
    res.redirect("/" + listTitle);
  }
});
app.post("/delete", (req, res) => {
  const itemId = req.body.checkbox;
  const listTitle = req.body.listTitle;
  if (listTitle === "Today") {
    Item.deleteOne({
      _id: itemId
    }, (err) => {
      if (err) console.log(err);
      else console.log("Item deleted successfully!");
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({
      name: listTitle
    }, {
      $pull: {
        items: {
          _id: itemId
        }
      }
    }, (err, foundList) => {
      if (!err)
        res.redirect("/" + listTitle);
    });
  }

})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log("Server is running successfully");
})