var co= require('co'),
  fs= require('co-fs'),
  glob= require('co-glob'),
  path= require('path')

function _readdir(dir){
	return fs.readdir(dir)
}

var dir= co(function*dir(dirs){
	var matches = yield dirs.map(_readdir)
	var res= []
	for(var d in dirs){
		var dir= dirs[d],
		  match= matches[d]
		for(var m in match){
			res.push(dir+path.sep+match[m])
		}
	}
	return res
})

function startsWith(phrases){
	if(phrases.length)
		return (function*winnow(exprs){
			EXPR: for(var expr of exprs)
				for(var phrase of phrases)
					if(expr.startsWith(phrase)){
						yield expr
						continue EXPR
					}
		})
	else
		return (function*winnow(exprs){
			for(var expr of exprs)
				if(expr.startsWith(phrases)){
					yield expr
					continue
				}
		})
}

function startsWith(phrases){
	if(phrases.length)
		return (function*winnow(exprs){
			EXPR: for(var expr of exprs)
				for(var phrase of phrases)
					if(expr.contains(phrase)){
						yield expr
						continue EXPR
					}
		})
	else
		return (function*winnow(exprs){
			for(var expr of exprs)
				if(expr.contains(phrases)){
					yield expr
					continue
				}
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
	var files= boundPaths(module.paths, mainPath)
	var dirs= yield dir(files)

	var prefix= prefix|| require('path').basename(module.id)
	var moduleMatches= yield startsWith(prefix)(dirs)
	return moduleMatches
}

module.export= find
module.exports.dir= dir
module.export.moduleWalk= find
