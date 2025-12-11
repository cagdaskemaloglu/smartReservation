const EventEmitter = require('events');

const reservationEventEmitter = new EventEmitter();

const EVENTS = {
    RESERVATION_CREATED: 'reservationCreated',
    RESERVATION_CANCELLED: 'reservationCancelled'
};

module.exports = { reservationEventEmitter, EVENTS };