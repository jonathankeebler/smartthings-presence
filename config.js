module.exports = {
	"ips": ["192.168.86.229"],
	"min_time_between_checks": 1000,
	"min_time_between_online_checks": 30000,
	"online_threshold": 0,
	"offline_threshold": 5000,
	"notify_online_only": true,
	"smartthings": {
		"ide": "https://graph-na04-useast2.api.smartthings.com",
		"access_token": process.env.ACCESS_TOKEN || "PASTE YOUR ACCESS TOKEN",
		"app_id": process.env.APP_ID || "PASTE YOUR APP ID" 
	}
};