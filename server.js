const express = require('express');
const os = require('os');
const osUtils = require('os-utils');

const app = express();
const port = process.env.PORT || 3001;

// Function to format uptime in days, hours, minutes, and seconds
function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`;
}

// Endpoint to get server details
app.get('/server-details', (req, res) => {
    osUtils.cpuUsage((v) => {
        const cpuSpeedGHz = os.cpus()[0].speed / 1000; // Convert MHz to GHz
        const timePerCycleMs = (1 / cpuSpeedGHz) * 1000; // Time per cycle in milliseconds

        const details = {
            ramUsagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%',
            ramUsageSize: ((os.totalmem() - os.freemem()) / (1024 ** 2)).toFixed(2) + ' MB',
            cpuUsage: (v * 100).toFixed(2) + '%',
            cpuBrand: os.cpus()[0].model,
            ramSize: (os.totalmem() / (1024 ** 2)).toFixed(2) + ' MB', // Convert bytes to MB
            uptime: formatUptime(os.uptime()), // Format uptime
            speed: timePerCycleMs.toFixed(5) + ' ms per cycle',
            cpuSpeed: os.cpus()[0].speed + ' MHz',
            os: os.platform() + ' ' + os.release()
        };

        res.json(details);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
