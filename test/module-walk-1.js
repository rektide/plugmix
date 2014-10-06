var co= require('co'),
  moduleWalk= require('../module-walk'),
  path= require('path'),
  tape= require('tape-harmony')

var fixture= require('./fixture').o1


tape('dir finds files', function(t){
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
