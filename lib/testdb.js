var User = require("./userdb.js");

/**
 * 插入
 */
function insert() {
    var user = new User({
        username : '小月',                 //用户账号
        userpwd: 'xiaoyue',                            //密码
        userage: 16,                                //年龄
        logindate : new Date()                      //最近登录时间
    });

    user.save(function (err, res) {

        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }

    });
}

//更新Model.update(conditions, update, [options], [callback])
//根据用户更改密码
function update(){
	var wherestr = {'username' : '逸刻'};
	var updatestr = {'userpwd' : 'hhhhhooo'};

	User.updateOne(wherestr,updatestr,function(err,res){
		if(err){
			console.log("Error:" + err);
		}else{
			console.log("Res:" + res);
		}
	})
}

//根据_id更新： Model.findByIdAndUpdate(id, [update], [options], [callback])
function findByIdAndUpdate(){
    var id = '5bc852dd89cdd953d0dc0938';
    var updatestr = {'username': '逸刻'};
    
    User.findByIdAndUpdate(id, updatestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
}

//删除 Model.remove(conditions, [callback])
//Model.findByIdAndRemove(id, [options], [callback])　　　　　　
//Model.deleteOne(conditions, [options], [callback])
function del(){
    var wherestr = {'username' : '小明'};
    //var id ={'_id':'5bc852dd89cdd953d0dc0938'};
    
    User.deleteOne(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
}

//条件查找: Model.find(conditions, [fields], [options], [callback])第2个参数可以设置要查询输出的字段,1或0
function getByConditions(){
    //var wherestr = {'username' : '小黄'};
    var age = {'userage':{$gte:12,$lte:14}};
    var out = {'username':1,'userage':1,'_id':0};
    
    User.find(age, out, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("条件查询结果：" + res);
        }
    });
}

//数量查询Model.count(conditions, [callback])res会输出数量，也可以传入条件做条件查询！
function getCountByConditions(){
    var wherestr = {};
    
    User.countDocuments(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
}

//根据_id查询Model.findById(id, [fields], [options], [callback])
function getById(){
    var id = '5bc94f12617b1e22ccd9d757';
    
    User.findById(id, function(err, res){
        if (err) {
            //此时res的值为“nudefined”
            console.log("id查询未找到" + err);
        }
        else {
           //此时err的值为“null”
            console.log("id查询结果" + res);
        }
    })
}

//分页查询
function getByPager(){
    
    var pageSize = 4;                   //一页多少条
    var currentPage = 1;                //当前第几页
    var sort = {'logindate':-1};        //排序（按登录时间倒序）
    var condition = {};                 //条件
    var skipnum = (currentPage - 1) * pageSize;   //跳过数
    
    User.find(condition).skip(skipnum).limit(pageSize).sort(sort).exec(function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
}


//getByPager();
getById();
//getCountByConditions();
//getByConditions();
//del();
//findByIdAndUpdate();
//insert();
//update();