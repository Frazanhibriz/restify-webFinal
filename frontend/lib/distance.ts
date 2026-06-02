/**
 * Calculates the distance between two coordinates in kilometers using the Haversine formula.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Gets default coordinates for a city to use as a fallback.
 */
export function getCityCenter(city: string): { latitude: number; longitude: number } {
    const c = city.toLowerCase().trim();
    if (c.includes("jakarta")) {
        return { latitude: -6.2087634, longitude: 106.845599 };
    }
    // Default to Bandung center
    return { latitude: -6.9174639, longitude: 107.6191228 };
}
