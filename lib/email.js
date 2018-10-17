//封装email功能
var nodemailer = require('nodemailer');

module.exports = function(credentials){
	var transporter = nodemailer.createTransport({
		service: 'qq',
		auth: {
			user: credentials.qq.user,
			pass: credentials.qq.pass
		}
	});

	var from = '"逸刻"<1334785356@qq.com>';

	return {
		send: function(to,subj,body){
			var options = {
				from : from,
				to : to,
				subject : subj,
				//text : subj,
				html : body
			};
			transporter.sendMail(options,function(err,msg){
				if(err){
					console.log(err);
					res.render('send',{title: '发生错误'});
				}else{
					//console.log(msg);
					res.render('send',{title:'发送成功！'+msg.accepted})
				}
			});
		}
	}
}