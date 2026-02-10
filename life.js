Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
};
var lifesim = function(options){
    this.settings=$.extend({
        gen:0,
        rule: [[0,0,0,1,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,0,0,0,0]]
    },options);
}
.method("refSum",function(n,src,up,down,left,right){        
    return src[n+left]+src[n+right]
    +src[n+down]+src[n+down+left]+src[n+down+right]
    +src[n+up]+src[n+up+left]+src[n+up+right];    
})
.method("calcRow",function(src,dst,width,y,up,down) {
    var n,sum,rowStart;
    rowStart = y*width;
    n=rowStart;
    dst[n]=this.settings.rule[src[n]][this.refSum(n,src,up,down,width-1,1)];        
    for(var x=1; x<(width-1); x++){
        n=rowStart+x;
        dst[n]=this.settings.rule[src[n]][this.refSum(n,src,up,down,-1,1)];
    }
    n=rowStart+width-1;            
    dst[n]=this.settings.rule[src[n]][this.refSum(n,src,up,down,-1,(width-1)*-1)];             
})
.method("calc",function(src,dst,width,height) {
    var n,sum,rowStart,range=(height-1)*width;
    this.calcRow(src,dst,width,0,range,width);
    for(var y=1; y<height-1; y++){
        this.calcRow(src,dst,width,y,width*-1,width);            
    }
    this.calcRow(src,dst,width,height-1,width*-1,range*-1);            
})
.method("show",function() {
	var src=this.cells[this.src];
	var dst=this.cells[this.dst];
    var cx = document
    .querySelector("canvas")
    .getContext("2d");   
    var n=0;
    for(var y=0; y<this.height; y++){
        for(var x=0; x<this.width; x++){
            if(src[n]!==dst[n]){
                if(src[n]===1) {
                    cx.fillRect(x*2, y*2, 2, 2);
                }
                if(src[n]===0) {
                    cx.clearRect(x*2, y*2, 2, 2);                
                }
            }
            n++;
        }
    }
 })
.method("setSeed",function(seed,px,py){
    var w = seed[0].length; // Assume rectangular
    var h = seed.length;
    var w2 = Math.floor(w/2); // Assume rectangular
    var h2 = Math.floor(h/2);    
    for(var y=0; y<h; y++){
        for(var x=0; x<w; x++){
            var ny = (py+y-h2)*this.width;
            var nx = px-w2+x;
            this.cells[this.src][ny+nx]=seed[y][x];
        }
    }
    this.show(this.cells[this.src],this.cells[this.dst], this.width, this.height);    
})
.method("flipSeedY",function(seed){
    var w = seed[0].length; // Assume rectangular
    var h = seed.length;
    var flipped=[];
    for(var y=0; y<h; y++){
        flipped[y]=[];
        for(var x=0; x<w; x++){
            flipped[y][x]=seed[h-(y+1)][x];
        }
    }
    return flipped;
})
.method("flipSeedX",function(seed){
    var w = seed[0].length; // Assume rectangular
    var h = seed.length;
    var flipped=[];
    for(var y=0; y<h; y++){
        flipped[y]=[];
        for(var x=0; x<w; x++){
            flipped[y][x]=seed[y][w-(x+1)];
        }
    }
    return flipped;
})
.method("rotateSeedR",function(seed){
    var w = seed[0].length; // Assume rectangular
    var h = seed.length;
    var rotate=[];
    for(var y=0; y<w; y++){
        rotate[y]=[];
        for(var x=0; x<h; x++){
            rotate[y][x]=seed[h-(x+1)][y];
        }
    }
    return rotate;
})
.method("tokenize",function( s, parsers, deftok ){
  var m, r, l, cnt, t, tokens = [];
  while ( s ) {
    t = null;
    m = s.length;
    for ( var key in parsers ) {
      r = parsers[ key ].exec( s );
      if ( r && ( r.index < m ) ) {
        t = {
          token: r[ 0 ],
          type: key,
          matches: r.slice( 1 )
        }
        m = r.index;
      }
    }
    if ( m ) {
      tokens.push({
        token : s.substr( 0, m ),
        type  : deftok || 'unknown'
      });
    }
    if ( t ) {
      tokens.push( t ); 
    }
    s = s.substr( m + (t ? t.token.length : 0) );
  }
  return tokens;
})
.method("load",function(lines){
    if(!$.isArray(lines)){
     lines = lines.replaceAll("\r","").split("\n");
    }
    var at=0;
    while(lines[at].indexOf("#C")===0){at++;}
    var parts = lines[at++].match(/x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+).*$/i);
    var x = parts[1];
    var y = parts[2];        
    var result=[];
    for(var c=0;c<y;c++){
        result[c]=[];
        for(var n=0;n<x;n++){
            result[c].push(0);
        }
    }
    var count=1,cells,ly=lx=0;
    while(at<lines.length) {
        var tokens = this.tokenize(lines[at++],{ cells:/[ob]/, number:/\d+/, eol:/[\n\$\!]/ },'?');
        $.each(tokens,function(k,v){
            if(v.type==='number'){
                count=parseInt(v.token);
            }
            if(v.type==='cells'){
                for(var x=0;x<count;x++){
                    $.each(v.token.split(""),function(key,value){
                        result[ly][lx++]=value==='o'?1:0;
                    })
                }
                count=1;
            }
            if(v.type==='eol'){
                lx=0;
                ly++;
            }           
        })
    }       
    return result;    
})
.method("initialise", function(clear) {
    this.cells=[[0],[0]];
    this.src = 0;
    this.dst = 1;
    this.gen=0;    
	var src=this.cells[this.src]	      
    for(var n=0; n<this.width*this.height; n++){            
        if(Math.random()>0.3 || clear) {
            src[n]=0;            
        } else {
            src[n]=1;            
        }
    }
    this.show();
    if(this.settings.badge){
        this.settings.badge(this.gen);
    }       
 })
.method("life",function(){  
    var swap;
    this.calc(this.cells[this.src], this.cells[this.dst], this.width, this.height);
    swap = this.src; this.src=this.dst; this.dst=swap;           
    this.show();    
    this.gen++;
    if(this.settings.badge){
        this.settings.badge(this.gen);
    }
})
.method("setup",function(width,height,clear){
    this.width=width;
    this.height=height;     
    this.initialise(clear);
})
