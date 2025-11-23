export function distance(a, b) {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
}

export function costWithRisk(a, b, riskFactor) {
    const d = distance(a, b);
    return d * (1 + riskFactor);
}

export function routeLength(route, depot) {
    let cost = 0;
    let prev = depot;
    for (let c of route) {
        cost += costWithRisk(prev, c, c.risk);
        prev = c;
    }
    cost += costWithRisk(prev, depot, 0);
    return cost;
}
