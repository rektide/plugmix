var mixes= require('./module-walk'),
  events= require('events'),
  path= require('path')

module.exports= require

function*tries(base){
	var base= module+dir
	yield module.base+path.sep+'plugmix.js';
	yield module.basepath
}

function*require(module){
	for(var mod of modules){
		if(module.filename){
			yield module
		}else{
			for(var t of tries(mod)){
				try{
					yield require(t)
				}catch(e){
				}t 
			}
		}
	}
}


function mixin(){
	
}
