QUnit.module('loader', function() {


QUnit.test('flip x', function(assert) {
    var l = new lifesim({});
    var result=l.flipSeedX([[0,1,0],[1,1,0]]);
    assert.propEqual(result[0], [0,1,0], 'line 0');       
    assert.propEqual(result[1], [0,1,1], 'line 1');       
});

QUnit.test('flip y', function(assert) {
    var l = new lifesim({});
    var result=l.flipSeedY([[0,1,0],[1,1,0]]);
    assert.propEqual(result[0], [1,1,0], 'line 0');       
    assert.propEqual(result[1], [0,1,0], 'line 1');       
});

QUnit.test('rotate', function(assert) {
    var l = new lifesim({});
    var result=l.rotateSeedR([[0,1,0],[1,1,0]]);
    assert.propEqual(result[0], [1,0], 'line 0');       
    assert.propEqual(result[1], [1,1], 'line 1');       
    assert.propEqual(result[2], [0,0], 'line 2');       
});

QUnit.test('Load 3 by 3', function(assert) {
    var l = new lifesim({});
    var result=l.load(["x = 3, y = 3","3o$o$bo!"]);
    assert.equal(result.length, 3, 'height');
    assert.equal(result[0].length, 3, 'width');
    assert.propEqual(result[0], [1,1,1], 'line 0');       
    assert.propEqual(result[1], [1,0,0], 'line 1');       
    assert.propEqual(result[2], [0,1,0], 'line 2');       
});

QUnit.test('Load 16 by 11', function(assert) {
var data=["x = 16, y = 11, rule = B3/S23",
"bo12bo$bo12bo$obo10bobo$bo12bo$bo12bo$bbo3b4o3bo$6b4o$bb4o4b4o$$4bo6bo",
"$5boobboo!"]
    var l = new lifesim({});
    var result=l.load(data);
    assert.equal(result.length, 11, 'height');
    assert.equal(result[0].length, 16, 'width');    
});

QUnit.test('Load 16 by 11 one string', function(assert) {
    var data="x = 16, y = 11, rule = B3/S23\n"
    +"bo12bo$bo12bo$obo10bobo$bo12bo$bo12bo$bbo3b4o3bo$6b4o$bb4o4b4o$$4bo6bo\n"
    +"$5boobboo!";
    var l = new lifesim({});
    var result=l.load(data);
    assert.equal(result.length, 11, 'height');
    assert.equal(result[0].length, 16, 'width');    
});

QUnit.test('With comments', function(assert) {
    var data="#CA gun that fires a 3-engine Cordership every 690\n"
    + "x = 16, y = 11, rule = B3/S23\n"
    +"bo12bo$bo12bo$obo10bobo$bo12bo$bo12bo$bbo3b4o3bo$6b4o$bb4o4b4o$$4bo6bo\n"
    +"$5boobboo!";
    var l = new lifesim({});
    var result=l.load(data);
    assert.equal(result.length, 11, 'height');
    assert.equal(result[0].length, 16, 'width');    
});   
  
});
