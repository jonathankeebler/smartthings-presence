module.exports = {
	"ips": ["192.168.86.229"],
	"min_time_between_checks": 1000,
	"min_time_between_online_checks": 5000,
	"smartthings": {
		"ide": "https://graph-na04-useast2.api.smartthings.com",
		"access_token": process.env.ACCESS_TOKEN || "PASTE YOUR ACCESS TOKEN",
		"app_id": process.env.ACCESS_TOKEN || "PASTE YOUR APP ID" 
	}
};