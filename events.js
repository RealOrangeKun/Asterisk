const fs = require('fs');
const path = require('path');
const events = new Map();
const foldersPath = path.join(__dirname, 'events');
const eventsPath = foldersPath;
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if ('execute' in event) {
		events.set(event.name, event);
	}
	else {
		console.log(`[WARNING] The event at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
module.exports = events;