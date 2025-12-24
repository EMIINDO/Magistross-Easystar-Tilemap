globalThis.erenf = {
    fillGridFromTilemap(grid, host) {
        // SDK v2: Detect whether 'host' is a Scripting Interface or SDK Instance
        const sdkInst = host.GetSdkInstance ? host.GetSdkInstance() : host;
        
        if (!sdkInst) return;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                // Use PascalCase for Tilemap internal methods
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
        if (diffX === 0 && diffY === -1) return EasyStar["TOP"];
        else if (diffX === 1 && diffY === -1) return EasyStar["TOP_RIGHT"];
        else if (diffX === 1 && diffY === 0) return EasyStar["RIGHT"];
        else if (diffX === 1 && diffY === 1) return EasyStar["BOTTOM_RIGHT"];
        else if (diffX === 0 && diffY === 1) return EasyStar["BOTTOM"];
        else if (diffX === -1 && diffY === 1) return EasyStar["BOTTOM_LEFT"];
        else if (diffX === -1 && diffY === 0) return EasyStar["LEFT"];
        else if (diffX === -1 && diffY === -1) return EasyStar["TOP_LEFT"];
        throw new Error('Invalid direction diffs: ' + diffX + ', ' + diffY);
    }
};

"use strict";
{
    const C3 = globalThis.C3;
    C3.Behaviors.EasystarTilemap = class EasystarTilemap extends globalThis.ISDKBehaviorBase {
        constructor() {
            super();
        }
    };
}