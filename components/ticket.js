class Ticket {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = false;
    this.created = Date.now();
  }
}

module.exports = { Ticket };