'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const Message = require('../../structures/Message'); // Make sure this path is correct based on your project structure

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);
    if (channel) {
      if (!channel.messages) {
        // Ensure channel.messages is defined
        channel.messages = {
          cache: new Map(),
          add: function(data) {
            const message = new Message(channel, data, client);
            this.cache.set(data.id, message);
            return message;
          }
        };
      }
      
      const existing = channel.messages.cache.get(data.id);
      if (existing) return { message: existing };
      const message = channel.messages.add(data);
      const user = message.author;
      let member = message.member;
      channel.lastMessageID = data.id;
      if (user) {
        user.lastMessageID = data.id;
        user.lastMessageChannelID = channel.id;
      }
      if (member) {
        member.lastMessageID = data.id;
        member.lastMessageChannelID = channel.id;
      }

      /**
       * Emitted whenever a message is created.
       * @event Client#message
       * @param {Message} message The created message
       */
      client.emit(Events.MESSAGE_CREATE, message);
      return { message };
    }

    return {};
  }
}

module.exports = MessageCreateAction;
