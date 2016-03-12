var automataApp = angular.module('automataApp', []);

Automaton = function() {
    this.state = false;
    this.toggle = function() {
        this.state = ! this.state;
    }
}

automataApp.controller('cellsController', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.gameSpeed = 10;
    $scope.cellSize=8;
    $scope.rows = 60;
    $scope.cols = 60;

    $scope.score = function(world, r, c) {
        var score = 0;
        for (v = -1; v <= 1; v++) { // adjacent rows
            for (h = -1; h <= 1; h++) { // adjacent columns
                if (v != 0 || h != 0) { // don't count this cell
                    var row = (r + v);
                    var col = (c + h);
                    if (row < 0) {
                        row = world.length - 1;
                    } else if (row == world.length) {
                        row = 0;
                    }
                    if (col < 0) {
                        col = world[row].length - 1;
                    } else if (col == world[row].length) {
                        col = 0;
                    }
                    score += world[row][col].state ? 1 : 0;
                }
            }
        }
        return score;
    }

    $scope.applyConwayRules = function(world) {
        var nextWorld = new Array();
        for (r = 0; r < world.length; r++) {
            nextWorld[r] = new Array();
            for (c = 0; c < world[r].length; c++) {
                var score = $scope.score(world, r, c);
                if (world[r][c].state) { // alive
                    if (score < 2) { // Rule 1, loneliness
                        nextWorld[r][c] = false;
                    } else if (score > 3) { // Rule 2, overcrowding
                        nextWorld[r][c] = false;
                    } else { // Rule 3, survival
                        nextWorld[r][c] = true;
                    }
                } else { // dead
                    if (score == 3) { // Rule 4, reproduction
                        nextWorld[r][c] = true;
                    } else { // remain dead
                        nextWorld[r][c] = false;
                    }
                }
            } 
        }
        for (r = 0; r < nextWorld.length; r++) {
            for (c = 0; c < nextWorld[r].length; c++) {
                world[r][c].state = nextWorld[r][c];
            }
        }
    }

    $scope.emptyWorld = function() {
        var world = new Array();
        for (r = 0; r<$scope.rows; r++) {
            world[r] = new Array();
            for (c = 0; c<$scope.cols; c++) {
                world[r][c] = new Automaton();
            }
        }
        return world;
    };

    $scope.resizeWorld = function() {
        var oldWorld = $scope.world;
        var newWorld = new Array();
        var newRow;
        for (r = 0; r<$scope.rows; r++) {
            newRow = new Array();
            for (c = 0; c<$scope.cols; c++) {
                if (r < oldWorld.length && c < oldWorld[r].length) {
                    newRow[c] = oldWorld[r][c];
                } else {
                    newRow[c] = new Automaton();
                }
            }
            newWorld.push(newRow);
        }
        $scope.world = newWorld;
    };

    $scope.clear = function() {
        $scope.world = $scope.emptyWorld();
    };

    $scope.updateWorld = function() {
        if ($scope.running) {
            $scope.applyConwayRules($scope.world);
        }
        $timeout($scope.updateWorld, 1000 / $scope.gameSpeed);
    };

    $scope.world = $scope.emptyWorld();
    $scope.updateWorld();
    $timeout(function() {Foundation.reInit('equalizer');}, 1000);
}]);