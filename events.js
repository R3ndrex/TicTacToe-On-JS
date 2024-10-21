/*global events*/
const events = {
    eventList: {},
    on: function (eventName, callback) {
        this.eventList[eventName] = this.eventList[eventName] || [];
        this.eventList[eventName].push(callback);
    },
    off: function (eventName, callback) {
        if (this.eventList[eventName]) {
            for (let i = 0; i < this.eventList[eventName].length; i++) {
                if (this.eventList[eventName][i] === callback) {
                    this.eventList[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },
    emit: function (eventName, arg) {
        if (this.eventList[eventName]) {
            this.eventList[eventName].forEach(function (fn) {
                fn(arg);
            });
        }
    },
};
