var co= require('co'),
  moduleWalk= require('../module-walk'),
  path= require('path'),
  tape= require('tape'),
  cotape= require('co-tape')

var fixture= require('./fixture').o1

// utility tests

tape('module-walk: dir finds files', function(t){
	var testdir= path.dirname(module.filename),
	  topdir= path.dirname(testdir),
	  expect= ['./fixture.js', './module-walk-1.js', '../package.json', '../plugmix.js']
	    .map(function(i){
	      	return path.resolve(testdir, i)
	    })

	var dir = moduleWalk.dir([testdir, topdir], function(err, files){
		t.plan(expect.length)
		for(var i in expect){
			var expected= expect[i]
			t.ok(~files.indexOf(expected), 'found file '+expected)
		}
	})
})

tape('module-walk: startsWith', function(t){
	t.plan(2)
	var tries= ['foo', 'fooa', ' foo', ' fooa', 'bfoo', 'foob', 'nap', 'nak'],
	  okFoo= ['foo', 'fooa', 'foob'],
	  more= ['fooa', 'nope', 'na'],
	  okMore= ['fooa', 'nap', 'nak']
	var triedFoo= moduleWalk.startsWith('foo')(tries)
	t.deepEqual(triedFoo, okFoo, 'startsWith works with a single phrase')
	var triedMore= moduleWalk.startsWith(more)(tries)
	t.deepEqual(triedMore, okMore, 'startsWith works with multiple phrases')
})

tape('module-walk: boundPaths', function(t){
	t.end()
})

tape('module-walk', cotape(function*(t){
	t.end()
	//var found= yield moduleWalk(module, 'plugmix')
}))
