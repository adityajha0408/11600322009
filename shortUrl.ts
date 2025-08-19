// src/shortUrl.service.ts
import { nanoid } from 'nanoid';
import { ShortURL, ClickStats } from './types';

const urlStore = new Map<string, ShortURL>();
const statsStore = new Map<string, ClickStats[]>();

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

export function createShortUrl(
    originalUrl: string,
    validityInMinutes?: number,
    customShortcode?: string
): ShortURL | null {
    const shortcode = customShortcode || nanoid(7);

    if (customShortcode && !ALPHANUMERIC_REGEX.test(customShortcode)) {
        return null;
    }
    if (urlStore.has(shortcode)) {
        return null;
    }

    const now = new Date();
    const validity = validityInMinutes || 30;
    const expiresAt = new Date(now.getTime() + validity * 60 * 1000);

    const newShortUrl: ShortURL = {
        shortcode,
        originalUrl,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
    };

    urlStore.set(shortcode, newShortUrl);
    statsStore.set(shortcode, []);
    return newShortUrl;
}

export function getShortUrl(shortcode: string): ShortURL | undefined {
    return urlStore.get(shortcode);
}

export function recordClick(shortcode: string, stats: ClickStats): void {
    const clicks = statsStore.get(shortcode);
    if (clicks) {
        clicks.push(stats);
    }
}

export function getStatistics(shortcode: string) {
    const shortUrlData = urlStore.get(shortcode);
    if (!shortUrlData) {
        return null;
    }
    const clicks = statsStore.get(shortcode) || [];

    return {
        originalUrl: shortUrlData.originalUrl,
        createdAt: shortUrlData.createdAt,
        expiresAt: shortUrlData.expiresAt,
        totalClicks: clicks.length,
        clickDetails: clicks,
    };
}