"use strict";

globalThis.EasyStar =
/******/ (function (modules) { // webpackBootstrap
/******/ 	var installedModules = {};
/******/ 	function __webpack_require__(moduleId) {
/******/ 		if (installedModules[moduleId]) return installedModules[moduleId].exports;
/******/ 		var module = installedModules[moduleId] = { exports: {}, id: moduleId, loaded: false };
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 		module.loaded = true;
/******/ 		return module.exports;
            /******/
}
/******/ 	__webpack_require__.m = modules;
/******/ 	__webpack_require__.c = installedModules;
/******/ 	__webpack_require__.p = "";
/******/ 	return __webpack_require__(0);
        /******/
})
        ([
/* 0 */
/***/ function (module, exports, __webpack_require__) {
                var EasyStar = {};
                var Instance = __webpack_require__(1);
                var Node = __webpack_require__(2);
                var Heap = __webpack_require__(3);
                const CLOSED_LIST = 0;
                const OPEN_LIST = 1;
                module.exports = EasyStar;
                var nextInstanceId = 1;
                EasyStar.js = function () {
                    var STRAIGHT_COST = 1.0;
                    var DIAGONAL_COST = 1.4;
                    var syncEnabled = false;
                    var pointsToAvoid = {};
                    var collisionGrid;
                    var costMap = {};
                    var pointsToCost = {};
                    var directionalConditions = {};
                    var allowCornerCutting = true;
                    var iterationsSoFar;
                    var instances = {};
                    var instanceQueue = [];
                    var iterationsPerCalculation = Number.MAX_VALUE;
                    var acceptableTiles;
                    var diagonalsEnabled = false;
                    this.clearInstanceList = function () { instances.length = 0; };
                    this.getAcceptableTiles = function () { return acceptableTiles; };
                    this.getDiagonalsEnabled = function () { return diagonalsEnabled; };
                    this.getCostMap = function () { return costMap; };
                    this.setCostMap = function (map) { costMap = map; };
                    this.getPointsToAvoid = function () { return pointsToAvoid; };
                    this.setPointsToAvoid = function (pts) { pointsToAvoid = pts; };
                    this.getPointsToCost = function () { return pointsToCost; };
                    this.setPointsToCost = function (pts) { pointsToCost = pts; };
                    this.getAllowCornerCutting = function () { return allowCornerCutting; };
                    this.getDirectionalConditions = function () { return directionalConditions; };
                    this.setDirectionalConditions = function (conditions) { directionalConditions = conditions; };
                    this.getGrid = function () { return collisionGrid; };
                    this.setAcceptableTiles = function (tiles) {
                        if (tiles instanceof Array) acceptableTiles = tiles;
                        else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) acceptableTiles = [tiles];
                    };
                    this.enableSync = function () { syncEnabled = true; };
                    this.disableSync = function () { syncEnabled = false; };
                    this.enableDiagonals = function () { diagonalsEnabled = true; };
                    this.disableDiagonals = function () { diagonalsEnabled = false; };
                    this.setGrid = function (grid) {
                        collisionGrid = grid;
                        for (var y = 0; y < collisionGrid.length; y++) {
                            for (var x = 0; x < collisionGrid[0].length; x++) {
                                if (!costMap[collisionGrid[y][x]]) costMap[collisionGrid[y][x]] = 1;
                            }
                        }
                    };
                    this.setTileCost = function (tileType, cost) { costMap[tileType] = cost; };
                    this.setAdditionalPointCost = function (x, y, cost) {
                        if (pointsToCost[y] === undefined) pointsToCost[y] = {};
                        pointsToCost[y][x] = cost;
                    };
                    this.removeAdditionalPointCost = function (x, y) {
                        if (pointsToCost[y] !== undefined) delete pointsToCost[y][x];
                    };
                    this.removeAllAdditionalPointCosts = function () { pointsToCost = {}; };
                    this.setDirectionalCondition = function (x, y, allowedDirections) {
                        if (directionalConditions[y] === undefined) directionalConditions[y] = {};
                        directionalConditions[y][x] = allowedDirections;
                    };
                    this.removeAllDirectionalConditions = function () { directionalConditions = {}; };
                    this.setIterationsPerCalculation = function (iterations) { iterationsPerCalculation = iterations; };
                    this.avoidAdditionalPoint = function (x, y) {
                        if (pointsToAvoid[y] === undefined) pointsToAvoid[y] = {};
                        pointsToAvoid[y][x] = 1;
                    };
                    this.stopAvoidingAdditionalPoint = function (x, y) {
                        if (pointsToAvoid[y] !== undefined) delete pointsToAvoid[y][x];
                    };
                    this.enableCornerCutting = function () { allowCornerCutting = true; };
                    this.disableCornerCutting = function () { allowCornerCutting = false; };
                    this.stopAvoidingAllAdditionalPoints = function () { pointsToAvoid = {}; };
                    this.findPath = function (startX, startY, endX, endY, callback) {
                        var callbackWrapper = function (result) {
                            if (syncEnabled) callback(result);
                            else setTimeout(function () { callback(result); });
                        };
                        if (acceptableTiles === undefined) throw new Error("setAcceptableTiles() required.");
                        if (collisionGrid === undefined) throw new Error("setGrid() required.");
                        if (startX < 0 || startY < 0 || endX < 0 || endY < 0 || startX > collisionGrid[0].length - 1 || startY > collisionGrid.length - 1 || endX > collisionGrid[0].length - 1 || endY > collisionGrid.length - 1) throw new Error("Outside grid.");
                        if (startX === endX && startY === endY) { callbackWrapper([]); return; }
                        var endTile = collisionGrid[endY][endX];
                        var isAcceptable = false;
                        for (var i = 0; i < acceptableTiles.length; i++) {
                            if (endTile === acceptableTiles[i]) { isAcceptable = true; break; }
                        }
                        if (isAcceptable === false) { callbackWrapper(null); return; }
                        var instance = new Instance();
                        instance.openList = new Heap(function (nodeA, nodeB) { return nodeA.bestGuessDistance() - nodeB.bestGuessDistance(); });
                        instance.isDoneCalculating = false;
                        instance.nodeHash = {};
                        instance.startX = startX; instance.startY = startY; instance.endX = endX; instance.endY = endY;
                        instance.callback = callbackWrapper;
                        instance.openList.push(coordinateToNode(instance, instance.startX, instance.startY, null, STRAIGHT_COST));
                        var instanceId = nextInstanceId++;
                        instances[instanceId] = instance;
                        instanceQueue.push(instanceId);
                        return instanceId;
                    };
                    this.cancelPath = function (instanceId) {
                        if (instanceId in instances) { delete instances[instanceId]; return true; }
                        return false;
                    };
                    this.calculate = function () {
                        if (instanceQueue.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) return;
                        for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
                            if (instanceQueue.length === 0) return;
                            if (syncEnabled) iterationsSoFar = 0;
                            var instanceId = instanceQueue[0];
                            var instance = instances[instanceId];
                            if (typeof instance == 'undefined') { instanceQueue.shift(); continue; }
                            if (instance.openList.size() === 0) { instance.callback(null); delete instances[instanceId]; instanceQueue.shift(); continue; }
                            var searchNode = instance.openList.pop();
                            if (instance.endX === searchNode.x && instance.endY === searchNode.y) {
                                var path = [];
                                path.push({ x: searchNode.x, y: searchNode.y, cost: searchNode.costSoFar });
                                var parent = searchNode.parent;
                                while (parent != null) {
                                    path.push({ x: parent.x, y: parent.y, cost: parent.costSoFar });
                                    parent = parent.parent;
                                }
                                path.reverse();
                                instance.callback(path);
                                delete instances[instanceId];
                                instanceQueue.shift();
                                continue;
                            }
                            searchNode.list = CLOSED_LIST;
                            if (searchNode.y > 0) checkAdjacentNode(instance, searchNode, 0, -1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y - 1));
                            if (searchNode.x < collisionGrid[0].length - 1) checkAdjacentNode(instance, searchNode, 1, 0, STRAIGHT_COST * getTileCost(searchNode.x + 1, searchNode.y));
                            if (searchNode.y < collisionGrid.length - 1) checkAdjacentNode(instance, searchNode, 0, 1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y + 1));
                            if (searchNode.x > 0) checkAdjacentNode(instance, searchNode, -1, 0, STRAIGHT_COST * getTileCost(searchNode.x - 1, searchNode.y));
                            if (diagonalsEnabled) {
                                if (searchNode.x > 0 && searchNode.y > 0) {
                                    if (allowCornerCutting || isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y - 1, searchNode) && isTileWalkable(collisionGrid, acceptableTiles, searchNode.x - 1, searchNode.y, searchNode)) checkAdjacentNode(instance, searchNode, -1, -1, DIAGONAL_COST * getTileCost(searchNode.x - 1, searchNode.y - 1));
                                }
                                if (searchNode.x < collisionGrid[0].length - 1 && searchNode.y < collisionGrid.length - 1) {
                                    if (allowCornerCutting || isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y + 1, searchNode) && isTileWalkable(collisionGrid, acceptableTiles, searchNode.x + 1, searchNode.y, searchNode)) checkAdjacentNode(instance, searchNode, 1, 1, DIAGONAL_COST * getTileCost(searchNode.x + 1, searchNode.y + 1));
                                }
                                if (searchNode.x < collisionGrid[0].length - 1 && searchNode.y > 0) {
                                    if (allowCornerCutting || isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y - 1, searchNode) && isTileWalkable(collisionGrid, acceptableTiles, searchNode.x + 1, searchNode.y, searchNode)) checkAdjacentNode(instance, searchNode, 1, -1, DIAGONAL_COST * getTileCost(searchNode.x + 1, searchNode.y - 1));
                                }
                                if (searchNode.x > 0 && searchNode.y < collisionGrid.length - 1) {
                                    if (allowCornerCutting || isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y + 1, searchNode) && isTileWalkable(collisionGrid, acceptableTiles, searchNode.x - 1, searchNode.y, searchNode)) checkAdjacentNode(instance, searchNode, -1, 1, DIAGONAL_COST * getTileCost(searchNode.x - 1, searchNode.y + 1));
                                }
                            }
                        }
                    };
                    var checkAdjacentNode = function (instance, searchNode, x, y, cost) {
                        var adjacentCoordinateX = searchNode.x + x;
                        var adjacentCoordinateY = searchNode.y + y;
                        if ((pointsToAvoid[adjacentCoordinateY] === undefined || pointsToAvoid[adjacentCoordinateY][adjacentCoordinateX] === undefined) && isTileWalkable(collisionGrid, acceptableTiles, adjacentCoordinateX, adjacentCoordinateY, searchNode)) {
                            var node = coordinateToNode(instance, adjacentCoordinateX, adjacentCoordinateY, searchNode, cost);
                            if (node.list === undefined) { node.list = OPEN_LIST; instance.openList.push(node); }
                            else if (searchNode.costSoFar + cost < node.costSoFar) { node.costSoFar = searchNode.costSoFar + cost; node.parent = searchNode; instance.openList.updateItem(node); }
                        }
                    };
                    var isTileWalkable = function (collisionGrid, acceptableTiles, x, y, sourceNode) {
                        var directionalCondition = directionalConditions[y] && directionalConditions[y][x];
                        if (directionalCondition) {
                            var direction = calculateDirection(sourceNode.x - x, sourceNode.y - y);
                            var directionIncluded = function () {
                                for (var i = 0; i < directionalCondition.length; i++) { if (directionalCondition[i] === direction) return true; }
                                return false;
                            };
                            if (!directionIncluded()) return false;
                        }
                        for (var i = 0; i < acceptableTiles.length; i++) { if (collisionGrid[y][x] === acceptableTiles[i]) return true; }
                        return false;
                    };
                    var calculateDirection = function (diffX, diffY) {
                        if (diffX === 0 && diffY === -1) return EasyStar.TOP; else if (diffX === 1 && diffY === -1) return EasyStar.TOP_RIGHT; else if (diffX === 1 && diffY === 0) return EasyStar.RIGHT; else if (diffX === 1 && diffY === 1) return EasyStar.BOTTOM_RIGHT; else if (diffX === 0 && diffY === 1) return EasyStar.BOTTOM; else if (diffX === -1 && diffY === 1) return EasyStar.BOTTOM_LEFT; else if (diffX === -1 && diffY === 0) return EasyStar.LEFT; else if (diffX === -1 && diffY === -1) return EasyStar.TOP_LEFT;
                        throw new Error('Invalid differences: ' + diffX + ', ' + diffY);
                    };
                    var getTileCost = function (x, y) { return pointsToCost[y] && pointsToCost[y][x] || costMap[collisionGrid[y][x]]; };
                    var coordinateToNode = function (instance, x, y, parent, cost) {
                        if (instance.nodeHash[y] !== undefined) { if (instance.nodeHash[y][x] !== undefined) return instance.nodeHash[y][x]; }
                        else instance.nodeHash[y] = {};
                        var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
                        var costSoFar = (parent !== null) ? parent.costSoFar + cost : 0;
                        var node = new Node(parent, x, y, costSoFar, simpleDistanceToTarget);
                        instance.nodeHash[y][x] = node;
                        return node;
                    };
                    var getDistance = function (x1, y1, x2, y2) {
                        if (diagonalsEnabled) {
                            var dx = Math.abs(x1 - x2); var dy = Math.abs(y1 - y2);
                            return (dx < dy) ? DIAGONAL_COST * dx + dy : DIAGONAL_COST * dy + dx;
                        } else {
                            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
                        }
                    };
                };
                EasyStar.TOP = 'TOP'; EasyStar.TOP_RIGHT = 'TOP_RIGHT'; EasyStar.RIGHT = 'RIGHT'; EasyStar.BOTTOM_RIGHT = 'BOTTOM_RIGHT'; EasyStar.BOTTOM = 'BOTTOM'; EasyStar.BOTTOM_LEFT = 'BOTTOM_LEFT'; EasyStar.LEFT = 'LEFT'; EasyStar.TOP_LEFT = 'TOP_LEFT';
                /***/
},
/* 1 */
/***/ function (module, exports) {
                module.exports = function () {
                    this.pointsToAvoid = {}; this.startX; this.callback; this.startY; this.endX; this.endY; this.nodeHash = {}; this.openList;
                };
                /***/
},
/* 2 */
/***/ function (module, exports) {
                module.exports = function (parent, x, y, costSoFar, simpleDistanceToTarget) {
                    this.parent = parent; this.x = x; this.y = y; this.costSoFar = costSoFar; this.simpleDistanceToTarget = simpleDistanceToTarget;
                    this.bestGuessDistance = function () { return this.costSoFar + this.simpleDistanceToTarget; };
                };
                /***/
},
/* 3 */
/***/ function (module, exports, __webpack_require__) {
                module.exports = __webpack_require__(4);
                /***/
},
/* 4 */
/***/ function (module, exports, __webpack_require__) {
                var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;
                floor = Math.floor, min = Math.min;
                defaultCmp = function (x, y) { if (x < y) return -1; if (x > y) return 1; return 0; };
                insort = function (a, x, lo, hi, cmp) {
                    var mid; if (lo == null) lo = 0; if (cmp == null) cmp = defaultCmp;
                    if (lo < 0) throw new Error('lo must be non-negative');
                    if (hi == null) hi = a.length;
                    while (lo < hi) { mid = floor((lo + hi) / 2); if (cmp(x, a[mid]) < 0) hi = mid; else lo = mid + 1; }
                    return [].splice.apply(a, [lo, lo - lo].concat(x)), x;
                };
                heappush = function (array, item, cmp) { if (cmp == null) cmp = defaultCmp; array.push(item); return _siftdown(array, 0, array.length - 1, cmp); };
                heappop = function (array, cmp) {
                    var lastelt, returnitem; if (cmp == null) cmp = defaultCmp;
                    lastelt = array.pop();
                    if (array.length) { returnitem = array[0]; array[0] = lastelt; _siftup(array, 0, cmp); } else returnitem = lastelt;
                    return returnitem;
                };
                heapreplace = function (array, item, cmp) {
                    var returnitem; if (cmp == null) cmp = defaultCmp;
                    returnitem = array[0]; array[0] = item; _siftup(array, 0, cmp); return returnitem;
                };
                heappushpop = function (array, item, cmp) {
                    var _ref; if (cmp == null) cmp = defaultCmp;
                    if (array.length && cmp(array[0], item) < 0) { _ref = [array[0], item], item = _ref[0], array[0] = _ref[1]; _siftup(array, 0, cmp); }
                    return item;
                };
                heapify = function (array, cmp) {
                    var i, _i, _j, _len, _ref, _ref1, _results, _results1; if (cmp == null) cmp = defaultCmp;
                    _ref1 = function () { _results1 = []; for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--) { _results1.push(_j); } return _results1; }.apply(this).reverse();
                    _results = []; for (_i = 0, _len = _ref1.length; _i < _len; _i++) { i = _ref1[_i]; _results.push(_siftup(array, i, cmp)); }
                    return _results;
                };
                updateItem = function (array, item, cmp) {
                    var pos; if (cmp == null) cmp = defaultCmp; pos = array.indexOf(item); if (pos === -1) return;
                    _siftdown(array, 0, pos, cmp); return _siftup(array, pos, cmp);
                };
                nlargest = function (array, n, cmp) {
                    var elem, result, _i, _len, _ref; if (cmp == null) cmp = defaultCmp;
                    result = array.slice(0, n); if (!result.length) return result;
                    heapify(result, cmp); _ref = array.slice(n);
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) { elem = _ref[_i]; heappushpop(result, elem, cmp); }
                    return result.sort(cmp).reverse();
                };
                nsmallest = function (array, n, cmp) {
                    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
                    if (cmp == null) cmp = defaultCmp;
                    if (n * 10 <= array.length) {
                        result = array.slice(0, n).sort(cmp); if (!result.length) return result;
                        los = result[result.length - 1]; _ref = array.slice(n);
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) { elem = _ref[_i]; if (cmp(elem, los) < 0) { insort(result, elem, 0, null, cmp); result.pop(); los = result[result.length - 1]; } }
                        return result;
                    }
                    heapify(array, cmp); _results = [];
                    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) { _results.push(heappop(array, cmp)); }
                    return _results;
                };
                _siftdown = function (array, startpos, pos, cmp) {
                    var newitem, parent, parentpos; if (cmp == null) cmp = defaultCmp;
                    newitem = array[pos];
                    while (pos > startpos) {
                        parentpos = pos - 1 >> 1; parent = array[parentpos];
                        if (cmp(newitem, parent) < 0) { array[pos] = parent; pos = parentpos; continue; }
                        break;
                    }
                    return array[pos] = newitem;
                };
                _siftup = function (array, pos, cmp) {
                    var childpos, endpos, newitem, rightpos, startpos; if (cmp == null) cmp = defaultCmp;
                    endpos = array.length; startpos = pos; newitem = array[pos]; childpos = 2 * pos + 1;
                    while (childpos < endpos) {
                        rightpos = childpos + 1;
                        if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) childpos = rightpos;
                        array[pos] = array[childpos]; pos = childpos; childpos = 2 * pos + 1;
                    }
                    array[pos] = newitem; return _siftdown(array, startpos, pos, cmp);
                };
                Heap = function () {
                    Heap.push = heappush; Heap.pop = heappop; Heap.replace = heapreplace; Heap.pushpop = heappushpop;
                    Heap.heapify = heapify; Heap.updateItem = updateItem; Heap.nlargest = nlargest; Heap.nsmallest = nsmallest;
                    function Heap(cmp) { this.cmp = cmp != null ? cmp : defaultCmp; this.nodes = []; }
                    Heap.prototype.push = function (x) { return heappush(this.nodes, x, this.cmp); };
                    Heap.prototype.pop = function () { return heappop(this.nodes, this.cmp); };
                    Heap.prototype.peek = function () { return this.nodes[0]; };
                    Heap.prototype.contains = function (x) { return this.nodes.indexOf(x) !== -1; };
                    Heap.prototype.replace = function (x) { return heapreplace(this.nodes, x, this.cmp); };
                    Heap.prototype.pushpop = function (x) { return heappushpop(this.nodes, x, this.cmp); };
                    Heap.prototype.heapify = function () { return heapify(this.nodes, this.cmp); };
                    Heap.prototype.updateItem = function (x) { return updateItem(this.nodes, x, this.cmp); };
                    Heap.prototype.clear = function () { return this.nodes = []; };
                    Heap.prototype.empty = function () { return this.nodes.length === 0; };
                    Heap.prototype.size = function () { return this.nodes.length; };
                    Heap.prototype.clone = function () { var heap = new Heap(); heap.nodes = this.nodes.slice(0); return heap; };
                    Heap.prototype.toArray = function () { return this.nodes.slice(0); };
                    Heap.prototype.insert = Heap.prototype.push; Heap.prototype.top = Heap.prototype.peek;
                    Heap.prototype.front = Heap.prototype.peek; Heap.prototype.has = Heap.prototype.contains; Heap.prototype.copy = Heap.prototype.clone;
                    return Heap;
                }();
                (function (root, factory) {
                    if (true) module.exports = factory();
                    else root.Heap = factory();
                })(this, function () { return Heap; });
                /***/
}
        ]);

