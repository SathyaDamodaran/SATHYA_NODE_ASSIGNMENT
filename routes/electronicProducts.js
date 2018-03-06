const express = require('express');
const router = express.Router();

let fs = require('fs');
let readStream = fs.createReadStream("./db.json");

readStream.on("data", data => {
  Gadgets = JSON.parse(data);
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ Gadgets });
});

router.get('/addGadget', function (req, res, next) {
  res.json({ Gadgets });
});

router.post("/addGadget", function (req, res, next) {
  let prod = req.body;
  let id = Gadgets.device.length;
  prod.id = ++id;
  Gadgets.device.push(prod);
  let writeStream = fs.createWriteStream("./db.json");
  writeStream.write(JSON.stringify(Gadgets), err => {
    if (err) throw err;
    else {
      let successmessage = "Successfully Added the new Product";
      res.status(200).json({ successmessage });
    }
  });
});

router.get("/editGadget/:id", function (req, res, next) {
  let id = req.params.id;
  let updateIndex = Gadgets.device.findIndex(data => data.id == id);
  if (updateIndex != -1) {
    res.json({ deviceDetails: Gadgets.device[updateIndex] });
  }
  else {
    let errMsg = "Invalid Id";
    res.json({ errMsg });
  }
})

router.post("/editGadget/:id", function (req, res, next) {
  let prod = req.body;
  let id = req.params.id;
  let updateIndex = Gadgets.device.findIndex(data => data.id == id);
  prod.id = id;
  Gadgets.device[updateIndex] = prod;
  let writeStream = fs.createWriteStream("./db.json");
  writeStream.write(JSON.stringify(Gadgets), err => {
    if (err) throw err;
    else {
      let editmsg = "Product is edited successfully";
      res.json({ editmsg });
    }
  });
});

router.get("/deleteGadget/:id", function (req, res) {
  let id = req.params.id;
  let deleteIndex = Gadgets.device.findIndex(data => data.id == id);
  if (deleteIndex != -1) {
    Gadgets.device.splice(deleteIndex, 1);
    let writeStream = fs.createWriteStream("./db.json");
    writeStream.write(JSON.stringify(Gadgets), err => {
      if (err) throw err;
      else {
        let deletemsg = "Successfully deleted device" + " " + id;
        res.json({ deletemsg });
      }
    });
  }
  else {
    let errMsg = "Invalid Gadget Index";
    res.json({ errMsg });
  }
});

router.post("/getGadget", function (req, res, next) {
  if (req.body.id) {
    let getId = Gadgets.device.findIndex(data => data.id == req.body.id);
    res.json({ deviceDetails: Gadgets.device[getId] });
  } 
  else if (req.body.productName) {
    let getName = Gadgets.device.filter(
      data => data.productName == req.body.productName
    );
    res.json({ deviceDetails: getName });
  }
  else{
    let errMsg = "Please enter valid Gadget id or name";
    res.json({errMsg});
  }
});

router.get("/viewCategory", function (req, res) {
  let categoryArray = [];
  let categoryArray1 = [];
  for (i = 0; i < Gadgets.device.length; i++) {
    categoryArray.push(Gadgets.device[i].category);
  }
  for (i = 0; i < categoryArray.length - 1; i++) {
    for (j = 1; j < categoryArray.length; j++) {
      if (categoryArray[i] == categoryArray[j]) {
        categoryArray.splice(j, 1);
      }
    }
  }
  for (i = 0; i < categoryArray.length; i++) {
    let CatObjvalue = [];
    let count = 0;
    for (j = 0; j < Gadgets.device.length; j++) {
      if (categoryArray[i] == Gadgets.device[j].category) {
        CatObjvalue[count] = Gadgets.device[j];
        count++;
      }
    }

    mainCategory[categoryArray[i]] = CatObjvalue;
  }
  res.json({ Category: mainCategory });
});

router.get("/searchGadget/:val", function (req, res, next) {
  let val = req.params.val.toLowerCase();
  let searchresult = [];
  let arr = Gadgets.device;
  searchresult = arr.filter(function (obj) {
    return obj.productName
      .toString()
      .toLowerCase()
      .includes(val);
  });
  res.json({ searchresult: searchresult });
});

router.get("/globalSearch/:val", (req, res, next) => {
  let globalSearchResult = [];
  let val = req.params.val.toLowerCase();
  let arr = Gadgets.device;

  globalSearchResult = arr.filter(function (obj) {
    return Object.keys(obj).some(function (key) {
      return obj[key]
        .toString()
        .toLowerCase()
        .includes(val);
    });
  });
  res.json({ globalSearchResult: globalSearchResult });
});

module.exports = router;
