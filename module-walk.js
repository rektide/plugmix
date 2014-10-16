'use strict';

var co= require('co'),
  fs= require('co-fs'),
  glob= require('co-glob'),
  gather= require('co-gather'),
  path= require('path'),
  thunkify= require('thunkify-wrap')

var _readdir= function(dir){
	return function(cb){
		fs.readdir(dir, cb)
	}
}

var dir= function*dir(dirs){
	var got= dirs.map(_readdir)
	var matches= yield got
	var res= []
	for(var d in dirs){
		var dir= dirs[d],
		  match= matches[d]
		for(var m in match){
			res.push(dir+path.sep+match[m])
		}
	}
	return res
}

function startsWith(phrases){
	if(phrases instanceof Array)
		return (function*startsWith(exprs){
			EXPR: for(var i in exprs){
				var expr= exprs[i]
				for(var j in phrases){
					var phrase= phrases[j]
					if(expr.startsWith(phrase)){
						yield expr
						continue EXPR
					}
				}
			}
		})
	else
		return (function*startsWith(exprs){
			for(var i in exprs){
				var expr= exprs[i]
				if(expr.startsWith(phrases)){
					yield expr
				}
			}
		})
}

function contains(phrases){
	if(phrases.length)
		return (function*winnow(exprs){
			EXPR: for(var i in exprs){
				var expr= exprs[i]
				for(var j in phrases){
					var phrase= phrases[j]
					if(expr.contains(phrase)){
						yield expr
						continue EXPR
					}
				}
			}
		})
	else
		return (function*winnow(exprs){
			for(var i in exprs){
				var expr= exprs[i]
				if(expr.contains(phrases)){
					yield expr
				}
			}
		})
}

function*explode(filename){
	var prev= filename
	do{
		yield filename
		prev= filename
		filename= path.dirname(filename)
	}while(prev != filename)
}

function predicate(fn){
	return (function*predicate(exprs){
		if(!exprs.length)
			exprs= [exprs]
		for(var i in exprs){
			var expr= exprs[i]
			if(fn.call(this, expr)){
				yield expr
			}
		}
	})
}

function map(fn){
	return function*(iter){
		var val
		do{
			val= iter.next()
			var outp= fn.call(this, val.value)
		}while(!val.done)
	}
}

/// search from a given module up until it finds the first intersection with the main module
function*findPlugmixRoots(module){
	// recurse up module until we arrive back at a maindir
	var isMainDir= startsWith(require.main.paths),
	  moduleDir= path.dirname(module.filename)
	for(var dir of explode(moduleDir)){
		var iter= isMainDir([dir+'/node_modules']),
		  first= iter.next()
		yield dir
		if(first.value){
			break;
		}
	}
}

function *moduleWalk(module, prefix){
	var roots= []
	for(var root of findPlugmixRoots(module)){
		roots.push(root)
	}
	var files= yield dir(roots)
	return files.filter(function(name, i){
		var ok= path.basename(name).startsWith(prefix)
		return ok
	})
}

module.exports= co(moduleWalk)
module.exports.moduleWalk= module.exports
module.exports.dir= dir
module.exports.coDir= co(dir)
module.exports.startsWith= startsWith
module.exports.contains= contains
module.exports.findPlugmixRoots= findPlugmixRoots