{
    const C3 = globalThis.C3;

    C3.Behaviors.EasystarTilemap.Instance = class EasystarTilemapInstance extends globalThis.ISDKBehaviorInstanceBase {
        constructor() {
            super();

            this._isInitialized = false;
            this.easystarjs = new globalThis["EasyStar"]["js"]();
            this.paths = {};
            this.curTag = "";
            this.baseSetTileAt = null;
            this.emptyWalkable = false;

            const properties = this._getInitProperties(); //
            if (properties) {
                if (properties[0] === 0) this.easystarjs["enableDiagonals"]();
                else this.easystarjs["disableDiagonals"]();

                if (properties[1] < 0) this.easystarjs["setIterationsPerCalculation"](Number.MAX_VALUE);
                else this.easystarjs["setIterationsPerCalculation"](properties[1]);

                this.emptyWalkable = (properties[2] === 0);
                if (properties[3] === 0) this.easystarjs["enableCornerCutting"]();
                else this.easystarjs["disableCornerCutting"]();
                if (properties[4] === 0) this.easystarjs["disableSync"]();
                else this.easystarjs["enableSync"]();
            }

            let arr = [];
            if (this.emptyWalkable) arr.push(-1 & 0x1FFFFFFF);
            this.easystarjs["setAcceptableTiles"](arr);

            this._setTicking(true); // Enable SDK v2 ticking system
        }

        _initRuntimeHook() {
            if (this._isInitialized) return;

            // In SDK v2 Behavior, this._inst refers directly to the SDK Instance of the host object (Tilemap)
            const sdkInst = this._inst;

            // Make sure the host object is ready and has the necessary Tilemap methods.
            if (!sdkInst || typeof sdkInst.GetMapHeight !== "function") return;

            // Keep the original SetTileAt function from the internal SDK (PascalCase)
            this.baseSetTileAt = sdkInst.SetTileAt;

            const mapHeight = sdkInst.GetMapHeight();
            const mapWidth = sdkInst.GetMapWidth();
            const tilegrid = globalThis.erenf.createArray(mapHeight, mapWidth);

            // Overrides are done at the SDK level to keep it in sync with the engine.
            sdkInst.SetTileAt = (x_, y_, t_) => {
                x_ = Math.floor(x_);
                y_ = Math.floor(y_);
                if (x_ < 0 || y_ < 0 || x_ >= mapWidth || y_ >= mapHeight) return -1;

                tilegrid[y_][x_] = t_ & 0x1FFFFFFF;
                // Call the native function using context sdkInst
                this.baseSetTileAt.call(sdkInst, x_, y_, t_);
            };

            // Use the helper by passing sdkInst directly
            globalThis.erenf.fillGridFromTilemap(tilegrid, sdkInst);
            this.easystarjs["setGrid"](tilegrid);

            this._isInitialized = true;
        }

        _tick() {
            if (!this._isInitialized) {
                this._initRuntimeHook();
                return;
            }

            if (!this.easystarjs) return;

            const sdkInst = this._inst;
            const currentGrid = this.easystarjs["getGrid"]();

            // Ensure grid synchronization using internal PascalCase methods
            if (sdkInst && sdkInst.GetMapHeight && (!currentGrid || currentGrid.length !== sdkInst.GetMapHeight() || currentGrid[0].length !== sdkInst.GetMapWidth())) {
                const tilegrid = globalThis.erenf.createArray(sdkInst.GetMapHeight(), sdkInst.GetMapWidth());
                globalThis.erenf.fillGridFromTilemap(tilegrid, sdkInst);
                this.easystarjs["setGrid"](tilegrid);
            }

            this.easystarjs["calculate"]();
        }

        doPathingRequest(tag_, x_, y_, x2_, y2_) {
            const sdkInst = this._inst;
            if (!this._isInitialized) this._initRuntimeHook();

            const notFound = () => {
                this.curTag = tag_;
                delete this.paths[tag_];
                this._trigger(C3.Behaviors.EasystarTilemap.Cnds.OnFailedToFindPath); //
                this._trigger(C3.Behaviors.EasystarTilemap.Cnds.OnAnyPathNotFound);
            };
            const found = (path) => {
                this.curTag = tag_;
                this.paths[tag_] = path;
                this._trigger(C3.Behaviors.EasystarTilemap.Cnds.OnPathFound);
                this._trigger(C3.Behaviors.EasystarTilemap.Cnds.OnAnyPathFound);
            };

            // Use internal PascalCase methods for boundary validation
            if (sdkInst && sdkInst.GetMapWidth && (x_ < 0 || y_ < 0 || x2_ < 0 || y2_ < 0 ||
                x_ >= sdkInst.GetMapWidth() || x2_ >= sdkInst.GetMapWidth() ||
                y_ >= sdkInst.GetMapHeight() || y2_ >= sdkInst.GetMapHeight())) {
                notFound();
            } else {
                this.easystarjs["findPath"](x_, y_, x2_, y2_, (path) => {
                    if (path === null) notFound(); else found(path);
                });
            }
        }

        _release() {
            const sdkInst = this._inst || (this.instance ? this.instance.getSdkInstance() : null);
            if (this._isInitialized && sdkInst) {
                sdkInst.SetTileAt = this.baseSetTileAt;
            }
            this.paths = {};
            super._release(); //
        }

     
        

        // The save/load method remains the same following the SDK v2 standard.
        _saveToJson() {
            return {
                "paths": this.paths,
                "acceptableTiles": this.easystarjs["getAcceptableTiles"](),
                "costMap": this.easystarjs["getCostMap"](),
                "pointsToAvoid": this.easystarjs["getPointsToAvoid"](),
                "diagonalsEnabled": this.easystarjs["getDiagonalsEnabled"](),
                "emptyWalkable": this.emptyWalkable,
                "cornerCuttingEnabled": this.easystarjs["getAllowCornerCutting"](),
                "pointsToCost": this.easystarjs["getPointsToCost"](),
                "directionalConditions": this.easystarjs["getDirectionalConditions"]()
            };
        }

        _loadFromJson(o) {
            this.paths = o["paths"];
            this.emptyWalkable = o["emptyWalkable"];
            if (!this._isInitialized) this._initRuntimeHook();
            this.easystarjs["setAcceptableTiles"](o["acceptableTiles"]);
            this.easystarjs["setCostMap"](o["costMap"]);
            this.easystarjs["setPointsToAvoid"](o["pointsToAvoid"]);
            if (o["diagonalsEnabled"]) this.easystarjs["enableDiagonals"](); else this.easystarjs["disableDiagonals"]();
            if (o["cornerCuttingEnabled"]) this.easystarjs["enableCornerCutting"](); else this.easystarjs["disableCornerCutting"]();
            this.easystarjs["setPointsToCost"](o["pointsToCost"]);
            this.easystarjs["setDirectionalConditions"](o["directionalConditions"]);
        }

        isTileWalkable(x, y, sourceX, sourceY) {
            const collisionGrid = this.easystarjs["getGrid"]();
            const acceptableTiles = this.easystarjs["getAcceptableTiles"]();
            const pointsToAvoid = this.easystarjs["getPointsToAvoid"]();
            if (!acceptableTiles || !collisionGrid || x < 0 || y < 0 || x > collisionGrid[0].length - 1 || y > collisionGrid.length - 1) return false;
            if (sourceX !== undefined && sourceY !== undefined) {
                if (Math.abs(sourceX - x) > 1 || Math.abs(sourceY - y) > 1) return false;
                const condition = this.easystarjs["getDirectionalConditions"]()?.[y]?.[x];
                if (condition) {
                    const direction = globalThis.erenf.calculateDirection(sourceX - x, sourceY - y);
                    if (!condition.includes(direction)) return false;
                }
            }
            if (pointsToAvoid[y]?.[x] === undefined) {
                return acceptableTiles.includes(collisionGrid[y][x]);
            }
            return false;
        }
    };
}