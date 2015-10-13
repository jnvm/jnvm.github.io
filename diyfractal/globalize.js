//various helpers that work on either end //may not use es6
!function globalize(){
var isServer=typeof window==="undefined"
	,window= typeof window!="undefined" && window
		||   typeof global!="undefined" && global
		||   typeof self  !="undefined" && self
Number.isNaN = Number.isNaN || function(value) { return typeof value === "number" && value !== value}
Array.isArray = Array.isArray || function(arg) {return Object.prototype.toString.call(arg) === '[object Array]'}
RegExp.escape = function(text) {return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}
Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(e){"use strict";if(void 0===e||null===e)throw new TypeError("Cannot convert first argument to object");for(var r=Object(e),t=1;t<arguments.length;t++){var n=arguments[t];if(void 0!==n&&null!==n){n=Object(n);for(var o=Object.keys(Object(n)),a=0,c=o.length;c>a;a++){var i=o[a],b=Object.getOwnPropertyDescriptor(n,i);void 0!==b&&b.enumerable&&(r[i]=n[i])}}}return r}});

var util={
		 tis          	:function(a,b){ //aka "type is"
			return a===undefined  ? b===undefined   
				: a===null        ? b===null        
				: Array.isArray(a)? Array.isArray(b)
				: Number.isNaN(a) ? Number.isNaN(b)
				: a!==undefined && b!==undefined && (a.constructor==b.constructor)
		}
		,g            	:function(min,max,floaty){
			//guess wrapper
			switch(arguments.length){
				case 1:
					var a=arguments[0]
					if(tis(a,[]))	return a[g(a.length-1)]							//pass an array, and I'll randomly pick an entry
					else 			return Math.round(0  +Math.random()*(    min))	//between 0 and given, assuming integer	
				case 2: 			return Math.round(min+Math.random()*(max-min))	//between min and max, assuming integer
				case 3: 			return            min+Math.random()*(max-min)	//between min and max, assuming float
				case 0: 			return                Math.random()				//regular
			}
		}
		,cc             :(function(){
			var cc=console.log.bind(console)
			cc.log=function(){
				return console.log.apply(console,arguments)
			}
			return cc
		})()
		,kbd:{
			 codes:function(key1,key2,keyN){
				return (
					//did you pass multiple items? I'll tack each arg in an array then
					key2 ? Array.prototype.slice.call(arguments)
					//otherwise, let's assume there's only 1 arg & it's space/comma separated, make that the array
					: key1.split(/[\s,]/)
				).map(function(v){
					return kbd[v]
				})
			 }
			,up:38
			,right:39
			,down:40
			,left:37
			,del:46
			,tab      :"\t".charCodeAt(0)
			,backspace:"\b".charCodeAt(0)
			,space    : " ".charCodeAt(0)
			,enter    :"\r".charCodeAt(0)
		}
		,isAny:function(goal,check2,check2,checkN){
			var args=Array.prototype.slice.call(arguments)
				,goal=args.shift()
			
			//if only sent goal & 2nd arg, and 2nd is array, it's the compare set
			if(args.length==1 && tis(args[0],[])) args=args[0]
			for(var i in args) if(args[i]==goal) return true
			return false
		}
		,pick           :function(n,array,insistUnique){
			var picked=[]
			if(n==0) return picked
			else{
				if(insistUnique){
					var guessedIndices={}
						,guessedIndex
						,al=array.length
						,remaining=[].concat(array)
					if(al<n){
						var err="cannot pick "+n+" uniques from array of length "+al
						console.error(err)
						alert(err)
					}
					else while(n--) picked.push(remaining.splice(g(remaining.length-1),1)[0])
				}
				else while(n--) picked.push(g(array))
				return picked
			}
		}
		,prefill      	:function(listHolder,n,val){
			//allow for fill(10), fill(10,'x'), fill([],10,'x') inputs
			if(tis(listHolder,1)){//if that's clearly not a list kind of thing
				var count=listHolder
					,nWas=n
				listHolder=[]					
				if(val===undefined && n!==undefined){
					val=n
					n=undefined
				}
				if(n===undefined) n=count
			}
			if(val===undefined) val=''
			
			//console.log(listHolder,n,val)
			//generic clone? Works for everyone but arrays.  Pass a number to an array and get an array of length number.  Fix with conditional apply.  Then can prefill with prefill.
			var valType=val.constructor.toString().split(/\s/)[1].replace(/\W/g,'')
			while(n--) listHolder[n]=valType=='Array'? Array.apply('',val) : window[valType](val)
			return listHolder
		}
		,fill           :function(){return prefill.apply({},arguments)}
		,alphaAsc     	:function(a,b){return a<b?1:-1}
		,alphaDesc    	:function(a,b){return a>b?1:-1}
		,lexicalAsc   	:function(a,b){return a>b?1:a==b?0:-1}
		,randomly     	:function(a,b){return g()-.5}
		,shuffle        :function(array) {
		  var currentIndex = array.length
			, temporaryValue
			, randomIndex

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {
		
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex -= 1
		
			// And swap it with the current element.
			temporaryValue = array[currentIndex]
			array[currentIndex] = array[randomIndex]
			array[randomIndex] = temporaryValue
		  }
		
		  return array;
		}
		,repeat       	:function(x,n){return Array(n+1).join(x) }
		,replaceCharAt	:function(string,index,character) {//wow, I need this?
			return string.substr(0, index) + character + string.substr(index+character.length)
		}
		,pythag       	:function(x,y){return sqrt(x*x,y*y)}
		,noop         	:function(){}
		,aFxn           :function(){}
		,array2obj		:function(a,justBeTruthy,specificKey){
			var o={}
			a.forEach(function(v,i){
				if(specificKey) o[v[specificKey]]=v
				else o[v]=justBeTruthy ? 1 : i
			})
			return o
		}
		,a2o            :function(){return array2obj.apply({},arguments)}
        ,obj2array      :function(o,specifyKeyName){
        	return Object.keys(o).reduce(function(set,key){
        		var nu={}
        		nu.val=o[key]
        		nu[ specifyKeyName || (o[key]['key']===undefined?'key':'_key') ]=key
        		set.push(nu)
        		return set
        	},[])
        }
        ,o2a            :function(){return obj2array.apply({},arguments)}
        ,korf           :function constantOrFunction(x){
			return tis(x,aFxn) ? x() : x
		}
        ,kLike          :function keyLike(pattern,obj){
            return Object.keys(obj).filter(function(k){ return k.match(pattern) })[0]
        }
		,v4kLike        :function valueForKeyLike(pattern,obj){
            //could be more graceful
            return obj[kLike(pattern,obj)]
        }
		,makeBtwn       :function(n,min,max){
				 if(n>max) return max
			else if(n<min) return min
			else return n				
		}
		,isBtwn         :function(n,min,max){
			return (n<=max && n>=min)
		}
		,b64:{
			 digits:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
			,from: function(number) {
				if (isNaN(Number(number)) || number === null || number === Number.POSITIVE_INFINITY) throw "The input is not valid"
				if (number < 0) throw "Can't represent negative numbers now"
				var rixit
					,residual = Math.floor(number)
					,result = ''
				while (true) {
					rixit = residual % 64
					result = this.digits.charAt(rixit) + result
					residual = Math.floor(residual / 64)
					if (residual == 0) break
				}
				return result
			}
			,to10: function(fromB64) {
				var result = 0
				rixits = fromB64.split('')
				for (e in rixits) result = (result * 64) + this.digits.indexOf(rixits[e])
				return result
			}
		}
		,code2str       :function(a){
			return Array.prototype.slice.call(arguments)
				.reduce(function(a,v){
					return a+String.fromCharCode(v)
				},'')
		}	
		,aDay           :24*3600*1000
		,isEmpty        :function(x){
			if(x===undefined || x===null) return true
			
			var r
			     if(tis(x,[])) r=x.length
			else if(tis(x,{})) r=Object.keys(x).length
			//does not support new es6 structures
			else               r=(x+'').length
			return !r
		}
		,isNotEmpty     :function(){ return !isEmpty.apply({},arguments) }
		,ifEmpty        :function(x,thenBeThis){
			return isEmpty(x) ? thenBeThis : x
		}
		,share          :function(o1,o2,key){ return o1[key]===o2[key]}
		//apparently Cairo is a jerk and insists on RGBA format.
		,RGB2HSL: function(e, t, n) {
				e /= 255, t /= 255, n /= 255;
				var r = Math.max(e, t, n)
					,i = Math.min(e, t, n);
				var s, o, u = (r + i) / 2;
				if(r == i) {
					s = o = 0
				} else {
					var a = r - i;
					o = u > .5 ? a / (2 - r - i) : a / (r + i);
					switch(r) {
						case e:
							s = (t - n) / a + (t < n ? 6 : 0);
							break;
						case t:
							s = (n - e) / a + 2;
							break;
						case n:
							s = (e - t) / a + 4;
							break
					}
					s /= 6
				}
				return [s * 360, o * 100, u * 100]//.map(floor)
			}
			,HSL2RGB: function(e, t, n) {
				e /= 360;
				t /= 100;
				n /= 100;
				var r, i, s;
				if(t == 0) {
					r = i = s = n
				} else {
					function o(e, t, n) {
						if(n < 0) n += 1;
						if(n > 1) n -= 1;
						if(n < 1 / 6) return e + (t - e) * 6 * n;
						if(n < 1 / 2) return t;
						if(n < 2 / 3) return e + (t - e) * (2 / 3 - n) * 6;
						return e
					}
					var u = n < .5 ? n * (1 + t) : n + t - n * t;
					var a = 2 * n - u;
					r = o(a, u, e + 1 / 3);
					i = o(a, u, e);
					s = o(a, u, e - 1 / 3)
				}
				return [r * 255, i * 255, s * 255]//.map(floor)
			}
	    ,match:function(pattern){
		    return function(string){
			    return string.match(pattern)
		    }
		}
		,notMatch:function(){ return !match.apply({},arguments)}
		,multiline:function(f){ return f.toString().split(/\/\*!?(?:\@preserve)?\s*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//)[1] }
		,hash2obj:function(){ return url2obj().hash }
		,url2obj:function(customStr){
			var loc=customStr ? {custom:customStr} : location
			return (customStr ? ['custom'] : ['hash','search'])
				.reduce(function(set,part){
					set[part]=(loc[part]||"")
						.replace(/^[#?]/, '').split("&")
						.reduce(function(set,part){
							var kvp=part.split("=")
								,nu={}
							set[kvp[0]]=kvp[1]
							return set
						},{})
					return set
				},{})
		}
		,insistArray:function(x){return tis(x,[]) ? x : [x]}
		
		//you are project-specific
		,url2embedInfo:function(url){
			url=url||""
			//very fuzzy right now
			var embed=false
				,noImg="http://img.youtube.com/vi/"
				,providers={
					 youtu:{id:/youtu\S+[=\/]([\w-]{11})/i,src:"https://www.youtube.com/embed/" }//+ID
					,vimeo:{id:/vimeo.com\/(\d+)/i        ,src:"https://player.vimeo.com/video/"}
				}

			for(var domain in providers)
				if(url.match(domain)){
					var id=url.match(providers[domain].id)
					if (id) {
    					if(id.length!=2) return noImg
    					else return {
    						 id:id[1]
    						,src:providers[domain].src+id[1]
    					}
				    }
				}
			console.log("Unsupported video provider")
			return noImg
		}
	}
//go away Maths
Object.getOwnPropertyNames(Math).forEach(function(v){util[v]=Math[v]})
//such poor feature symmetry
Object.vals=function(o){
	var a=[]
	for(var i in o) a.push(o[i])
	return a
}
Object.values=Object.vals
String.prototype.reverse=function(){return this.split("").reverse().join("")}
String.prototype.toProperCase=function () {
	//spaces
	var s=this.replace(/([a-z])([A-Z])/g,'$1_$2').replace(/_/g,' ')
	//can only proper case if I don't see TWO capitals next to each other; otherwise assume ACRONYM
	if(!s.match(/[A-Z]{2,}/)) return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	else return s
}
String.prototype.decapitalize=function lowercaseOnlyFirstLetter() {
	return this[0].toLowerCase() + this.slice(1,this.length)
}
String.prototype.toMethodName=function() {
	return this.pretty().split(" ").join("").decapitalize()
}
String.prototype.camelSplit=function(andLowercase){
	var splitToken="~<x>~"
		,tokenized=this.replace(/([a-z])([A-Z])/g,'$1'+splitToken+'$2')
	if(andLowercase) tokenized=tokenized.toLowerCase()
	return tokenized.split(splitToken)
}
String.prototype.pretty=function(){
	return this
		.replace(/([a-z])([A-Z])/g,'$1 $2')
		.replace(/([^_])_([^_])/g,'$1 $2')
		.toProperCase()
}
String.prototype.machine=function(){
	var slug='_'
	return this
		.camelSplit("and lowercase").join(slug)
		.replace(/\W/g,slug)
		.replace(new RegExp("^"+slug+"+|"+slug+"+$","g"),'')//slug trim
}
String.prototype.padCenter=function(n){
	var R=1
		,string=this
	do{
		if(R) string+=" "
		else string=" "+string
		R=!R
	}
	while(string.length<n)
	return string
}
String.prototype.padRight=function(n){
	var s=this.length
	if(s>this.length) return this
	else return this+Array( max( ((n-s)+1),1) ).join(" ")
}
String.prototype.padLeft=function(n){
	var s=this.length
	if(s>this.length) return this
	else return      Array( max( ((n-s)+1),1) ).join(" ")+this
}
String.prototype.ellipsize=function(n){return (this.length<n?this:this.substring(0,n)+"â€¦")+''}
String.prototype.countChar=function(character){
	return ((this+'').match(RegExp(character,"g")) || []).length
}
String.prototype.countAllChars=function(){
	return (this+'').split("").reduce(function(o,ltr){
		if(o[ltr]===undefined) o[ltr]=0
		o[ltr]++
		return o
	},{})
	
}
String.prototype.unique=function(){
	return Object.keys(
		(this+'').split("").reduce(function(o,ltr){
			o[ltr]=1
			return o
		},{})
	).join("")
}
String.prototype.in=function(space_delimited_set){
	return !!this.match(new RegExp("\\b("+space_delimited_set.trim().split(/\s+/).join("|")+")\\b","i"))
}
Function.prototype.pass=function(){//pass a function with given variables for later execution; "return a function whose execution would be a guess between 1 and 10" would be guess.pass(1,10).
	//In the event arguments are already to be passed to the function, these will be appended to the arg sequence
	var _f=this,
		new_args=Array.prototype.slice.call(arguments, 0)
	return function(){
		var originally_sent_args=Array.prototype.slice.call(arguments, 0)
		return _f.apply(_f,originally_sent_args.concat(new_args))
	}
}
Function.prototype.wrap=function(f){
	return f(this)
}
Function.prototype.getHeader=function(){
	var orig=this.toString()
		,s=orig.match(/^.*function.*\([^)]*\).*\{/)[0]
			.replace(/\/\*([\s\S]*?)\*\/|\/\/(.*)$/gm, '')//remove comments
			.replace(/|\/\/.*|\n|^\s*|\s*$/g,'')//remove newlines & trim
			.replace(/\s{2,},/g,' ')//reduce all multiple spaces to single
			.replace(/\(\s+\)/,'()')//close no-arg case
		,args=s.match(/\(\)/)?[]:s.match(/\(\s*(\s*.*\s*)\s*\)/)[1].split(/\s*\,\s*/)
		,n=args.length
	
	return {
		 string:s
		,name:s.match(/^function ([^ ]*)\(/i)[1]
		,args:n?args:[]
		,argo:n?array2obj(args):{}
	}
}
Function.prototype.toObj=function(){
	return {
		header:this.getHeader()
		,body:this.toString().split(/^.*function.*\([^)]*\)[^{]*{|}$/gi)[1]
	}
}
Function.prototype.argFilter=function(filter){
	//so, the filter function is passed the arguments of the function it modifies, and its scope (this) is that function being modified
	var origScope=this
	return this.wrap(function argFilterer(origFxn){
		return function origArgCatcher(){
			var  origArgsPassed=Array.prototype.slice.call(arguments, 0)
				,filteredArgs=filter.bind(origFxn)(origArgsPassed)
			return origFxn.apply(origScope,filteredArgs)
		}
	})
}
Function.prototype.time=function(){
	//meant for build steps
	var f=this.getHeader()
	console.time(f.name)
	this.apply(null,arguments)
	console.timeEnd(f.name)
}
for(var i in util) window[i]=util[i]
}()