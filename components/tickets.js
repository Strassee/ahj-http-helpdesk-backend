const { Ticket } = require('./ticket.js');

class Tickets {
  constructor() {
    this.tickets = {
      'tickets': []
    };
    this.init();
  }

  init() {
    this.tickets.tickets.push(new Ticket(performance.now(), 'test1', 'testing task 1'));
    this.tickets.tickets.push(new Ticket(performance.now(), 'test2', 'testing task 2'));
  }

  defineMethod(ctxRequest) {
    const { method } = ctxRequest.query;
    switch (method) {
      case 'allTickets':
          return {'response': this.returnAllTickets(), 'status': 200};
      
      case 'ticketById':
        const { id } = ctxRequest.query;
        const res = this.ticketDescriptionById(id);
        return res !== 'Tiket not found' ? {'response': res, 'status': 200} : {'response': res, 'status': 404};

      case 'createTicket':
        // console.log(ctxRequest.body.id);
        this.createTicket(ctxRequest.body.name, ctxRequest.body.description);
        return {'response': this.returnAllTickets(), 'status': 200};

      case 'deleteTicket':
        return this.deleteTicketById(ctxRequest.query.id) ? {'response': 'OK', 'status': 200} : {'response': 'Ticket for delete not found', 'status': 404};

      case 'changeTicket':
        return this.changeTicketById(ctxRequest.body.id, ctxRequest.body.name, ctxRequest.body.description) ? {'response': 'OK', 'status': 200} : {'response': 'Ticket for change not found', 'status': 404};

      case 'closeTicket':
        return this.closeTicketById(ctxRequest.query.id) ? {'response': 'OK', 'status': 200} : {'response': 'Ticket for close not found', 'status': 404};


      default:
          return {'response': 'Method not found', 'status': 404};
    }
  }

  createTicket(name, description) {
    this.tickets.tickets.push(new Ticket(performance.now(), name, description));
  }

  returnAllTickets() {
    const tickets = {
      'tickets': this.tickets.tickets.map(ticket => {
      return {
        'id': ticket.id,
        'name': ticket.name,
        'status': ticket.status,
        'created': ticket.created,
      }
    })};
    return tickets;
  }

  ticketDescriptionById(id) {
    const ticket = this.tickets.tickets.filter(ticket => String(ticket.id) === String(id));
    return ticket.length === 1 ? ticket[0] : 'Tiket not found';
  }

  deleteTicketById(id) {
    const tickets = {
      'tickets': this.tickets.tickets.filter(ticket => String(ticket.id) !== String(id))};
    if (tickets.tickets.length < this.tickets.tickets.length) {
      this.tickets = tickets;
      return true;
    }
    return false;
  }

  changeTicketById(id, name, description) {
    let result = false;
    this.tickets.tickets.map(ticket => {
      if(String(ticket.id) === String(id)) {
        ticket.name = name;
        ticket.description = description;
        result = true;
      }
    })
    return result;
  }

  closeTicketById(id) {
    let result = false;
    this.tickets.tickets.map(ticket => {
      if(String(ticket.id) === String(id)) {
        ticket.status = true;
        result = true;
      }
    })
    return result;
  }
}

module.exports = { Tickets };