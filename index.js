const ping = require("ping");

const config = require("./config.js");

let status = {};
config.ips.forEach(function(ip)
{
	status[ip] = {
		last_online: new Date(0),
		last_offline: new Date(0)
	};
});

setInterval(()=>{



}, 1000);

const check_status = () =>{

	let checks = Object.keys(status).map((ip)=>{

		if(new Date() - status[ip].last_online > config.min_time_between_online_checks)
		{
			return ping.promise.probe(ip, {
				timeout: 1
			});
		}
	});

	Promise.all(checks).then((results)=>{
		
		results.forEach((result)=>{
			
			if(!result) return;

			status[result.host][`last_${result.alive ? "online": "offline"}`] = new Date();
			
		});

		console.log(status);

		setTimeout(check_status, config.min_time_between_checks);

	}).catch((err)=>{
		console.error(err);
		
		setTimeout(check_status, config.min_time_between_checks);
	});

};

return check_status();