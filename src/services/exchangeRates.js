const CACHE_KEY = 'secondthrift_exchange_rates_eur';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const FALLBACK_RATES = {
    EUR: 1,
    INR: 110,
    USD: 1.17,
    GBP: 0.87,
    CAD: 1.62,
    AUD: 1.79,
    CHF: 0.93,
    SEK: 10.95,
    NOK: 11.8,
    DKK: 7.46,
    PLN: 4.25,
    CZK: 24.4,
    HUF: 390,
    RON: 5.08,
    BGN: 1.96,
    AED: 4.29,
    SAR: 4.38,
    SGD: 1.51,
    MYR: 4.92,
    JPY: 182,
};

const readCachedRates = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        const parsed = JSON.parse(cached);
        if (!parsed?.rates || Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
        return parsed;
    } catch {
        return null;
    }
};

const writeCachedRates = (rates) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, savedAt: Date.now() }));
    } catch {
        // Cache failures should never block checkout.
    }
};

export const getExchangeRates = async () => {
    const cached = readCachedRates();
    if (cached) return { rates: { ...FALLBACK_RATES, ...cached.rates }, stale: false };

    try {
        const response = await fetch('https://open.er-api.com/v6/latest/EUR');
        if (!response.ok) throw new Error('Exchange rate request failed');
        const data = await response.json();
        if (data.result !== 'success' || !data.rates) throw new Error('Invalid exchange rate response');
        const rates = { ...FALLBACK_RATES, ...data.rates, EUR: 1 };
        writeCachedRates(rates);
        return { rates, stale: false };
    } catch {
        return { rates: FALLBACK_RATES, stale: true };
    }
};

export const convertFromEur = (amount, currency, rates) => {
    const rate = rates?.[currency] || 1;
    return Number((Number(amount || 0) * rate).toFixed(2));
};
