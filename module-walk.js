var co= require('co'),
  glob= require('co-glob'),
  path= require('path')

function*globSlot(o, slot){
	for(var p of o[slot]){
		yield co(p)
	}
}

function*dir(dirs){
	for(var dir of dirs){
		yield fs.readDir(dir)
	}
}

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

function*find(module, prefix){
	var mainPath= require.main.paths[0]
	var paths= yield globSlot( module, 'paths')
	var mainPaths= yield startsWith(mainPath)(paths)
	var dirs= yield dir(paths)

	var prefix= prefix|| require('path').basename(module.id)
	var moduleMatches= yield startsWith(prefix)(dirs)
	return moduleMatches
}

module.export= find
module.export.moduleWalk= find
