
'use strict';

const APIMessage = require('./APIMessage');
const Base = require('./Base');
const ClientApplication = require('./ClientApplication');
const MessageAttachment = require('./MessageAttachment');
const Embed = require('./MessageEmbed');
const Mentions = require('./MessageMentions');
const ReactionCollector = require('./ReactionCollector');
const { Error, TypeError } = require('../errors');
const ReactionManager = require('../managers/ReactionManager');
const Collection = require('../util/Collection');
const { MessageTypes } = require('../util/Constants');
const MessageFlags = require('../util/MessageFlags');
const Permissions = require('../util/Permissions');
const SnowflakeUtil = require('../util/Snowflake');
const Util = require('../util/Util');

/**
 * Represents a message on Discord.
 * @extends {Base}
 */
class Message extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the message
   * @param {TextChannel|DMChannel|NewsChannel} channel The channel the message was sent in
   */
  constructor(client, data, channel) {
    super(client);

    /**
     * The channel that the message was sent in
     * @type {TextChannel|DMChannel|NewsChannel}
     */
    this.channel = channel;

    /**
     * Whether this message has been deleted
     * @type {boolean}
     */
    this.deleted = false;

    // Ensure client is assigned properly
    this.client = client;

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of the message
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('type' in data) {
      /**
       * The type of the message
       * @type {?MessageType}
       */
      this.type = MessageTypes[data.type];

      /**
       * Whether or not this message was sent by Discord, not actually a user (e.g. pin notifications)
       * @type {?boolean}
       */
      this.system = data.type !== 0;
    } else if (typeof this.type !== 'string') {
      this.system = null;
      this.type = null;
    }

    if ('content' in data) {
      /**
       * The content of the message
       * @type {?string}
       */
      this.content = data.content;
    } else {
      this.content = null;
    }

    /**
     * The author of the message
     * @type {?User}
     */
    // Check if this.client and this.client.users are defined before using them
    if (this.client && this.client.users && typeof this.client.users.add === 'function') {
        this.author = this.client.users.add(data.author, !data.webhook_id);
    } else {
        console.error("this.client or this.client.users is not defined or does not have the 'add' method.");
        this.author = null;  // or handle the error appropriately
    }

    // Additional fields and methods as required...

  }
}

module.exports = Message;
