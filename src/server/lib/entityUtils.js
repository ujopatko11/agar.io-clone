const util = require("./util");

function getPosition(isUniform, radius, uniformPositions) {
    return isUniform ? util.uniformPosition(uniformPositions, radius) : util.randomPosition(radius);
}

function isVisibleEntity(entity, player, addThreshold = true) {
    const entityHalfSize = entity.radius + (addThreshold ? entity.radius * 0.1 : 0);
    return util.testRectangleRectangle(
        entity.x, entity.y, entityHalfSize, entityHalfSize,
        player.x, player.y, player.screenWidth / 2, player.screenHeight / 2);
}

function isSweptCircleCollision(entity, previousEntity, target, previousTarget, collisionRadius) {
    const startX = previousEntity.x - previousTarget.x;
    const startY = previousEntity.y - previousTarget.y;
    const endX = entity.x - target.x;
    const endY = entity.y - target.y;
    const movementX = endX - startX;
    const movementY = endY - startY;
    const movementLengthSquared = movementX * movementX + movementY * movementY;
    const projection = movementLengthSquared === 0 ? 0 : Math.max(0, Math.min(1,
        -(startX * movementX + startY * movementY) / movementLengthSquared));
    const closestX = startX + projection * movementX;
    const closestY = startY + projection * movementY;

    return closestX * closestX + closestY * closestY <= collisionRadius * collisionRadius;
}

module.exports = {
    getPosition,
    isVisibleEntity,
    isSweptCircleCollision
}
