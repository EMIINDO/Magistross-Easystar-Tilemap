"use strict";

globalThis.erenf = {
    fillGridFromTilemap(grid, sdkInst) {
        if (!sdkInst || !sdkInst.GetTileAt) return;
        const width = sdkInst.GetMapWidth();
        const height = sdkInst.GetMapHeight();

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                // SDK v2: Use GetTileAt directly on sdkInst (PascalCase)
                grid[i][j] = sdkInst.GetTileAt(j, i) & 0x1FFFFFFF;
            }
        }
    },

    createArray(length) {
        var arr = new Array(length || 0),
            i = length;
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) arr[length - 1 - i] = globalThis.erenf.createArray.apply(this, args);
        }
        return arr;
    },

    calculateDirection(diffX, diffY) {
        if (diffX === 0 && diffY === -1) return "TOP";
        else if (diffX === 1 && diffY === -1) return "TOP_RIGHT";
        else if (diffX === 1 && diffY === 0) return "RIGHT";
        else if (diffX === 1 && diffY === 1) return "BOTTOM_RIGHT";
        else if (diffX === 0 && diffY === 1) return "BOTTOM";
        else if (diffX === -1 && diffY === 1) return "BOTTOM_LEFT";
        else if (diffX === -1 && diffY === 0) return "LEFT";
        else if (diffX === -1 && diffY === -1) return "TOP_LEFT";
        return "";
    }
};

{
    const C3 = globalThis.C3;
    C3.Behaviors.EasystarTilemap = class EasystarTilemap extends globalThis.ISDKBehaviorBase {
        constructor() {
            super();
        }
    };
}