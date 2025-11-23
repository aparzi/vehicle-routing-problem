// heuristics.js
// Contains: Greedy Insertion + 2-Opt for VRP

import { routeLength } from "./utils.js";

// ---------------------------------------------------------
// GREEDY INSERTION
// ---------------------------------------------------------
export function greedyInsertion(vrp) {
    const unassigned = [...vrp.customers];

    while (unassigned.length > 0) {
        const randomIndex = Math.floor(Math.random() * unassigned.length);
        const customer = unassigned.splice(randomIndex, 1)[0];
        let bestVehicle = 0;
        let bestPosition = 0;
        let bestIncrease = Infinity;

        for (let v = 0; v < vrp.routes.length; v++) {
            const route = vrp.routes[v];

            for (let pos = 0; pos <= route.length; pos++) {
                const newRoute = [...route.slice(0, pos), customer, ...route.slice(pos)];
                const newCost = routeLength(newRoute, vrp.depot);
                const oldCost = routeLength(route, vrp.depot);
                const increase = newCost - oldCost;

                if (increase < bestIncrease) {
                    bestIncrease = increase;
                    bestPosition = pos;
                    bestVehicle = v;
                }
            }
        }

        vrp.routes[bestVehicle].splice(bestPosition, 0, customer);
    }

    return vrp.routes;
}

// ---------------------------------------------------------
// 2-OPT LOCAL SEARCH
// ---------------------------------------------------------
export function twoOpt(route, depot) {
    let improved = true;

    while (improved) {
        improved = false;

        for (let i = 1; i < route.length - 1; i++) {
            for (let j = i + 1; j < route.length; j++) {
                const newRoute = [
                    ...route.slice(0, i),
                    ...route.slice(i, j).reverse(),
                    ...route.slice(j)
                ];

                if (routeLength(newRoute, depot) < routeLength(route, depot)) {
                    route = newRoute;
                    improved = true;
                }
            }
        }
    }

    return route;
}

export function optimizeAllRoutes(vrp) {
    console.log("Optimizing routes...");
    console.log('vrp => ', vrp);
    for (let k = 0; k < vrp.routes.length; k++) {
        vrp.routes[k] = twoOpt(vrp.routes[k], vrp.depot);
    }
}

export async function optimizeAllRoutesAnimated(vrp, drawFn, delay = 200) {
    let anyImprovement = false;
    
    for (let k = 0; k < vrp.routes.length; k++) {
        let improved = true;
        let route = vrp.routes[k];
        
        while (improved) {
            improved = false;
            let routeImproved = false;

            for (let i = 1; i < route.length - 1; i++) {
                for (let j = i + 1; j < route.length; j++) {
                    const newRoute = [
                        ...route.slice(0, i),
                        ...route.slice(i, j).reverse(),
                        ...route.slice(j)
                    ];

                    if (routeLength(newRoute, vrp.depot) < routeLength(route, vrp.depot)) {
                        vrp.routes[k] = newRoute;
                        route = newRoute;
                        improved = true;
                        routeImproved = true;
                        anyImprovement = true;

                        // ANIMAZIONE: aggiorna e aspetta
                        drawFn();
                        await new Promise(res => setTimeout(res, delay));
                    }
                }
            }
            
            // Se non ci sono miglioramenti per questa route, esci dal ciclo while
            if (!routeImproved) {
                break;
            }
        }
    }
    
    return anyImprovement;
}
