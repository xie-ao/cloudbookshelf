const APPID = 'wxd7ac5fb5ac10dbf9'
const APPSECRET = 'c722ed6e8d8d61dfcbdd6f563208aed9'

const jwt = require('jsonwebtoken')

function getToken(openId){
	return jwt.sign({openId},APPSECRET,{expiresIn:60*60*24})
}

function verifyToken(token){
	return jwt.verify(token,APPSECRET)
}

module.exports = {
	APPID,
	APPSECRET,
	getToken,
	verifyToken
}
