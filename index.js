const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, guildIds } = require('./config.json');
const keep_alive = require("./keep_alive.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const Guild = require('./guild.js')

const mongoose = require('mongoose');
const { mogodb } = require('./config.json');

let config;
try {
  config = require('./config.json');
} catch (error) {
  console.error('Error loading config.json:', error);
  process.exit(1);
}

mongoose.connect(mogodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

client.on('guildCreate', async (guild) => {
	try {
	  // Check if the guild ID already exists in the database
	  const existingGuild = await Guild.findOne({ guildId: guild.id });
	  if (!existingGuild) {
		// If not, create a new document in the database
		const newGuild = new Guild({ guildId: guild.id });
		await newGuild.save();
		// Update the guildIds array in the config.json file
		config.guildIds.push(guild.id);
		await fs.promises.writeFile('./config.json', JSON.stringify(config, null, 2));
	  }
	} catch (err) {
	  console.error('Error saving guild ID to database:', err);
	}
  });

  client.on('guildDelete', async (guild) => {
	try {
	  // Remove the guild ID from the database
	  await Guild.deleteOne({ guildId: guild.id });
	  // Remove the guild ID from the guildIds array in the config.json file
	  config.guildIds = config.guildIds.filter(id => id !== guild.id);
	  await fs.promises.writeFile('./config.json', JSON.stringify(config, null, 2));
	} catch (err) {
	  console.error('Error deleting guild ID from database:', err);
	}
  });





client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);