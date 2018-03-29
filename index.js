const ping = require("ping"),
	request = require("superagent");

const config = require("./config.js");

let status = {};
config.ips.forEach(function(ip)
{
	status[ip] = {
		online: undefined,
		last_online: new Date(0),
		last_offline: new Date(0)
	};
});

setInterval(()=>{



}, 1000);

const notify_ide = (ip, alive)=>{

	if(alive || !config.notify_online_only)
	{
		console.log(`\nNotifying IDE that ${ip} is ${alive ? "online": "offline"}`);
		request
			.get(`${config.smartthings.ide}/api/smartapps/installations/${config.smartthings.app_id}/statechanged/${alive ? "online": "offline"}`)
			.query({
				access_token: config.smartthings.access_token,
				ipadd: ip
			})
			.end((err, res)=>{

				if(err) console.error(err);
				
				if(res && res.status == 200)
				{
					status[ip].online = alive;
				}
			});
	}
	else
	{
		console.log(`\n*NOT* notifying IDE that ${ip} is ${alive ? "online": "offline"}`);
		status[ip].online = alive;
	}
};

const check_status = () =>{

	let checks = Object.keys(status).map((ip)=>{

		if(new Date() - status[ip].last_online > config.min_time_between_online_checks)
		{
			//console.log(`Checking ${ip}`);
			process.stdout.write("*");
			return ping.promise.probe(ip, {
				timeout: 1
			});
		}
	});

	Promise.all(checks).then((results)=>{
		
		results.forEach((result)=>{
			
			if(!result) return;

			status[result.host][`last_${result.alive ? "online": "offline"}`] = new Date();

			if(status[result.host].online === undefined)
			{
				notify_ide(result.host, result.alive);
			}
			else if(result.alive && !status[result.host].online)
			{
				// Looks like you might be going online
				notify_ide(result.host, result.alive);
			}
			else if(!result.alive && status[result.host].online)
			{
				// Looks like you might be going offline
				notify_ide(result.host, result.alive);
			}
		});

		setTimeout(check_status, config.min_time_between_checks);

	}).catch((err)=>{
		console.error(err);
		
		setTimeout(check_status, config.min_time_between_checks);
	});

};

return check_status();