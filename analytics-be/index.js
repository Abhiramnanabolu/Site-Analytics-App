const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/script', async (req, res) => {
    const { domain, userId } = req.body;

    try {
        // Check if the domain already exists
        let site = await prisma.website.findFirst({
            where: { domain: domain },
        });

        if (site) {
            return res.status(200).send({
                message: "Domain already exists",
                data: site,
                script: generateTrackingScript(site.id),
            });
        }

        // Add the new domain to the database
        const newSite = await prisma.website.create({
            data: { domain: domain, userId: userId },
        });

        // Send the tracking script back to the user
        res.status(201).send({
            message: "Domain added successfully",
            data: newSite,
            script: generateTrackingScript(newSite.id),
        });
    } catch (error) {
        console.error("Error in /script endpoint:", error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

app.post('/collect', async (req, res) => {
    const { siteId, eventName, data, timestamp } = req.body;

    const deviceDetails = getDeviceDetails(req); // Ensure `getDeviceDetails` is defined elsewhere
    const browser = deviceDetails.browser?.name || "Unknown";
    const os = deviceDetails.os?.name || "Unknown";

    let deviceType ;
    if(deviceDetails.device?.type == null) {
        deviceType = 'Desktop';
    }
    else{
        deviceType = deviceDetails.device?.type;
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const locationDetails = geoip.lookup(ip);
    const country = locationDetails?.country || "Unknown";

    const referer = req.headers['referer'] || req.headers['referrer'] || "Direct";

    if (!siteId || !eventName || !data) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {
        let eventData = {
            websiteId: siteId,
            eventName: eventName,
            referer: referer,
            deviceDetails: JSON.stringify(deviceDetails),
            deviceType: deviceType,
            browser: browser,
            os: os,
            ip: ip,
            country: country,
            locationDetails: JSON.stringify(locationDetails),
        };

        if (eventName === 'page_view') {
            eventData.path = data.path || "Unknown";
        } else if (eventName === 'click') {
            eventData.element = data.target || "Unknown";
            eventData.elementName = data.text || "Unknown";
        } else {
            return res.status(400).send({ message: "Invalid eventName" });
        }

        const event = await prisma.event.create({
            data: eventData,
        });

        console.log("Event Logged:", event);
        res.status(201).send({ message: "Event logged successfully", event });
    } catch (error) {
        console.error("Error in /collect endpoint:", error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

app.post('/verify-domain', async (req, res) => {
    const { domain, siteId } = req.body;

    if (!domain || !siteId) {
        return res.status(400).send({ message: "domain and siteId are required" });
    }

    try {
        // Send a GET request to the website
        const response = await axios.get(`https://${domain}`);
        
        // Check if the response contains the siteId or other unique marker
        const htmlContent = response.data;

        // Check for the presence of the siteId in the script tag or meta tag
        const regex = new RegExp(`siteId: '0440b253-8949-48ff-98c8-641d802eca4e'`, 'i'); // assuming siteId is placed as a string in a JavaScript variable
        //const regex = new RegExp(`siteId="${siteId}"`, 'i'); // assuming siteId is placed as an attribute in a <script> or <meta> tag
        const isScriptPlaced = regex.test(htmlContent);

        if (isScriptPlaced) {
            return res.status(200).send({ message: "Script found and verified successfully" });
        } else {
            return res.status(404).send({ message: "Script not found or incorrectly placed" });
        }

    } catch (error) {
        console.error("Error verifying domain:", error);
        return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

function generateTrackingScript(siteId) {
    return `
        (function() {
            var siteId = '${siteId}';
            var endpoint = '${process.env.BASE_URL}/collect';

            function trackEvent(eventName, data) {
                var payload = {
                    siteId: siteId,
                    eventName: eventName,
                    data: data,
                    timestamp: new Date().toISOString(),
                };
                fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            trackEvent('page_view', { path: window.location.pathname });

            document.addEventListener('click', (e) => {
                trackEvent('click', { target: e.target.tagName , text: e.target.innerText });
            });
        })();
    `;
}

const getDeviceDetails = (req) => {
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    return parser.getResult(); // Returns detailed info about the device, OS, and browser
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
