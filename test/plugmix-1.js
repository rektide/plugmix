var plugmix= require('../plugmix'),
  tape= require('tape')

tape('plugmix', function(t){
/*
	var mixes= plugmix(module, 'plugtest-'),
	  val
	do{
		val= mixes.next()
	}while(!val.done)
*/
	plugmix(module, 'plugtest', function(err,mixes){
		t.equal(mixes.length, 3, 'found three plugmixes')
		var o= {i: 0}
		for(var i in mixes){
			mixes[i](o)
		}
		t.equal(o.i, 3, 'all mixes mix in')
		t.end()
	})
})
