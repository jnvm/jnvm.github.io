//input feedback if invalid
//consider caching formula results on a color-only change
//what if I used peers to contribute computation power? (worry about when there are peers..)
//put state in url#?
//add upload to imgur?
->shaderScope(){/*
	precision highp float;

	#define PI 3.1415926535897932384626433832795
	vec2 cPI=vec2(PI,0.0);
	vec2 cI=vec2(0,1.0);
	vec2 c1=vec2(1.0,0);
	
	// IMPLEMENTATION
	vec2 cCis(float r){return vec2( cos(r), sin(r) );}
	vec2 cCish(float r){
	  vec2 e = vec2( exp(r), exp(-r) );
	  return vec2(e.x + e.y, e.x - e.y);
	}
	float cArg(vec2 c){return atan(c.y, c.x);	}
	vec2  cConj(vec2 c){return vec2(c.x, -c.y);}
	vec2  cInv(vec2 c){
		float dc=dot(c, c);
		return cConj(c) / ( dc==0.0 ? 1.0 : dc );
	}
	vec2 cart2polar(vec2 c){return vec2(length(c),cArg(c));}
	vec2 polar2cart(vec2 c){return vec2(c.x*cos(c.y),c.x*sin(c.y));}
	vec2  cAdd(vec2 a, vec2 b){return a + b;}
	vec2  cAdd(vec2 a, float B){return a + vec2(B,0.0);}
	vec2  cAdd(float A, vec2 b){return vec2(A,0.0) + b;}
	vec2  cSub(vec2 a, vec2 b){return a - b;}
	vec2  cSub(vec2 a, float B){return a - vec2(B,0.0);}
	vec2  cSub(float A, vec2 b){return vec2(A,0.0) - b;}
	vec2  cMul(vec2 a, vec2 b){return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);}
	vec2  cMul(vec2 a, float B){return cMul(a,vec2(B,0.0));}
	vec2  cMul(float A, vec2 b){ return cMul(vec2(A,0.0),b); }	
	vec2  cDiv(vec2 a, vec2 b){return cMul(a, cInv( b));}//arbitrary discontinuity fill
	vec2  cDiv(vec2 a, float B){return cDiv(a,vec2(B,0.0));}
	vec2  cDiv(float A, vec2 b){return cDiv(vec2(A,0.0),b);	}
	//float cAbs(vec2 c){return length(c);}
	vec2 cAbs(vec2 c){return vec2(length(c),0.0);}
	vec2 cRe(vec2 c){return vec2(c.x,0.0);}
	vec2 cIm(vec2 c){return vec2(0.0,c.y);}
	vec2 cNeg(vec2 c){return -c;}
	vec2 cMod(vec2 a, vec2 b){
		return vec2(
			 b.x==0.0 ? 0.0 : mod(a.x,b.x)
			,b.y==0.0 ? 0.0 : mod(a.y,b.y)
		);
	}
	//ALLOW ALL THE POWERS
	vec2  cPow(vec2 z, float n){
	     vec2 c;
	     float mag = pow(length(z),n);
	     float deg = n * atan(z.y,z.x);
	     c.x = cos(deg)*mag;
	     c.y = sin(deg)*mag;
	     return c;
	}
	vec2  cPow(vec2 base,vec2 power){
		if(power.y==0.0) return cPow(base,power.x);

		float m=length(base);
		float t=cArg(base);
		return polar2cart(vec2(
			pow(m,power.x) * exp(-power.y*t)
			, power.y * log(m) + power.x*t
		));
	}
	vec2  cPow(float base,vec2 power){
		return cPow(vec2(base,0),power);
	}
	float cPow(float base,float power){
		//does this even need to exist?
		return pow(base,power);
	}
	vec2 norm(vec2 c){
		return polar2cart(vec2(
			1.0
			, (length(c)==0.0 ? 0.0 : cArg(c))
		));
	}
	vec2 cNorm(vec2 c){
		return norm(c);
	}
	vec2  cExp(vec2 c){return exp(c.x) * cCis(c.y);}
	vec2  cLog(vec2 c){return vec2( log( cAbs(c).x ), cArg(c) );}
	vec2  cSin(vec2 c){return vec2( sin(c.x), cos(c.x) ) * cCish(c.y);}//  NOTE: component-wise multiplication
	vec2  cSin(float c){return cSin(vec2(c,0.0));}
	vec2  cArcSin(vec2 c){
		//return Complex.NEG_I.mult(Complex.log(c.mult(Complex.I).add(Complex.sqrt(Complex.ONE.sub(c.rPow(2))))));
		
		return cMul(
			-cI
			,cLog(
				cMul(c,cI) + cPow(c1-cPow(c,2.0),.5)
			)
		);
	
	}
	vec2  cArcSin(float c){return cArcSin(vec2(c,0.0));}
	vec2  cCos(vec2 c){return vec2( cos(c.x), -sin(c.x) ) * cCish(c.y);}//  NOTE: component-wise multiplication
	vec2  cCos(float c){return cCos(vec2(c,0.0));}
	vec2  cArcCos(vec2 c){
		// formula: arccos(c) = i*log(c-i*sqrt(1-c^2))
		return cI * cLog(c - cMul( cI, cPow(c1 - cPow(c,2.0),0.5)));
	}
	
	vec2 cTan(vec2 c){
		vec2 ce=cExp( 
			cMul( 
				2.0*cI
				,c
			)
		);
		return cDiv(
			       (ce - c1)
			,//----------------
			cMul(cI,ce + c1)
		);
	}
	vec2 cTan(float c){return cTan(vec2(c,0.0));}
	vec2  cArcTan(vec2 c){
		// formula: arctan(c) = i/2 log((i+c)/(i-c))
		return cMul( 
		cMul(cI,0.5)
		, cLog( 
		cDiv( 
		(cI + c)
		, (cI - c) ) ) );
	}
	vec2  or(vec2 a, vec2 b){return length(a)!=0.0 ? a : b;}
	vec2  cOr(vec2 a, vec2 b){return or(a,b);}

	//UNFINISHED
	vec2 gamma(vec2 a, vec2 b){
	return vec2(0.0,0.0);
	
		//if(b.x < 0.5) return cDiv(cPi,   )
	
		
		
	    //Complex.gamma = function (c) {
	    //    var z,
	    //        x,
	    //        i,
	    //        t;
	//
	    //    if (c.r < 0.5) {
	    //        return Complex.PI.div(
	    //			Complex
	    //				.sin(Complex.PI.mult(c))
	    //				.mult(Complex.gamma(Complex.ONE.sub(c)))
	    //		);
	    //    }
	//
	    //    z = c.sub(Complex.ONE);
	    //    x = p[0];
	//
	    //    for (i = 1; i < 9; i++) {
	    //        x = x.add(p[i].div(z.add(index[i])));
	    //    }
	//
	    //    t = z.add(Complex(7.5, 0, 7.5, 0));
	    //    return SQRT2PI.mult(t.pow(z.add(Complex(0.5, 0, 0.5, 0)))).mult(Complex.exp(Complex.neg(t))).mult(x);
	    //};	
		//
	
	;}
	

	float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
	
	vec3 hsl2rgb(vec3 c){
	    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
	}	
	
	
	float logOf2=log(2.0);
	
	//X,Y,scale inline at eval
	vec4 zfxn() {
	
		vec4 px=vec4(0.0, 0.0, 0.0, 1);
		const float an=##ALIAS##; //pls be a square
		const float aRow=sqrt(an);
	
		//implement a 3x3 averaging anti alias
		for(float ai=0.0;ai<aRow;ai++){
		for(float aj=0.0;aj<aRow;aj++){
			vec2 c = vec2(
				 (X + (gl_FragCoord.x+(ai/aRow))* scale)
				,(Y + (gl_FragCoord.y+(aj/aRow))* scale)
			);
			vec2 z = vec2(0, 0);
	
			//z_n=z^2+c
			vec2 n = vec2(0,0);
			bool escaped=false;
			const int maxN=##MAXN##;
			float M=0.0;
			for(int i = 0; i < maxN; i++) {
				//z=cPow(z,2.0)+c;//regular mandlebrot
				z=##Z##;
				M=length(z);
				if(M > 2.0){
					escaped=true;
					break;
				}
				n.x++;
			}
			
			//phrase new vars as complex
			vec2 v= vec2( escaped ? (n.x - log(log(M)/logOf2)/logOf2 )/float(maxN) : 0.0 ,0);
			vec2 m=vec2(M,0);
	
			vec3 rgb=##HSL##(vec3(
				 length(##COLOR1##)
				,length(##COLOR2##)
				,length(##COLOR3##)
			));
			
			//add to aggregate for later averaging
			px+=vec4(rgb.rgb,1.0);
		}
		}
		
		//return vec4(rgb.xyz,1);
		
		//average results
		px[0]/=an;
		px[1]/=an;
		px[2]/=an;
		px[3]/=an;//eh
		
		return px;
	}
	
	void main(){ gl_FragColor=zfxn(); }
*/}
//jquery re-use
$.extend({
	ic:->{
		return Array.prototype.slice.call(arguments).map(->(c){
			return $("<span />").attr({class:c})
		})
	}
	,cloneCanvas(oldCanvas){
		var newCanvas = $.extend(document.createElement('canvas'),{
			 width:oldCanvas.width
			,height:oldCanvas.height
		})
		
		newCanvas.getContext('2d').drawImage(oldCanvas, 0, 0)
		return newCanvas;
	}
})
.fn.extend({
	 toggleHoverClass:->(selector){
		return $(this).hover(
			 ->{ (selector && $(selector)||$(this)).addClass("hover") }
			,->{ (selector && $(selector)||$(this)).removeClass("hover") }			
		)
	}
	,toggleHoverClassOn:->(x){
		return $(this).toggleHoverClass(x)
	}
	,same:->(a,b){
		return JSON.stringify(a)==JSON.stringify(b)
	}
	,VAL:->(v){
		//dangit checkbox...
		var me=$(this)
			,isCheckbox=me.is(":checkbox")
		//getter
		if(v===undefined){
			if(isCheckbox) return me.is(":checked")
			else return me.val()
		}
		//setter
		else{
			if(isCheckbox) me.prop({checked:v})
			else me.val(v)
			return me
		}
	}
})
//prep plugin
$.extend($.fn.qtip.defaults.position,{my: 'bottom center',at: 'top center'})
$.extend($.fn.qtip.defaults.style,{classes:"tooltip qtip-tipsy qtip-shadow"})
$.extend($.fn.qtip.defaults.show,{delay:250})
//front end
var face={
	init:->{
		//fetch remote store
		face.db.get(->(json){
			localStorage.colorings=JSON.stringify(json.colorings||{})
			localStorage.formulas=JSON.stringify(json.formulas||{})

			//preload ls into face
			face.colorings=JSON.parse(localStorage.colorings||"{}")
			face.formulas=JSON.parse(localStorage.formulas||"{}")
			
			//prep webgl
			face.render.renderer=new THREE.WebGLRenderer({
				preserveDrawingBuffer: true//needed for toDataURL?
			})
			face.render.shaderCore=multiline(shaderScope)
			
			//init some math
			initTex2Asciimath([])
			jsep.removeBinaryOp("^")
			jsep.addBinaryOp("^",11)//10 is geometric
			jsep.removeBinaryOp("%")
			jsep.addBinaryOp("%",10)//10 is geometric			

			//make makey-part of interface
			face.makeInputs()
			//prefill last values
			var lastVals=localStorage.lastVals
				? JSON.parse(localStorage.lastVals)
				: {
					formula:"z^2+c",
					"preset-formula":"z^2+c",
					"preset-coloring":'{"r":"im((norm(c)))+10*v^(.5)","g":"1","b":"v^(.00625)","colorform":"HSL"}',
					colorform:"HSL",
					r:"im((norm(c)))+10*v^(.5)",
					g:"1",
					b:"v^(.00625)",
					P:1,
					Q:1,
					R:1,
				}

			//save last values to return on load
			$(window)
				.on("unload",->storeEntries{
					localStorage.lastVals = JSON.stringify(
						_.extend(
							$(":input[id]").toArray()
								.reduce(->(set, part) {
									set[part.id] = $(part).VAL()
									return set
								}, {})
							//too custom
							,{formula:face.getFormula()}
							,face.getColoring()
						)
					)
						
					localStorage.colorings=JSON.stringify(face.colorings)
					localStorage.formulas=JSON.stringify(face.formulas)
					localStorage.lastCoord=JSON.stringify(map.getCoords())
					face.db.put()
				})
				//make box-zooming a little more obvious? Doesn't help at all
				.on("keydown keypress",function(e){ if(e.shiftKey) $("#map").addClass("shift-down") })
				.on("keyup keypress",function(e){ if(!e.shiftKey) $("#map").removeClass("shift-down") })			

			face.map.make(->{
				//weirdo inputs
				var editors=_.extend({formula:lastVals.formula},_.pick(lastVals,["r","g","b","colorform"]))
				_.each(editors,->(v,k){
					face.input[k].val(v).trigger("input")
					delete lastVals[k]
				})
				//regular inputs
				$.each(lastVals,->(v,k){ console.log(v,k);face.input[v].VAL(k).trigger("input") })
				
				if(localStorage.lastCoord){
					pt=JSON.parse(localStorage.lastCoord)
					face.map.setView([pt.y,pt.x],pt.mzl)
				}
				else face.map.setView([0,0],6)
				//face.map.redraw()
				$("[title]").each(->{
					var me=$(this)
						,o={}
					if(me.attr("title").match(/<a/i)) o.hide={fixed:true,delay: 500}
					me.qtip(o)
				})
				$("#map .leaflet-control-fullscreen-button").qtip({position:{my: 'top center',at: 'bottom center'}})
				//be courteous
				$("textarea:visible:first").focus()
			})
		})
	},
	db:{
		url:"https://api.myjson.com/bins/1hhtu"
		,get:->(done){ $.get(face.db.url,done) }
		,put:->(done){
			//first get what's there right now
			face.db.get(->(json){
				if(!json.colorings) json.colorings={}
				if(!json.formulas) json.formulas={}
				//then merge with what I have
				_.extend(json.colorings,face.colorings)
				_.extend(json.formulas,face.formulas)
				//then save. Lessens chance I'll overwrite someone else's content
				$.ajax({
					url: face.db.url
					,type: "PUT"
					,data: JSON.stringify(json)
					,contentType: "application/json; charset=utf-8"
					,dataType: "json"
					,success: function(data, textStatus, jqXHR) { done && done() }
					,error:function(x,y,z){
						console.log(x,y,z)
					}
				})
			})
			
		}
	},
	render:{
		square2:->(o){
			var x=o.x
				,y=o.y
				,zoom=o.zoom
				,done=o.callback
				,w=o.side
				,h=w
				,wh={
					 width:w
					,height:h
				}
				//destination canvas
				,canvas=o.givenCanvas||$("<canvas />").attr(wh).css(wh)[0]
				,cx=canvas.getContext('2d')
				,scratch=cx.createImageData(w,h)
				,z=2*pow(2,zoom)
				,iter=$("#iterations").val()*1
				,alias=$("#anti-alias").is(":checked")
				,have=0
				,formula=face.getFormula()
				,coloring=face.getColoring()
				,localT=0
				,workerT=0
				,lambdaT=0
				,opt={
					verb: 1
					,iter: iter
					,ptr:{
						 x: x/z*w
						,y: y/z*h
						,z: z
					}
					,w: w
					,h: h
					,zoom:zoom
					,formula: formula
					,coloring: coloring
					,t1: Date.now()
					,key:o.key//+","+lvl
					,antiAlias:alias
				}
			
			face.render.via.webgl(opt,->(drawnCanvas){
				cx.drawImage(drawnCanvas,0,0)
				o.callback(canvas)
			})
		},
	 	
		via:{
			webgl:->(opt,callback){
				//console.log("opt",opt)
				var s=face.map.tileSize
					,scene = new THREE.Scene()
					,camera = new THREE.PerspectiveCamera(1,1,1,1.01)//last one, just > camera.position.z
					,forceFloat=face.expression.forceFloat
					//shape geometry doesn't really matter; just needs to fill camera so shader can be applied to full view
					,shaderCode=["//ha"
							//need to inline pt & fxns...
							,"float scale="+forceFloat(1/opt.ptr.z)
							,"float tileSize="+forceFloat(face.map.tileSize)
							,"float X="+forceFloat( opt.ptr.x)
							,"float Y="+forceFloat(-opt.ptr.y//on a canvas, up is -; on a shader, down is -
								-face.map.tileSize*1/opt.ptr.z//I have no frickin idea why.  Why only Y & not X? Probably because of the above.
							)
							,face.render.shaderCore
								.replace(/##Z##/,face.expression.infix2glsl(opt.formula))
								.replace(/##MAXN##/,face.getIterations())
								.replace(/##HSL##/,opt.coloring.colorform=="HSL" ? "hsl2rgb":"")
								.replace(/##COLOR2##/,face.expression.infix2glsl(opt.coloring.g))
								.replace(/##COLOR3##/,face.expression.infix2glsl(opt.coloring.b))
								.replace(/##COLOR1##/,face.expression.infix2glsl(opt.coloring.r))
								.replace(/##ALIAS##/,opt.antiAlias?"9.0":"1.0")
							].join(";\n")
				//console.log(shaderCode)
				var plane = new THREE.Mesh(
						 new THREE.PlaneGeometry(1,1,1)
						,new THREE.ShaderMaterial({fragmentShader: shaderCode})
					)
					,renderer=face.render.renderer
				
				renderer.setSize(s,s)
				scene.add( plane )
				camera.position.z = 1
				setTimeout(->{
					renderer.render(scene, camera)
					callback(renderer.domElement)
				},1)
			}
		}
	},
	input:{},
	makeInputs:->{
		->promptForUniqueIn(set,q,val){
			var x
			while(set[x=prompt("(Note p,q,r are substituted for current values)\n\n"+q+(tis(val,"") ? "\n"+val+"\n" : ""))])
				alert("That one's already taken, try a different one.")

			if(val!=undefined && x) set[x]=val
			face.db.put()
			buildPresets()
			return x
		}
		
		$(".math-editor").each(->{
			var div=$("<div />")
				,me=$(this)
				,id=me.attr("id")
				
			me.append(div)
				
			div.mathquill("editable")
			div.val=->(x){
				if(x===undefined){
					var r=false
					try{ r=div.mathquill("text") }
					catch(err){console.error(err) }
					me[(r===false?"add":"remove")+"Class"]("error")
					//console.log(r,me.attr("class"))//WHY ISN'T THIS ERROR SHOWING?
					return r||""
				}
				else{
					return div.mathquill("latex",AMTparseAMtoTeX(x))
				}
			}
			
			face.input[id]=div
			
		})

		->buildPresets(){
			$("#presets").empty().append(
				 $("<label title='Load a saved fractal formula' />").append(
					 $("<m class=w2 />").text("z(c)")
					,$("<select id=preset-formula />").append(
						$("<option />").text("-Choose-")
						,$.map(face.formulas,->(json,name){return $("<option />").html(name).val(json)})
					).on("change",->{
						var v=$(this).val()
						if(v){
							face.input.formula.val(v).trigger("change")
							face.map.center()
							face.map.redraw()
						}
					})
				)
				,$("<button title='Save this fractal formula' />").append($.ic("fa-floppy-o"))
					.toggleHoverClassOn("#formula")
					.click(->{ promptForUniqueIn(face.formulas,"Fractal formula title for:",face.getFormula()) })
				,$("<label title='Load a saved coloring formula' />").append(
					 $.ic("fa-paint-brush w2")
					,$("<select id=preset-coloring />").append(
						$("<option />").text("-Choose-")
						,$.map(face.colorings,->(json,name){return $("<option />").html(name).val(JSON.stringify(json))})
					).on("change",->{
						var v=$(this).val()
						if(v){
							v=JSON.parse($(this).val())
							_.keys(v).forEach(->(k){
								face.input[k].val(v[k]).trigger("change")
							})
							face.map.redraw()
						}
					})
				)
				,$("<button title='Save this coloring formula' />").append($.ic("fa-floppy-o"))
					.toggleHoverClassOn("#inputs .color")
					.click(->{ promptForUniqueIn(face.colorings,"Color scheme title?",face.getColoring()) })
			)
			
			//if in typing I stumble upon a pre-existing thing, show it
			//a complication was introduced here with mathquill + the latex->asciimath converter: it will add arbitrary ()s in some places repeatedly, they don't <-> uniformly.  jsepping into their glsl looks to remove the extras.
			var ns=".preset-update"
				,evs="change input keyup".replace(/(\w)\b/g,"$1"+ns)
				//cache preset glsls[code]=name
				,glsl={
					formulas: _.reduce(face.formulas, ->(set, v, k) {
						set[face.expression.infix2glsl(v)] = k
						return set
					}, {})
					,colorings: _.reduce(face.colorings, ->(set, v, k) {
						var json=JSON.stringify({
							 r: face.expression.infix2glsl(v.r)
							,g: face.expression.infix2glsl(v.g)
							,b: face.expression.infix2glsl(v.b)
							,colorform: v.colorform
						})
						set[json] = k
						return set
					}, {})
				}
			$("#formula").off(ns).on(evs,_.debounce(->{
				var code=face.expression.infix2glsl(face.getFormula())
					,named=glsl.formulas[code]
				$("#preset-formula").val(face.formulas[named])
			},100))
			$("#r,#g,#b,#colorform").off(ns).on(evs,_.debounce(->{
				var code=face.getColoring()
				code.r=face.expression.infix2glsl(code.r)
				code.g=face.expression.infix2glsl(code.g)
				code.b=face.expression.infix2glsl(code.b)
				code=JSON.stringify(code)
				var named=glsl.colorings[code]
				$("#preset-coloring").val(JSON.stringify(face.colorings[named]))
			},20))
		}
		buildPresets()

		var freevar={min:-10,max:10}

		"PQR".split("").forEach(->makeFreeVars(v){
			$("<div class=freevar />").append(
				 $("<label />").html("<m>"+v.toLowerCase()+" = </m>")
				,$("<input />").attr({type:"number",id:v}).val(0)
					.on("input change",->{
						var me=$(this)
						me.closest("div").find("input[type=range]").val(me.val())
					})
				,$("<input />").attr({type:"number",for:"min"}).val(freevar.min)
				,$("<input />").attr({type:"range",min:freevar.min,max:freevar.max,step:.01})
					.on("input change",->{
						var me=$(this)
						me.closest("div").find("input[id]").val(me.val())
					})
				,$("<input />").attr({type:"number",for:"max"}).val(freevar.max)
			).appendTo("#freevars>.stuff")
			.find("input[for]").on("input change",->updateMinMax{
				var me=$(this)
					,range=me.closest("div").find("input[type=range]")
				range.attr(me.attr("for"),me.val())
				range.attr({step:  (range.attr("max")*1-range.attr("min")*1)/100  })
			}).trigger("change")
			.end()
			.find("input").on("input change",_.throttle(->{
				//face.map.rerender()
			},100))
		})
		
		$("#iterations").on("input",_.debounce(->{face.map.redraw()},250))

		$("<label />").append(
			$("<m class=w2 />").text("z(+)")
			,$("<button />").html("Toggle <m>p,q,r</m> sliders")
				.attr({title:"p,q,r are \"fiddle variables\" you can enter in the formulas below and vary with their sliders to get a feel for what happens"})
				.addClass("fa-caret-right")
				.click(->{
					$(this).toggleClass("fa-caret-down fa-caret-right")
					$("#ih>.expression-holder").toggleClass("hide-fv")
					$("#freevars>.stuff:first").slideToggle()
				})
		).prependTo("#freevars")		
			.parent().find(".stuff:first").hide()

		var delayedRedraw=_.debounce(->{face.map.redraw()},500)
		
		$(":input,[class*=editor]")
			.each(->allowEasyReferencingIfNotAlreadyPopulated{ if(!face.input[this.id]) face.input[this.id]=$(this) })
			.filter("[class*=editor]")
				.on("keyup", -> execMaybe(e) {
					e.stopPropagation()
					if(e.which == kbd.enter)
						delayedRedraw()
				})
			.end()
			//is this still needed?
			.filter(":not([class*=editor],textarea)")
				.on("input change",_.debounce(->(){
					face.map.redraw()
				},100))
		
		$("#colorform").on("input",->{
			var it=$(this)
				,v=it.val()
				,labels=$("#inputs .colorform")
				,isRGB= v=="RGB"
			labels.filter(".hsl")[isRGB?"hide":"show"]()
			labels.filter(".rgb")[isRGB?"show":"hide"]()
		})
		
		$("<button class=minimize title='toggle formula editor' />").addClass("fa-caret-down")
			.click(->{
				var me=$("#inputs")
					,ih=$("#ih")
				if(me.hasClass("mini")){
					me
					.removeClass("mini")
					.animate({width:ih.width()+20,height:ih.height()+20},->{
						ih.add(me).removeAttr('style')//:/
					})
				}
				else{
					ih.width(ih.width()).height(ih.height())
					me
					.addClass("mini")
					.animate({width:"2em",height:"2em"})	
				}
				$(this).toggleClass("fa-caret-down fa-pencil")
			})
			.prependTo("#inputs")		

	},
	expression:{
		toCanvas:->(done){
			var x=$(".expression-holder").addClass("picmode")
			html2canvas(x[0],{allowTaint:true}).then(function(canvas) {
				x.removeClass("picmode")
				done(canvas)
			})
		},
		simplify:->(x){
			//return x
			//mathquill + latex output -> asciimath converter adds unneeded ()s.  Remove them by reparsing ast
			//this is not the optimal case, but fixes the parenthesis creep
			x=x.replace(/([)0-9])([(a-z])/i,"$1*$2")//touching things multiply
			var ast=jsep(x)
				,groupWorthyOps={"+":1,"-":1,"%":1,"/":1}//,"^":1}
			
			function go(node){
				//console.log(node)
				if(node.type=="BinaryExpression"){
					var L=go(node.left)
						,R=go(node.right)
						,Last=jsep(L)
						,Rast=jsep(R)
						,isExp=node.operator=="^"
					
					//if either branch's immediate child node is an arithemtic operator, parenthesize, otherwise don't
					//console.log("L",jsep(L),"R",jsep(R))
					if( (Last.type=="BinaryExpression" && groupWorthyOps[Last.operator])) L="("+L+")"
					if( (Rast.type=="BinaryExpression" && groupWorthyOps[Rast.operator])||isExp) R="("+R+")"
					
					return L+node.operator+R
				}
				else if(node.type=="Literal")         	return node.value
				else if(node.type=="Identifier")      	return node.name
				else if(node.type=="CallExpression")  	return node.callee.name+"("+node.arguments.map(function(x){return go(x)}).join(",")+")"
				else if(node.type=="UnaryExpression") 	return "("+(node.prefix? node.operator+""+go(node.argument) : go(node.argument)+""+node.operator)+")"
			}
			
			var simplified=(go(ast)+"")
				//single terms that aren't fxn executions never need parenthesizing
				.replace(/(^|[^a-z])\(([a-zA-Z0-9-]+)\)/gi,'$1$2')

			return simplified
		},
		infix2glsl:->(s){
			function go(node){
				if(node.type=="BinaryExpression"){
					if(node.operator=="^")      return "pow("+go(node.left)+","+go(node.right)+")"
					else if(node.operator=="*") return "mul("+go(node.left)+","+go(node.right)+")"
					else if(node.operator=="/") return "div("+go(node.left)+","+go(node.right)+")"
					else if(node.operator=="%") return "mod("+go(node.left)+","+go(node.right)+")"
					else return go(node.left)+node.operator+go(node.right)
				}
				else if(node.type=="Literal")          return face.expression.forceFloat(node.value) //#
				else if(node.type=="Identifier")       return node.name  //var
				else if(node.type=="CallExpression")   return node.callee.name+"("+node.arguments.map(function(x){return go(x)}).join(",")+")"
				else if(node.type=="UnaryExpression")  return "("+(node.prefix? node.operator+""+go(node.argument) : go(node.argument)+""+node.operator)+")"
				else return ""
			}
			s=(s||'').replace(/([)0-9])([(a-z])/i,"$1*$2")//presume touching things multiply
			var str=go(jsep(s))
				.replace(/\b(\d+\.?\d*)\b/g,"vec2($1,0.0)")//make all real #s complex-friendly
				.replace(/\bi\b/g,"vec2(0.0,1.0)")//i
				.replace(/\be\b/g,"vec2(2.718281828459045,0.0)")//e

			face.expression.cFxns.forEach(function(x){
				str=str.replace(new RegExp("\\b"+x+"\\b","ig"),"c"+x)
			})
			
			//console.log("shader format",str)

			return str
			
		},
		forceFloat:->(x){
			var s=x.toString()
			if(!s.match(/\./)) s=s+".0"
			return s
		},
		cFxns:shaderScope.toString()
			.match(/(vec2|float)\s+([a-z0-9_]+)\s*\([^{)]*\)\s*\{/gi)
			.map(->(x){return x.split(/[ (]+/)[1]})
			.filter(->(x){return x.match(/^c[A-Z]/)})
			.map(->(x){return x.replace(/^c/,'')})
			.sort(function descBySize(a,b){return b.length - a.length})//so arcsin is replaced before sin...though a \b should handle it		
	},
	cache:{},
	map:{
		tileSize:512,
		maxZoom:50,//past 56 precision lost on CPU, half that on GPU
		make:->(done){
			face.map.lowRezPxSize=face.map.tileSize/16//(2*(Object.keys(pool.workers).length+1))
			face.render.lvls=[face.map.lowRezPxSize,1]
			
			var el=$("#map")
				,map=L.map(el.attr("id"), {
					center: [0,0],
					zoom:5,
					attributionControl:false,
					fadeAnimation:false,
					zoomAnimation:true,
					zoomAnimationThreshold:5,//"do not animate if dz > this
					bounceAtZoomLimits:true,
					crs:L.CRS.Simple,//docs are not clear this can go here!!
					maxBounds:[[200, -200], [-200, 200]],
					fullscreenControl: true,
					maxZoom:face.map.maxZoom,
					tapTolerance:3,
				})
				,layer = L.tileLayer.canvas({
					async: true
					,tileSize: face.map.tileSize
					,crs: L.CRS.Simple
					,updateWhenIdle: true//as in ONLY when not moving
					//,unloadInvisibleTiles: true //has tileunload event to dequeue!
					,continuousWorld: true
					//,reuseTiles:true
					,noWrap: false
					,maxZoom: face.map.maxZoom
				})
			layer.drawTile= -> (canvas, pt, zoom) {
				var key = [pt.x, pt.y, zoom].join(",")
					,cacheVal=face.cache[key]
				//console.log("drawTile called for ",pt,zoom)
				if(!cacheVal) {
					face.cache[key]="rendering"//placeholder
					canvas.key=key
					//console.log("requesting render",key)
					face.render.square2({
						 x: pt.x
						,y: pt.y
						,side: face.map.tileSize
						,zoom: zoom
						,givenCanvas: canvas
						,key:key
						//you'll reply twice: once as lowres & once hi; save hi
						,callback: function(drawnCanvas) {
							if(0 && "want coords in canvas") {
								var ctx = drawnCanvas.getContext('2d')
								ctx.font = "11px serif"
								ctx.fillStyle = "#fff"
								//ctx.fillText(key+"@"+drawnCanvas.px, 10, 10)
								ctx.fillText(drawnCanvas.ptr.x+"|"+drawnCanvas.ptr.y, 10, 10)
							}
							//only cache hi res
							if(drawnCanvas.px==1){
								if(face.cache[key]=="rendering" || !face.cache[key]){
									//console.log("caching hi res",key)
									face.cache[key] = $.cloneCanvas(drawnCanvas)
								}
								else{
									//console.log("already have hi res cache for ",key,"what gives")
								}
							}
							else{
								//console.log("lo res for ",key,"not caching")
							}
							layer.tileDrawn(drawnCanvas)
						}
					})
				}
				else{
					if(cacheVal=="rendering"){
						//console.log("still rendering",key,"...waiting")
					}
					else{
						//console.log("using cache for ",key)
						//copy hi-res from predrawn
						canvas.getContext('2d').drawImage(face.cache[key], 0, 0)
						layer.tileDrawn(canvas)
					}
				}
			}
			map.canvasLayer=layer//so I can easily reference


			$.extend(map,{
				redraw:->{
					console.log("redrawing")//,Error("!").stack)
					face.cache={}
					layer.redraw()
				},
				setFade:->(on){
					el[(on?"add":"remove")+"Class"]("leaflet-fade-anim")
					map.options.fadeAnimation=!!on
					return map
				},
				toImage:->(as){
					//instead of ordering by dom position, use keys.  Requires determining bounds & placing into canvas, then cropping
					var layer=map.canvasLayer
						,tiles =_.values(layer._tiles)
							.map(->makeKeyRealNumbers(c){
								//x,y,z
								c.akey=c.key.split(",").map(->(x){return x*1})
								c.$off=$(c).offset()
								return c
							})
						,tile1=tiles[0]
						,w=tile1.width
						,minX=tile1.akey[0]
						,maxX=tile1.akey[0]
						,minY=tile1.akey[1]
						,maxY=tile1.akey[1]
						,fiddleDeeDee=tiles.forEach(->(t){
							     if(t.akey[0]<minX) minX=t.akey[0]
							else if(t.akey[0]>maxX) maxX=t.akey[0]
							     if(t.akey[1]<minY) minY=t.akey[1]
							else if(t.akey[1]>maxY) maxY=t.akey[1]
						},"")
						,leftmost=$(tiles.filter(->(c){return c.akey[0]==minX})[0]).offset().left
						,topmost =$(tiles.filter(->(c){return c.akey[1]==minY})[0]).offset().top
						,topLeftTile={left:leftmost,top:topmost}//might not exist as single tile
						,cols=(maxX-minX)+1
						,rows=(maxY-minY)+1
						,wh={width:w*cols,height:w*rows}
						,pic=$("<canvas />").css(wh).attr(wh)
						,cx=pic[0].getContext('2d')
					//console.log(wh,cols,rows,minX,minY,maxX,maxY,topLeftTile)
					tiles
						.forEach(->(canvas){
							var  x=(canvas.akey[0]-minX)*w
								,y=(canvas.akey[1]-minY)*w
							//console.log("drawing",canvas,canvas.key,"@",x,y)
							cx.drawImage(canvas,x,y)
						})
						
						
					//now...crop to match what the user sees
					var m=$("#map")
						,mo=m.offset()
						,uwh={width:m.width(),height:m.height()}
						,cropped=$("<canvas />").css(uwh).attr(uwh)
						,ccx=cropped[0].getContext('2d')
					//console.log(uwh,mo,topLeftTile)
					ccx.drawImage(pic[0], abs(mo.left - topLeftTile.left), abs(mo.top - topLeftTile.top), uwh.width, uwh.height, 0, 0, uwh.width, uwh.height)
					pic=cropped
			
					//consider adding the JSON to reproduce it
					return !as || as=="img" ? $("<img />").attr({src:pic[0].toDataURL()})
						: as=="canvas" ? pic[0]
						: false
				},
				getCoords:->{
					var ll=map.getCenter()
						,mzl=map.getZoom()
						,mapZoomLevel=mzl
						,z=2*pow(2,mzl)
						,pt={x:ll.lng,y:ll.lat}
						,s=map.getSize()
					return {
						x: pt.x
						,y: pt.y
						,z: z
						,w: s.x / z
						,h: s.y / z
						,mzl:mzl
					}
				},
			})
			
			var origToggleFullscreen=map.toggleFullscreen.bind(map) 
				,inputsContainer=L.DomUtil.create('div', 'inputs-holder')
				,inputsControl=L.control({position: "bottomleft"})//why
			map.toggleFullscreen=->{
				if(map.isFullscreen()){
					//put input back on body
					$("#inputs").appendTo("#page")
					inputsControl.removeFrom(map)
				}
				else{
					//put as map control
					inputsControl.onAdd = function(x) {
						$("#inputs").appendTo(inputsContainer)
							.on("click mouseup mousedown dblclick", function(e) {
								e.stopPropagation()
							})
						return inputsContainer
					}
					inputsControl.addTo(map)
				}
				origToggleFullscreen()
			}
			
			//center btn
			map.addControl(new (L.Control.extend({
			    options: {position: 'topleft'},
			    onAdd: function (map) {
			    	var container = map.zoomControl._container
			    		,a=$("<a />").addClass('ctrlicon fa-crosshairs')
				    		.attr({title:"Center at 0,0 & default zoom"})
				        	.click(->(e) {
				        		e.stopPropagation()
				        		e.preventDefault()
				        		map.setView([0,0],6)
				        		map.redraw()
				        	})
				        	.appendTo(container)
			        map.center=->{ a.click() }
			        return container
			    }
			}))())
			
			//save img btn
			map.addControl(new (L.Control.extend({
				options: {position: 'topleft'},
			    onAdd: function (map) {
			    	var container = map.zoomControl._container
			    	$("<a />").addClass('ctrlicon fa-camera')
			    		.attr({title:"Save image"})
			        	.click(->{
			        		var mapImg=map.toImage("img")
			        			,uri2blob=->(uri){
									function dataURItoBlob(dataURI) {
									    // convert base64/URLEncoded data component to raw binary data held in a string
									    var byteString;
									    if (dataURI.split(',')[0].indexOf('base64') >= 0)
									        byteString = atob(dataURI.split(',')[1]);
									    else
									        byteString = unescape(dataURI.split(',')[1]);
									
									    // separate out the mime component
									    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
									
									    // write the bytes of the string to a typed array
									    var ia = new Uint8Array(byteString.length);
									    for (var i = 0; i < byteString.length; i++) {
									        ia[i] = byteString.charCodeAt(i);
									    }
									
									    return new Blob([ia], {type:mimeString});
									}
			        				return window.URL.createObjectURL( dataURItoBlob( uri ) )
			        			}
			        			,blobUrl=uri2blob( mapImg.attr("src") )
			        			,holder=$("<div id=pic />")
				        			.append(
		        						 $("<div class=x />").html("&times;").click(->(e){
		        						 	e.stopPropagation()
		        						 	e.preventDefault()
		        						 	holder.click()
		        						 })
				        				,$("<a />")
				        					.attr({
				        						download:"fractal"
				        						,href:blobUrl
				        					})
				        					.append(
				        						$("<div class=dl-hint >").html("Click to download & close").append(
			        								$("<div />").append(
				        								$("<label />").html("include formulas?").append(
					        								$("<input type=checkbox />").prop({checked:true}).on("change",->(e){
					        									e.stopPropagation()
					        									e.preventDefault()
					        									if($(this).is(":checked")) makeFractalPlusFormulas()
					        									else{
					        										//repeating...
					        										holder.find("img").replaceWith(mapImg)
					        										holder.find("a").attr({src:blobUrl})
					        									}
					        								})
			        									)
			        								)
			        							)
				        						,mapImg
				        					)
				        			)
				        			.on("click",->(e){
				        				if($(e.target).is("#pic,img"))  holder.remove()
				        			})
				        			.appendTo("body")

							->makeFractalPlusFormulas(){
								face.expression.toCanvas(->(exCanvas){
									//merge
									var mapCanvas=$(map.toImage("canvas"))
										,expCanvas=$(exCanvas).css({visibility:"none",position:"absolute",left:-999999,top:-999999}).appendTo("body")//you need to be attached possibly bc the other comes from already-attached canvases
										,mapW=mapCanvas.width()
										,mapH=mapCanvas.height()
										,expW=expCanvas.width()
										,expH=expCanvas.height()
										,wh={
											width: max( mapW, expW )
											,height: mapH + expH
										}
										,canvas=$("<canvas />").css(wh).attr(wh)
										,ctx=canvas[0].getContext('2d')
										//would like to be able to center things...
										,mw=min(mapW,expW)
										,mapIsSmaller=mapW==mw
										,blob
									//apply backdrop
									ctx.fillStyle = "#000"
									ctx.fillRect(0,0,wh.width,wh.height)
									//invert math on its canvas
									var ex=expCanvas[0].getContext('2d')
									ex.fillStyle = "white"
									ex.globalCompositeOperation = "difference"
									ex.fillRect(0,0,expW,expH)
									//stack images
									ctx.drawImage(mapCanvas[0], mapIsSmaller ? (expW-mapW)/2 : 0 ,0)
									ctx.drawImage(expCanvas[0],!mapIsSmaller ? (mapW-expW)/2 : 0 ,mapH)
									
									blob=uri2blob(canvas[0].toDataURL())
									holder.find("img").replaceWith($("<img />").attr({src:blob}))
									holder.find("a").attr({href:blob})
									expCanvas.remove()
					        		
					        		if(map.isFullscreen()) map.toggleFullscreen()
								})
							}
							makeFractalPlusFormulas()
			        	})
			        	.appendTo(container)
			        return container
			    }
			}))())

			$.extend(map,face.map)
			face.map=map
			window.map=map

			$(window).on("mouseup", function(e) {
				if($(e.target).attr("id") == "mapholder")
					map.invalidateSize(false)
			})
			
			->updateCoord{
				var pt=map.getCoords()
					,n=7
				
				->tiny(x){
					var ax=abs(x)
					return !x ? 0
						: (ax>1000 || ax< .001) ? x.toExponential(n) : x.toFixed(n)
				}
				
				face.input.x .val(tiny(pt.x  ))
				face.input.y .val(tiny(pt.y  ))
				face.input.xw.val(tiny(pt.w/2))
				face.input.yh.val(tiny(pt.h/2))
			}
			
			//creates weird issues if I don't put it after other extends
			map.addLayer(layer)
				.on("zoomstart",->{
					//.leaflet-zoom-anim?
					face.map.zooming=true
					_.each(face.cache,->(v,k){
						if(v=="rendering") delete face.cache[k]
					})
					updateCoord()
				})
				.on("zoomend",->{
					cc.log("zoomed to ",map.getZoom())
					face.map.zooming=false
					updateCoord()
				})
				.on("resize",updateCoord)
				.on("move",updateCoord)
				.on("movestart",updateCoord)
				.on("moveend",updateCoord)
			done && done()
		}
	},
	parseStringInput:->(s){
		//until I can natively escape fxns properly w/o \
		face.expression.cFxns
			.forEach(->(f){
				s=s.replace(new RegExp("\\b"+f.split("").join("\\*")+"\\b\\*?","gi"),f.toLowerCase())
			})
		
		//dangit perl syntax
		s=s .replace(/\*\*/g,"^")
			//...
			.replace(/cdot/gi,'*')

		//swap in constants
		"pqr".split("").forEach(->(v){
			s=s.replace( new RegExp("\\b"+v.toLowerCase()+"\\b","g") , face.input[v.toUpperCase()].val() )
		})
		s=s.replace(/\s+/g,'')

		return face.expression.simplify(s)
	},
	getFormula:->{
		var error=false,r
		try{ r=face.parseStringInput(face.input.formula.val().trim()||"c") }
		catch(err){ error=err }
		face.input.formula.parent()[(error?"add":"remove")+"Class"]("error")
		return r
	},
	getColoring:->{
		return {
			 r: face.parseStringInput(face.input.r.val() || "0")
			,g: face.parseStringInput(face.input.g.val() || "0")
			,b: face.parseStringInput(face.input.b.val() || "255")
			,colorform: face.input.colorform.val()||"rgb"
		}
	},
	getIterations:->{
		return $("#iterations").val()*1
	},
}
//go
$(face.init)
