var co= require('co'),
  moduleWalk= require('../module-walk'),
  path= require('path'),
  tape= require('tape'),
  cotape= require('co-tape')

var fixture= require('./fixture').o1

// utility tests
var testdir= path.dirname(module.filename),
  topdir= path.dirname(testdir)


tape('module-walk: dir finds files', function(t){
	var expect= ['./fixture.js', './module-walk-1.js', '../package.json', '../plugmix.js']
	    .map(function(i){
	      	return path.resolve(testdir, i)
	    })

	var dir = moduleWalk.coDir([testdir, topdir], function(err, files){
		t.plan(expect.length)
		for(var i in expect){
			var expected= expect[i]
			t.ok(~files.indexOf(expected), 'found file '+expected)
		}
	})
})

tape('module-walk: startsWith', function(t){
	t.plan(6)
	var tries= ['foo', 'fooa', ' foo', ' fooa', 'bfoo', 'foob', 'nap', 'nak'],
	  okFoo= ['foo', 'fooa', 'foob'],
	  more= ['fooa', 'nope', 'na'],
	  okMore= ['fooa', 'nap', 'nak']
	var triedFoo= moduleWalk.startsWith('foo')(tries)
	equalIter(t, triedFoo, okFoo, 'startsWith works with a single phrase')
	var triedMore= moduleWalk.startsWith(more)(tries)
	equalIter(t, triedMore, okMore, 'startsWith works with multiple phrases')
})

tape('module-walk: findPlugmixRoots', cotape(function*(t){
	var found= moduleWalk.findPlugmixRoots(module)
	t.equal(found.next().value, testdir, 'walks test dir')
	t.equal(found.next().value, path.dirname(testdir), 'walks top dir')
	var last= found.next()
	t.equal(last.value, undefined, 'walk only has two entries')
	t.equal(last.done, true, 'walk completes')
	t.end()
}))


tape('module-walk', function(t){
	moduleWalk(module, 'plugtest-', function(err,val){
		var expect= ['1.js', 'alpha', 'bar'].map(function(i){
			return testdir+path.sep+"plugtest-"+i
		})
		t.deepEquals(val, expect, 'finds three plugmixes')
		t.end()
	})
})

function equalIter(t, iter, expects, desc){
	var i= 0
	for(var o of iter){
		t.deepEqual(o, expects[i++], desc)
	}
}
