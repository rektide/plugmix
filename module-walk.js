'use strict';

var co= require('co'),
  fs= require('co-fs'),
  glob= require('co-glob'),
  gather= require('co-gather'),
  path= require('path')

function _readdir(dir){
	return fs.readdir(dir)
}

var dir= co(function*dir(dirs){
	var matches= []
	var dirs2= []
	for(var i in dirs){
		var matcher= _readdir(dirs[i])
		if(matcher){
			matches.push(matcher)
			dirs2.push(dirs[i])
		}
	}
console.log('MATCHES1', matches)
	matches= yield matches
console.log('MATCHES2', matches)
	var res= []
	for(var d in dirs2){
		var dir= dirs2[d],
		  match= matches[d]
		for(var m in match){
			res.push(dir+path.sep+match[m])
		}
	}
	return res
})

function startsWith(phrases){
	if(phrases instanceof Array)
		return (function startsWith(exprs){
			var res= []
			EXPR: for(var i in exprs){
				var expr= exprs[i]
				for(var j in phrases){
					var phrase= phrases[j]
					if(expr.startsWith(phrase)){
						res.push(expr)
						continue EXPR
					}
				}
			}
			return res
		})
	else
		return (function startsWith(exprs){
			var res= []
			for(var i in exprs){
				var expr= exprs[i]
				if(expr.startsWith(phrases)){
					res.push(expr)
					continue
				}
			}
			return res
		})
}

function contains(phrases){
	if(phrases.length)
		return (function winnow(exprs){
			var res= []
			EXPR: for(var i in exprs){
				var expr= exprs[i]
				for(var j in phrases){
					var phrase= phrases[j]
					if(expr.contains(phrase)){
						res.push(expr)
						continue EXPR
					}
				}
			}
			return res
		})
	else
		return (function winnow(exprs){
			var res= []
			for(var i in exprs){
				var expr= exprs[i]
				if(expr.contains(phrases)){
					res.push(expr)
					continue
				}
			}
			return res
		})
}

function boundPaths(candidates, minimum, resolve){
	return candidates.filter(resolve?function(filename){
		var resolve= path.resolve(resolve, filename)
		return resolve.startsWith(minimum)
	}:function(filename){
		return filename.startsWith(minimum)
	})
}

function*find(module, prefix){
	var mainPath= require.main.paths[0],
	  moduleDir= path.dirname(module. filename)
console.log('paths', mainPath, moduleDir)
	var files= boundPaths(module.paths, mainPath)
console.log('files', files)
	var dirs= yield dir(files)
console.log('dirs', dirs)

	var prefix= prefix|| require('path').basename(module.id)
	var moduleMatches= startsWith(prefix)(dirs)
	return moduleMatches
}

module.exports= find
module.exports.dir= dir
module.exports.startsWith= startsWith
module.exports.contains= contains
module.exports.boundPaths= boundPaths
module.exports.moduleWalk= find
