//添加路由
module.exports = function(app){
app.get('/index',function(req,res){
	res.type('text/html');
	res.send('<h2>你在首页里</h2>');
});

//路由中间件
app.get('/foo',
	function(req,res, next){
		//Math.random()是令系统随机选取大于等于 0.0 且小于 1.0 的伪随机 double 值
		if(Math.random() < 0.33) return next();
		res.send('red');
	},
	function(req,res, next){
		if(Math.random() < 0.5) return next();
		res.send('green');
	},
	function(req,res){
		res.send('blue');
	}
);

//测试session的路由转换
function authorize(req, res, next){
	if(req.session.isFirst) return next();
	res.render('home');
}
app.get('/secret', authorize, function(req,res){
	res.render('about');
}),
app.get('/sub-rosa', authorize, function(req,res){
	res.render('email');
});

app.get('/',function(req,res){
	res.cookie('name','小芳');
	res.cookie('about','关于我的事情好多',{signed:true, maxAge: 5000});
	res.render('home',{layout:null});
});
app.get('/jquery',function(req,res){
	res.render('jquerytest');
});
app.get('/about', function(req, res){ 
    res.render('about',{
    	pageTestScript:'/qa/tests-about.js'
    });
});
app.get('/tours/hood-river',function(req,res){
	res.render('tours/hood-river');
});
app.get('/tours/request-group-rate',function(req,res){
	res.render('tours/request-group-rate');
});
}