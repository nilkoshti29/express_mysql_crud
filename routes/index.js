var express = require('express');
var router = express.Router();

var mysql = require('mysql');

// DB connection start
var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : '',
  database  : 'db_myuser'

});

connection.connect(function(err){
  if(!err){
    console.log(" Database is connected ");
  }else{
    console.log(" Error connecting database ");
  }
});

//Db connection end

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/form', function(req, res, next) {
  res.render('add-form.ejs');
});


router.post('/form',function(req,res,next) {
    console.log(req.body);
 
    const mybodydata = {

      std_name : req.body.std_name,
      std_phone_no : req.body.std_phone_no,
      std_email : req.body.std_email
    }
    connection.query("insert into student set ? ",mybodydata,function(err,result){

    
      if(err) throw err; 
      
        res.redirect('/form');
                 
    });
  
});

//fetch Record data

router.get('/display',function(req,res,next){
    connection.query("select * from student ", function(err,db_rows){
      if(err) throw err;

      console.log(db_rows);
      res.render('display-table',{db_rows_array:db_rows});
    });
});

// Delete student By id

router.get('/delete/:std_id',function(req,res,next){

  var deletestu_id = req.params.std_id;
  console.log("Delete id is " + deletestu_id);

  connection.query("delete from student where std_id = ? ", [deletestu_id],function(err,db_rows){
    if(err) throw err;

    console.log(db_rows);
    console.log("Record Deleted ");
    res.redirect('/display');
    });
});


//get single student by id

router.get('/show/:std_id',function(req,res){

  var showstd_id = req.params.std_id;
  console.log("show id is" + showstd_id);

  connection.query("select * from student where std_id = ? ", [showstd_id],function(err,db_rows){

    console.log(db_rows);
    if(err) throw err;

    res.render("show", {db_rows_array: db_rows});

  });


});


// Get Single student for Edit Record

router.get('/edit/:std_id', function(req,res){

  var edit_std_id = req.params.std_id;
  console.log("Edit is id " + edit_std_id);

  connection.query("select * from student where std_id = ? ", [edit_std_id],function(err,db_rows){

    console.log(db_rows);

    if(err) throw err;

    res.render("edit-form", {db_rows_array: db_rows});
  });
});

//update Record using Post Method

router.post('/edit/:std_id',function(req,res){

  console.log("Edit id is " + req.params.std_id);

  var studentid = req.params.std_id;

  var studentname  = req.body.std_name;
  var studentphone = req.body.std_phone_no;
  var studentemail = req.body.std_email;


  connection.query("Update student set std_name = ? , std_phone_no = ? , std_email = ? where std_id = ?  ", 
  [studentname,studentphone,studentemail,studentid],function(err,respond){
    if(err) throw err;
      res.redirect('/display');

  });
});
module.exports = router;

