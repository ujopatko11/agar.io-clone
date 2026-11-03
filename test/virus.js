const expect = require('chai').expect;
const {VirusManager} = require('../src/server/map/virus');
const {isSweptCircleCollision} = require('../src/server/lib/entityUtils');

describe('virus.js', () => {
    it('detects a feed pellet crossing a virus between ticks', () => {
        const previousPellet = {x: 0, y: 0};
        const pellet = {x: 25, y: 0};
        const virus = {x: 10, y: 0};

        expect(isSweptCircleCollision(pellet, previousPellet, virus, virus, 5)).to.equal(true);
    });

    it('splits after the configured number of feeds and launches in the feed direction', () => {
        const config = {
            fill: '#33ff33',
            stroke: '#19D119',
            strokeWidth: 20,
            feedCount: 2,
            defaultMass: {from: 100, to: 150},
            uniformDisposition: false
        };
        const manager = new VirusManager(config);
        manager.addNew(1);
        const virus = manager.data[0];
        virus.x = 2500;
        virus.y = 2500;
        const originalPosition = {x: virus.x, y: virus.y};

        expect(manager.feed(virus, {x: 1, y: 0})).to.equal(false);
        expect(manager.data).to.have.length(1);
        expect(manager.feed(virus, {x: 1, y: 0})).to.equal(true);
        expect(manager.data).to.have.length(2);
        expect(virus.feedCount).to.equal(0);

        const launchedVirus = manager.data[1];
        manager.move(5000, 5000);
        expect(launchedVirus.x).to.be.above(originalPosition.x);
        expect(launchedVirus.y).to.equal(originalPosition.y);
    });
});
