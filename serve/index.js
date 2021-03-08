const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server,{
	cors: {
    origin: "http://120.25.215.239/shopping",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
		preflightContinue: false,
		allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});
server.listen(7001);
const mongodb = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const url = 'mongodb://120.25.215.239:27017';
const bodyParser = require('body-parser')
const nodemail = require('./nodemailer.js')
const Imgip = 'http://120.25.215.239:7000/uploads/'
app.use(bodyParser.json())
app.use('/uploads',express.static(__dirname + '/uploads'))
const multer = require('multer')
var upload = multer({dest:__dirname + '/uploads'})
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});
// 随机生成验证码
 function createSixNum(){
        var Num="";
        for(var i=0;i<6;i++)
        {
            Num+=Math.floor(Math.random()*10);
        }
        return Num;
   }
	function getTime () {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		function pre (num) {
			if(num.toString().length === 1) {
				return '0' + num
			} else {
				return num
			}
		}
		month = pre(month)
		day = pre(day)
		hour = pre(hour)
		minute = pre(minute)
		second = pre(second)
		var time  = `${year}/${month}/${day} ${hour}:${minute}:${second}`
		return time;
	}

mongodb.connect(url,(err,client)=>{
	if(err) throw err;
	// 数据库连接成功!
	// 获取数据库
	const db = client.db('shopping');
	// 用户表
	const user = db.collection('user');
	// 商品表
	const commodity = db.collection('commodity');
	// 订单表
	const order = db.collection('order');
	// 临时验证码表
	const yzm = db.collection('yzm');
	// 店铺表
	const dp = db.collection('dp');
	// 购物车
	const gwc = db.collection('gwc');
	// 我的收获地址
	const address = db.collection('address');
	// 审核通知(店铺审核和商品审核)
	const examine = db.collection('examine');
	// 聊天记录
	const chat = db.collection('chat');
	// 注册用户
	app.post('/addUser',upload.single('file'),(req,res)=>{
		// 姓名、账号、密码、类型（默认消费者，可申请为商家）
		var msg = JSON.parse(req.body.user)
		if (msg.user === 'root') {
			res.send('存在')
			return false
		}
		user.findOne({'user': msg.user},(err,i)=>{
			if(i){
		// 账号已经存在
		res.send('存在')
	}else{
	user.findOne({'mail':msg.mail},(err,i)=>{
	if(i){
		// 邮箱被绑定了
		res.send('绑定')
		}else{
		yzm.findOne({'user':msg.user},(err,i)=>{
			if(i){
				//验证码一样
				if(i.code == msg.mailYzm){
					var url  = null
					if(req.file){
						url = `${Imgip}${req.file.filename}`
					}
					delete msg.mailYzm
					var date = getTime()
					user.insert(Object.assign(msg, {
						url: url,
						date: date
					}),(err)=>{
						res.send('成功')
					});
				}else{
					// 验证码错误
					res.send('错误')
				}
			}else{
				res.send('未收到')
			}
		})
			}
		})
			}
		})
	})
	// 换头像
	app.post('/htx', upload.single('file'),(req,res)=>{
		user.update(JSON.parse(req.body.user),{$set:{url: `${Imgip}${req.file.filename}`}})
		res.send(true)
	})
	// 登录用户
	app.post('/isUser',(req,res)=>{
		user.findOne({'user':req.body.user},(err,i)=>{
			if(i){
				if(i.password == req.body.password){
					res.send(true)
				}else{
					res.send(false)
				}
			}else{
				res.send(false)
			}
		})
	})
	// 修改密码
	app.post('/updatePass',(req,res)=>{
		if(req.body.mailYzm){
			// 邮箱方式修改
			yzm.findOne({user: req.body.user},(err,i)=>{
			  if(i){
				if(i.code == req.body.mailYzm){
					user.update({user:req.body.user},{$set:{password:req.body.newPassword}})
					res.send('成功')
				}else{
					res.send('错误')
				}
			  }else{
				res.send('未收到')
			  }
			})
		}else{
			user.findOne({user:req.body.user,password:req.body.oldPassword},(err,i)=>{
				if(i){
					user.update({user:req.body.user,password:req.body.oldPassword},{$set:{password:req.body.newPassword}})
					res.send(true)
				}else{
					res.send(false)
				}
			})
		}
	})
	// 邮箱验证码
	app.post('/email',async (req,res)=>{
		var eMail = req.body.email
		if(!eMail){
			user.findOne({'user':req.body.user},(err,i)=>{
				if (i) {
					eMail = i.mail
				} else {
					res.send(false)
					return ''
				}
			})
		}
		var code = createSixNum();
		var mail = {
			from: '1633911462@qq.com',
			subject: code,
			to: eMail,
			text: '您的验证码是：' + code + '。五分钟内有效'
		};
		await yzm.deleteOne({user: req.body.user})
		if (!mail.to) {
			mail.to = eMail
		}
		await nodemail(mail)
		await yzm.insert({
			user: req.body.user,
			email: req.body.email,
			code: code,
			date: new Date()
		})
		yzm.createIndex({"date": 1},{expireAfterSeconds: 300})
	})
	// 获取当前用户信息
	app.post('/user',(req,res)=>{
		user.findOne({user:req.body.user},(err,i)=>{
			if(i){
				// 获取成功
				if (req.body.user === 'admin') {
					i.gly = Imgip + '1.jpg'
				}
				res.send(i)
			}else{
				res.send(false)
			}
		})
	})
	// 获取用户列表
	app.get('/userList',(req,res)=>{
		let body = [];
		user.find().forEach(async i=>{
			body.push(i)
		},async err=>{
			for(let i = 0; i < body.length; i++){
				await new Promise((resolve,reject)=>{
					dp.findOne({user:body[i].user},(err,j)=>{
						if(j){
							body[i].dpName = j.dpName
						}else{
							body[i].dpName = null
						}
						resolve(1)
					})
				})
		}
			res.send(body)
		})
	})
	// 开通店铺
	app.post('/addDp',async (req,res)=>{
		// 当前用户是否有开通过店铺
		await new Promise((resolve,reject)=>{
			user.findOne({user: req.body.user},(err,i)=>{
				if(i.type == 'xf'){
					resolve('未开通')
				}else{
					res.send('已开通')
					reject('已开通')
				}
			})
		})
		// 店铺名称是否存在
		await new Promise((resolve,reject)=>{
			dp.findOne({dpName:req.body.dpName},(err,i)=>{
				if(i){
					res.send('已存在')
					reject('已存在')
				}else{
					resolve('不存在')
				}
			})
		})
		// 重复审核
		await new Promise((resolve,reject)=>{
			examine.findOne({dpName: req.body.dpName},(err,i)=>{
			if(i){
				if(i.result && i.result == '已拒绝'){
					examine.deleteOne({dpName: req.body.dpName})
					res.send('已拒绝')
					reject('已拒绝')
				}else{
					res.send('重复审核')
					reject('重复审核')
				}
			}else{
				resolve('开始审核')
			}
			})
		})
		// 开通店铺需要审核
		let body = req.body;
		body.isDp = true;
		examine.insert(body)
		res.send('审核中')
	})
	// 审核（商品和店铺)
	app.get('/examine',async (req,res)=>{
		//获取店铺审核状态
		if(req.query.type == 'dp'){
			var list = [];
			await new Promise((resolve,reject)=>{
				examine.find({isDp:true}).forEach(i=>{
					list.push(i)
				},(err)=>{
					res.send(list)
				})
			})
		}
	})
	// 审核结果
	app.post('/result',(req,res)=>{
		var _user = req.body.user;
		// 不能重复审核
		examine.findOne({user:_user},(err,i)=>{
			if(i.result){
				res.send('重复审核')
			}else{
				//店铺审核成功
				if(req.query.dp == 'yes'){
					dp.insert({dpName:req.body.dpName,user:_user,type:req.body.type})
					examine.updateOne({user:_user},{$set:{result:'已同意'}})
					user.updateOne({user:_user},{$set:{type: 'sj'}})
					res.send('ok')
				}
				//店铺审核失败
				else if(req.query.dp == 'no'){
					examine.updateOne({user:_user},{$set:{result:'已拒绝'}})
					res.send('ok')
				}
			}
		})
	})
	app.get('/clear',(req,res)=>{
		// 店铺审核
		if(req.query.type == 'dp'){
			examine.deleteMany({result:'已同意'})
			examine.deleteMany({result:'已拒绝'})
			res.send('ok')
		}
	})
	// 获取店铺信息
	app.post('/myDp',(req,res)=>{
		if (req.body.user) {
			dp.findOne({user:req.body.user},(err,i)=>{
				res.send(i)
			})
		} else {
			dp.findOne({dpName:req.body.dpName},(err,i)=>{
				res.send(i)
			})
		}
	})
	// 粉丝增减
	app.post('/fs',async (req,res)=>{
		// 店铺粉丝改变
		await new Promise((resolve,reject)=>{
			dp.findOne({dpName: req.body.dpName},(err, i)=>{
				if(err) throw err;
				if (req.body.num === -1) {
					// 取消关注
					dp.updateOne({dpName: req.body.dpName},{$pull:{
								fans: req.body.user
					}}, err => {
						resolve()
					})
				} else {
					// 关注
					dp.updateOne({dpName: req.body.dpName},{$addToSet:{
								fans: req.body.user
					}}, err => {
						resolve()
					})
				}
			})
		})
		// 用户关注改变
		await new Promise((resolve,reject)=>{
			user.findOne({user:req.body.user},(err,i)=>{
				if(err) throw err;
				if (req.body.num === -1) {
					// 取消关注
				user.updateOne({user:req.body.user},{$pull:{
					follow: req.body.dpName
				}}, err => {
					resolve()
				})
				} else {
					// 关注
				user.updateOne({user:req.body.user},{$addToSet:{
					follow: req.body.dpName
				}}, err => {
					resolve()
				})
				}
			})
		})
		res.send('1')
	})
	// 我的关注
	app.get('/follow',(req,res)=>{
		var body = []
		user.findOne({_id: objectId(req.query.id)},(err,i)=>{
			if (!i.follow) {
				return ''
			}
			i.follow.forEach(j => {
				dp.findOne({dpName: j}, (err,k)=>{
					body.push({
						user: k.user,
						dpName: k.dpName
					})
				})
			})
			setTimeout(()=>{
				res.send(body)
			}, 50)
		})
	})
	// 新增足迹
	app.get('/addHistory',(req,res)=>{
		let body = req.query.id.split(',')
		let date = new Date().getTime();
		user.findOne({user:body[1]},(err,i)=>{
			if (!i) {
				return ''
			}
			if (i.history) {
				var history = i.history.filter(j => {
					return j.history !== body[0]
				})
				user.updateOne({user: body[1]},{$set:{
					history: history
				}})
				if (history.length >= 10) {
					i.history.splice(0,1)
					user.updateOne({user: body[1]},{$set:{
						history: i.history
					}})
				}
			}
			body[0] = {
				history: body[0],
				date: date
			}
			user.updateOne({user: body[1]}, {$addToSet:{
				history: body[0]
			}})
		})
		})
	//足迹
	app.get('/history',(req,res)=>{
		var body = [];
		var leng = 0;
		var index = 0;
		user.findOne({_id:objectId(req.query.id)},(err,i)=>{
			if(!i.history){
				return ''
			}
			i.history.forEach(n => {
				leng++
			})
			i.history.forEach(j => {
				commodity.findOne({_id:objectId(j.history)},(err,k)=>{
					index++
					if (!k) {
						return false
					}
					k.date = j.date;
					body.push(k);
					if (leng === index) {
						res.send(body);
					}
				})
			})
		})
	})
	// 添加商品（无需审核了）
	app.post('/addSp',upload.array('file'),(req,res)=>{
		// 图片数组
		var imgArr = []
		for(let i = 0;i < req.files.length;i++){
			imgArr.push(`${Imgip}${req.files[i].filename}`)
		}
		// 用户名
		var user = req.body.user
		// 商品信息
		var sp = JSON.parse(req.body.sp)
		commodity.insert({
			imgArr: imgArr,
			user: user,
			...sp
		})
	})
	// 获取指定店铺的商品列表
	app.get('/spList',(req,res)=>{
		var body = []
		commodity.find({user: req.query.user}).forEach(i=>{
			body.push(i)
		},err=>{
			res.send(body)
		})
	})
	// 全部商品列表
	app.get('/list',async (req,res)=>{
		// 新品
		var newSp = []
		await new Promise((resolve,reject)=>{
			commodity.find().sort({date: -1}).forEach(i=>{
				newSp.push(i)
			},err=>{
				resolve(1)
			})
		})
		// 热门精品
		var hotSp = []
		await new Promise((resolve,reject)=>{
			commodity.find().sort({sales: -1}).forEach(i=>{
				hotSp.push(i)
			},err=>{
				resolve(1)
			})
		})
		var sp = [hotSp,newSp]
		res.send(sp)
	})
	// 指定商品
	app.get('/sp',(req,res)=>{
		commodity.findOne({_id:objectId(req.query.id)},(err,i)=>{
			dp.findOne({user:i.user},(err,j)=>{
				i.dpName = j.dpName
				res.send(i)
			})
		})
	})
	// 加入购物车
	app.post('/addGwc',(req,res)=>{
		let date = new Date().getTime();
		gwc.findOne({id:req.body.id,type:req.body.type},(err,i)=>{
			if(i){
				gwc.update({id:req.body.id,type:req.body.type},{$set:{num:i.num+1}})
			} else {
				req.body.date = date;
				gwc.insert(req.body);
			}
		})
	})
	// 删除购物车
	app.post('/delGwc',(req,res)=>{
		req.body.forEach((i,j) => {
			gwc.deleteOne({_id:objectId(i.id)}, err => {
				if (parseInt(j+1) === req.body.length) {
					res.send('ok')
				}
			})
		})
	})
	// 查看我的购物车
	app.get('/gwc',async (req,res)=>{
		var body = [];
		var msg = gwc.find({user:req.query.user})
		var leng = 0;
		var index = 0;
		msg.forEach(()=>{
			leng++
		},err=>{
			msg.forEach((i,n) => {
				if (i) {
						let msg = {}
						commodity.findOne({_id:objectId(i.id)},(err,j)=>{
							if (j) {
								msg = {...j}
								msg.size = i.type
								msg.num = i.num
								msg.id = i._id
								msg.date = i.date
								dp.findOne({user:msg.user},(err,k)=>{
									if (k) {
										msg.dpName = k.dpName
										body.push(msg)
										index++
										if (leng === index) {
											res.send(body)
										}
									}
								})
							}
						})
				}
			})
		})
	})
	// 购物车数量变化
	app.post('/gwcNum',(req,res)=>{
		gwc.update({_id:objectId(req.body._id)},{$set:{
			num:req.body.num
		}})
	});
	// 搜索商品
	app.get('/search',(req,res)=>{
		eval(`var reg=/${req.query.dpName}/i;`);
		var body = []
		commodity.find().forEach(i => {
			if (reg.test(i.name)) {
				body.push(i)
			} else if (reg.test(i.type)) {
				body.push(i)
			}
		},err=>{
			res.send(body)
		})
	})
	// 新增收货地址 or 修改收货地址
	app.post('/address',async (req,res)=>{
		if (req.body.default){
			address.updateOne({user:req.body.user,default:true},{$set:{
				default: false
			}})
		}
		setTimeout(()=>{
			if (req.body.type === '编辑收货地址') {
				address.updateOne({_id:objectId(req.body._id)},{$set: {
					name: req.body.name,
					number: req.body.number,
					default: req.body.default,
					address: req.body.address
				}}, err => {
					res.send('ok')
				})
			} else {
				address.insert(req.body, err => {
					res.send('ok')
				})
			}
		},20)
	})
	// 删除我的收货地址
	app.get('/delAddress',(req,res)=>{
		address.deleteOne({_id:objectId(req.query._id)}, err => {
			res.send('ok')
		})
	})
	// 获取我的收货地址
	app.get('/getAddress',async (req,res)=>{
		let body = []
		await address.find({user:req.query.user}).forEach(i => {
			body.push(i)
		})
		res.send(body)
	})
	// 添加订单
	app.post('/addOrder',async (req,res)=>{
		var body = [];
		for (i of req.body.list) {
      let y = i.num;
      await new Promise((resolve,reject)=>{
        commodity.findOne({_id:objectId(i._id)},(err,j)=>{
          let num = j.sales + y;
          commodity.updateOne({_id:objectId(j._id)},{$set:{
            sales: num
          }},err=>{
            resolve('1')
          });
        })
      })
			delete i._id
			i.date = getTime()
			i.address = req.body.address
			i.userName = req.body.userName
			i.user = req.body.user
			body.push(i)
		}
		order.insert(body, err => {
			if(err) throw err
			res.send('ok')
		})
	})
	// 查看订单
	app.get('/order',(req,res)=>{
		let body = []
		order.find().forEach(i => {
			body.push(i)
		}, err => {
			res.send(body)
		})
	})
	// 聊天记录篇
	io.on('connection', function (socket) {
		// 初始化
		socket.on('init',obj=>{
			socket.join(obj.user)
			if (obj.user === 'admin') {
				socket.join('root')
				let body3 = []
				chat.find({readUser: 'root',read: false}).forEach(i => {
					body3.push(i)
				}, err => {
					socket.emit('kefu',body3)
				})
			}
			if (obj.dpName) {
				socket.join(obj.dpName)
				let body1 = []
				chat.find({readUser: obj.dpName,read: false}).forEach(i => {
					body1.push(i)
				}, err => {
					socket.emit('dpMsg',body1)
				})
			}
			let body = []
			chat.find({readUser: obj.user,read: false}).forEach(i => {
				body.push(i)
			}, err => {
				socket.emit('userMsg',body)
			})
		})
		// 给指定用户发送消息
		socket.on('sendMsg',obj=>{
			obj.msg.time = new Date().getTime()
			obj.msg.read = false
			obj.msg.readUser = obj.msg.tarUser
			obj.msg.fsr = obj.msg.user
			obj.msg.tp = Imgip + '1.jpg'
			socket.in(obj.msg.tarUser).emit('msg', obj.msg)
			chat.insert(obj.msg)
			if (obj.msg.tarUser === 'root') {
				setTimeout(()=>{
					chat.findOne(obj.msg, (err,data) => {
						if (data) {
							let yx = {
								from: '1633911462@qq.com',
								subject: '网站 http://120.25.215.239/shopping/ 有新的消息',
								to: '1633911462@qq.com',
								text: '管理员用户，你好，网站 http://120.25.215.239/shopping/ 有新的消息，用户' + obj.msg.user + '发送的！'
							};
							nodemail(yx)
						}
					})
				},300000)
			} else {
				if (!obj.msg.dp && obj.msg.user !== 'root') {
					dp.findOne({dpName:obj.msg.tarUser}, (err,data) => {
						if (data) {
							user.findOne({user:data.user}, (err,mail) => {
								setTimeout(()=>{
									chat.findOne(obj.msg, (err,data) => {
										if (data) {
											let yx = {
												from: '1633911462@qq.com',
												subject: '网站 http://120.25.215.239/shopping/ 有新的消息',
												to: data.mail,
												text: '网站 http://120.25.215.239/shopping/ 有新的消息，用户' + obj.msg.user + '发送的！'
											};
											nodemail(yx)
										}
									})
								},300000)
							})
						}
					})
				} else {
					user.findOne({user:obj.msg.tarUser}, (err,data) => {
						setTimeout(()=>{
							chat.findOne(obj.msg, (err,msg) => {
								if (msg) {
									let yx = {
										from: '1633911462@qq.com',
										subject: '网站 http://120.25.215.239/shopping/ 有新的消息',
										to: data.mail,
										text: '网站 http://120.25.215.239/shopping/ 有新的消息，用户' + obj.msg.user + '发送的！'
									};
									nodemail(yx)
								}
							})
						},10000)
					})
				}
			}
		})
	});
	// 获取当前用户的聊天列表
	app.post('/chatList',(req,res)=>{
		let body = []
		chat.find({user:req.body.user}).forEach(i => {
			body.push(i)
		},err => {
			chat.find({tarUser:req.body.user}).forEach(i => {
				body.push(i)
			},err => {
				body.sort((a,b)=>{
					return b.time - a.time
				})
				res.send(body)
			})
		})
	})
	// 获取与该用户的聊天记录
	app.post('/chat',(req,res)=>{
		let body = []
		chat.find({user:req.body.user,tarUser:req.body.tarUser}).forEach(i => {
			body.push(i)
		},err => {
			chat.find({user:req.body.tarUser,tarUser:req.body.user}).forEach(i => {
				body.push(i)
			},err => {
				body.sort((a,b)=>{
					return a.time - b.time
				})
				chat.updateMany({
					read: false,
					readUser: req.body.user,
					fsr: req.body.tarUser
				},{$set:{
					read: true
				}})
				res.send(body)
			})
		})
	})
})
app.listen(7000)
