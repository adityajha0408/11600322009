// src/index.ts
import express, { Request, Response } from 'express';
import geoip from 'geoip-lite';
import { log } from './logger';
import * as urlService from './shortUrl.service';
import { ClickStats, CreateShortURLRequest } from './types';

const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = 'http://localhost';

app.use(express.json());
app.set('trust proxy', true);

app.post('/shorturls', (req: Request, res: Response) => {
    const { url, validity, shortcode } = req.body as CreateShortURLRequest;

    if (!url) {
        log('backend', 'error', 'controller', 'Validation failed: URL is required');
        return res.status(400).json({ error: 'URL is a required field.' });
    }

    if (shortcode && urlService.getShortUrl(shortcode)) {
        log('backend', 'error', 'controller', 'Shortcode already exists', { shortcode });
        return res.status(409).json({ error: 'Custom shortcode already in use.' });
    }

    const newUrl = urlService.createShortUrl(url, validity, shortcode);
    if (!newUrl) {
        log('backend', 'error', 'controller', 'Invalid custom shortcode format', { shortcode });
        return res.status(400).json({ error: 'Invalid custom shortcode format. Use only alphanumeric characters.' });
    }

    const shortLink = `${HOSTNAME}:${PORT}/${newUrl.shortcode}`;
    log('backend', 'info', 'controller', 'Short URL created', { shortcode: newUrl.shortcode });
    res.status(201).json({ shortLink, expiry: newUrl.expiresAt });
});

app.get('/:shortcode', (req: Request, res: Response) => {
    const { shortcode } = req.params;
    const shortUrl = urlService.getShortUrl(shortcode);

    if (!shortUrl) {
        log('backend', 'warn', 'controller', 'Shortcode not found', { shortcode });
        return res.status(404).json({ error: 'Short URL not found.' });
    }

    if (new Date() > new Date(shortUrl.expiresAt)) {
        log('backend', 'warn', 'controller', 'Short URL has expired', { shortcode });
        return res.status(410).json({ error: 'Short URL has expired.' });
    }

    const ip = req.ip;
    const click: ClickStats = {
        timestamp: new Date().toISOString(),
        ipAddress: ip,
        referrer: req.get('Referrer') || 'direct',
        location: geoip.lookup(ip),
    };
    urlService.recordClick(shortcode, click);

    log('backend', 'info', 'controller', 'Redirecting short URL', { shortcode });
    res.redirect(302, shortUrl.originalUrl);
});

app.get('/shorturls/:shortcode', (req: Request, res: Response) => {
    const { shortcode } = req.params;
    const stats = urlService.getStatistics(shortcode);

    if (!stats) {
        log('backend', 'warn', 'controller', 'Statistics requested for non-existent shortcode', { shortcode });
        return res.status(404).json({ error: 'Statistics for this short URL not found.' });
    }

    log('backend', 'info', 'controller', 'Statistics retrieved', { shortcode });
    res.status(200).json(stats);
});

app.listen(PORT, () => {
    console.log(`Server is running on ${HOSTNAME}:${PORT}`);
});