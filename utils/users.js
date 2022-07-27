const ActiveUsers = class ActiveUsersList {
  constructor() {
    this.active_users = {};
  }

  userJoined = (id, username) => {
    this.active_users[id] = username;
    return this.active_users;
  };

  userLeft = (id) => {
    delete this.active_users[id];
    return this.active_users;
  };
};

module.exports = { ActiveUsers };
