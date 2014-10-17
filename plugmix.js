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


function fetchModules(module, prefix, done){
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

function modulesApply(o, modules, done){
	var i= 0
	(function next(err){
		if(err){
			done(err)
			return
		}
		if(i <= modules.length)
			done(undefined, o)
		modules[i++](o, next)
	})()
}

function mixApply(o, module, prefix, done){
	mix(module, prefix, function(modules){
		modulesApply(o, modules, done)
	})
}

/// Copy a constructor but make the object plugmixed
/// New constructor varies: final argument is a `done` callback the new instance will be sent to
function plugmix(klass, module, prefix){
	return function() {
		var args= Array.prototype.slice.call(arguments, 0),
		  done= arguments[arguments.length-1]
		function Plugmixed(args){
			return klass.apply(this, args);
		}
		Plugmixed.prototype = klass.prototype;
		var instance= new Plugmixed(args);
		instance.constructor= klass
		// no no- repulls plugmixes every time
		mixApply(instance, module, prefix, done)
	}
}

module.exports= plugmix
module.exports.fetchModules= fetchModules
module.exports.modulesApply= modulesApply
module.exports.fetchApply= fetchApply
module.exports.plugmix= plugmix
/// Slot which will be scanned for plugmixes
module.exports.mix= 'plugmix'
