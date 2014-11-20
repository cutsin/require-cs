/*
 * 前端加载、编译CoffeeScript，修改自jrburke的require-cs@0.4.3
 * 删除require-cs的node部分，修改了一些bug
*/

define(['http://coffeescript.org/extras/coffee-script.js'],function(coffee){
	var isXDR
	var progIds = ['Msxml2.XMLHTTP','Microsoft.XMLHTTP','Msxml2.XMLHTTP.4.0']
	var getXhr = function(){
		if(typeof window.XDomainRequest !== 'undefined'){
			isXDR = true
			return new window.XDomainRequest()
		}
		if(typeof XMLHttpRequest !== 'undefined'){
			return new XMLHttpRequest()
		}
		var xhr
		for(var i=0;i<progIds.length;i++){
			var progId = progIds[i]
			xhr = new ActiveXObject(progId)
			if(xhr){
				progIds = [progId]
				return xhr
			}
		}
	}

	var fetchText = function(url, callback){
		var xhr = getXhr()
		xhr.open('GET', url, true)
		if(isXDR){
			xhr.onload = function(){
				callback(xhr.responseText)
			}
		}else{
			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4){
					callback(xhr.responseText)
				}
			}
		}
		xhr.send(null)
	}

	return {
		load: function(name, req, load, config){
			var path = req.toUrl(~name.search(/\.(coffee)$/)?name:name+'.coffee')
			fetchText(path, function(text){
				// 如果不2次setTimeout，IE会abort
				setTimeout(function(){
					try {
						text = coffee.compile(text, {bare:true})
					}catch(e){
						e.message = 'In ' + path + ', ' + e.message
						throw e
					}
					text += '\r\n//@ sourceURL=' + path
					setTimeout(function(){
						load.fromText(name, text)
						req([name], function(content){
							load(content)
						})
					})
				})
			})
		}
	}
})
