"use strict";

const util = require('../lib/util');
const { v4: uuidv4 } = require('uuid');
const {getPosition} = require("../lib/entityUtils");
const gameLogic = require('../game-logic');

class Virus {
    constructor(position, radius, mass, config, direction) {
        this.id = uuidv4();
        this.x = position.x;
        this.y = position.y;
        this.radius = radius;
        this.mass = mass;
        this.fill = config.fill;
        this.stroke = config.stroke;
        this.strokeWidth = config.strokeWidth;
        this.feedCount = 0;
        this.direction = direction || {x: 0, y: 0};
        this.speed = direction ? 25 : 0;
    }

    move(gameWidth, gameHeight) {
        if (this.speed <= 0) return;

        this.previousX = this.x;
        this.previousY = this.y;
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
        this.speed = Math.max(0, this.speed - 0.5);
        gameLogic.adjustForBoundaries(this, this.radius, 5, gameWidth, gameHeight);
    }
}

exports.VirusManager = class {
    constructor(virusConfig) {
        this.data = [];
        this.virusConfig = virusConfig;
    }

    pushNew(virus) {
        this.data.push(virus);
    }

    feed(virus, direction) {
        virus.feedCount++;
        if (virus.feedCount < this.virusConfig.feedCount) return false;

        virus.feedCount = 0;
        this.pushNew(new Virus(
            {x: virus.x, y: virus.y},
            virus.radius,
            virus.mass,
            this.virusConfig,
            direction
        ));
        return true;
    }

    move(gameWidth, gameHeight) {
        this.data.forEach(virus => virus.move(gameWidth, gameHeight));
    }

    addNew(number) {
        while (number--) {
            var mass = util.randomInRange(this.virusConfig.defaultMass.from, this.virusConfig.defaultMass.to);
            var radius = util.massToRadius(mass);
            var position = getPosition(this.virusConfig.uniformDisposition, radius, this.data);
            var newVirus = new Virus(position, radius, mass, this.virusConfig);
            this.pushNew(newVirus);
        }
    }

    delete(virusCollision) {
        this.data.splice(virusCollision, 1);
    }
};
