// src/pages/pulse/pulse-utils.js

import { GREETING_MESSAGES } from '../../utils/constants.js';

export function getGreetingConfig(user) {
    const hour = new Date().getHours();
    let config;

    if (hour < 12) config = GREETING_MESSAGES.MORNING;
    else if (hour < 18) config = GREETING_MESSAGES.AFTERNOON;
    else if (hour < 22) config = GREETING_MESSAGES.EVENING;
    else config = GREETING_MESSAGES.NIGHT;

    return {
        title: config.title,
        subline: config.subline,
        name: user.guest ? "" : user.name + ".",
        symbol: user.guest ? "!" : ","
    };
}

export function formatDeadline(dateString) {
    if (!dateString) return "No upcoming deadline";

    const options = { month: 'long', day: 'numeric', year: 'numeric' };

    return new Date(dateString).toLocaleDateString('en-US', options);
}