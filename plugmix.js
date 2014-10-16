var co= require('co'),
  events= require('events'),
  moduleWalk= require('./module-walk'),
  path= require('path')

function tries(module, mix){
	var plugmix
	try{
		var child= module+path.sep+mix,
		  mod= require(child)
		if(mod){
			plugmix= mix||module.exports.mix
			if(mod[plugmix]){
				return mod[plugmix]
			}else if(mod instanceof Function){
				return mod
			}
		}
	}catch(ex){}
	try{
		var mod= require(module)
		plugmix= plugmix||mix||module.exports.mix
		if(mod && mod[plugmix] instanceof Function){
			return mod[plugmix]
		}
	}catch(ex){}
}


function mix(module, prefix, done){
	moduleWalk(module, prefix, function(err, names){
		if(err){
			done(err)
			return
		}
		var res= []
		for(var modName in names){
			var name= names[modName]
			var mod = tries(name, prefix)
			if(!mod)
				continue
			res.push(mod)
		}
		done(undefined, res)
	})
}

module.exports= mix
module.exports.mix= 'plugmix'
