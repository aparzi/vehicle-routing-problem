export class VRP {
    constructor(numCustomers, numVehicles, width = 600, height = 600) {
        this.width = width;
        this.height = height;

        // depot
        this.depot = { x: width / 2, y: height / 2 };

        // generate customers
        this.customers = [];
        for (let i = 0; i < numCustomers; i++) {
            this.customers.push({
                id: i,
                x: Math.random() * width,
                y: Math.random() * height,
                risk: Math.random() * 0.3 // cybersecurity risk factor
            });
        }

        // number of vehicles
        this.K = numVehicles;

        // routes: array of arrays
        this.routes = Array.from({ length: this.K }, () => []);
    }
}
