// src/types.ts
export interface ShortURL {
    shortcode: string;
    originalUrl: string;
    createdAt: string;
    expiresAt: string;
}

export interface ClickStats {
    timestamp: string;
    ipAddress: string;
    referrer: string;
    location: geoip.Lookup | null;
}

export interface CreateShortURLRequest {
    url: string;
    validity?: number;
    shortcode?: string;
}