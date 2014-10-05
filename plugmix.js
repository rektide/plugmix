var co= require('co'),
  mixes= require('./module-walk'),
  events= require('events'),
  path= require('path')

function tries(module, mix){
	try{
		var mod= require(module+path.sep+'plugmix')
		if(mod instanceof Function){
			return mod
		}else{
			var plugmix= mix|| module.exports.mix
			if(mod[plugmix]){
				return mod
			}
		}
	}catch(ex){}
	try{
		var mod= require(module),
		  plugmix= mix||module.exports.mix
		if(mod && mod[plugmix] instanceof Function){
			return mod.plugmix
		}
	}catch(ex){}
}

function req(modules){
	var val
	for(var mod of modules){
		if(mod.filename){
			return mod
		}else if(!!(val = tries(mod))){
			return val
		}
	}
}

function*mix(module, prefix, o){
	o= o|| module
	var module_names= yield require('./module-walk')(module, prefix)
	for(var modName in module_names){
		var mod = req(modName)
		if(!mod)
			continue
		mod(o)
		yield mod
	}
}

module.exports= co(mix)
module.exports.mix= 'plugmix'
