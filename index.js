// process.env.DEBUG = 'minecraft-protocol';

const { Relay } = require('bedrock-protocol');
const child_process = require('child_process');
const fs = require("fs");

const bedrock_server_path = __dirname + "/bedrock_server/";

fs.writeFileSync(bedrock_server_path + "server.properties", fs.readFileSync(__dirname + "/modefied_files/server.properties").toString('utf-8'));

child_process.exec(bedrock_server_path + "bedrock_server.exe", (error, stderr, stdout) => {
	if (error) {
		throw new Error(error.message);
	}
	if (stderr) {
		console.log("stderr: " + stderr);
	}
});

console.log("Started...");

const relay = new Relay({
	host: "0.0.0.0",
	port: 19132,
	destination: {
		host: "127.0.0.1",
		port: 65534,
		offline: false
	}
})
relay.canLong = console.debug;
relay.listen();

function generateCommandOverloads(parameterName = 'args', valueType = 53, enumType = 'valid', optinal = true, options = {
	unused: 0,
	collapse_enum: 0,
	has_semantic_constraint: 0,
	as_chained_command: 0,
	unknown2: 0
}) {
	return [
				[
					{
						parameter_name: parameterName,
						value_type: valueType,
						enum_type: enumType,
						optinal: optinal,
						options: options
					}
				]
		];
}

relay.on("connect", player => {
	player.on('clientbound', ({ name, params }) => {
		// console.log("clientbound: " + name);
		if (name === "available_commands") {
			params.command_data.push({name: 'test', description: 'test command', flags: 192, permission_level: 0, alias: -1, overloads: generateCommandOverloads()});
			//console.log(params);
		}
	});
	player.on('serverbound', ({ name, params }) => {
		if (name === "text") {
			// console.log(params);
		} else {
			// console.log(name);
		}
	});
});
