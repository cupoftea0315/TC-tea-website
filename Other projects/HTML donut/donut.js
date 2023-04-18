// converts a color from the form like "1 0.2839802930 0.7263832"
// to a form like "#FFAC10"
const convert_wallpaper_engine_color_to_hex = (value) => {
  // split by spaces
  const hexified = value.split(" ").map(c => {
      // parse string to float and then multiply by 255
      // and convert to hex
      let hex_value = parseInt(255 * parseFloat(c)).toString(16);

      // pad an extra 0 at the beginning of the hex values
      if (hex_value.length == 1) {
          hex_value = "0" + hex_value;
      }

      // woooo
      return hex_value;
  });

  // turn the array into a string
  return "#" + hexified.join("")
}

// update CSS props based on wallpaper engine properties
let render_donut_speed = 25;
window.wallpaperPropertyListener = {
  applyUserProperties: (properties) => {
      const donut = document.getElementById("donut");
      if (!donut) {return;}
      if (properties.size) {
        donut.style["font-size"] = properties.size.value + "px";
      }

      if (properties["donut-speed"]) {
        render_donut_speed = properties["donut-speed"].value;
      } 

      if (properties["donut-color"]) {
          donut.style["color"] = convert_wallpaper_engine_color_to_hex(properties["donut-color"].value);
      }

      if (properties["background-color"]) {
          document.body.style["background-color"] = convert_wallpaper_engine_color_to_hex(properties["background-color"].value);
      }
  }
};  

// adaptation of https://www.a1k0n.net/js/donut.js
(function() {
var _onload = function() {
  var pretag = document.getElementById('donut');
  var A=1, B=1;

  // This is copied, pasted, reformatted, and ported directly from my original
  // donut.c code
  var asciiframe=function() {
    var b=[];
    var z=[];
    A += 0.07;
    B += 0.03;
    var cA=Math.cos(A), sA=Math.sin(A),
        cB=Math.cos(B), sB=Math.sin(B);
    for(var k=0;k<1760;k++) {
      b[k]=k%80 == 79 ? "\n" : " ";
      z[k]=0;
    }
    for(var j=0;j<6.28;j+=0.07) { // j <=> theta
      var ct=Math.cos(j),st=Math.sin(j);
      for(i=0;i<6.28;i+=0.02) {   // i <=> phi
        var sp=Math.sin(i),cp=Math.cos(i),
            h=ct+2, // R1 + R2*cos(theta)
            D=1/(sp*h*sA+st*cA+5), // this is 1/z
            t=sp*h*cA-st*sA; // this is a clever factoring of some of the terms in x' and y'

        var x=0|(40+30*D*(cp*h*cB-t*sB)),
            y=0|(12+15*D*(cp*h*sB+t*cB)),
            o=x+80*y,
            N=0|(8*((st*sA-sp*ct*cA)*cB-sp*ct*sA-st*cA-cp*ct*sB));
        if(y<22 && y>=0 && x>=0 && x<79 && D>z[o])
        {
          z[o]=D;
          b[o]=".,-~:;=!*#$@"[N>0?N:0];
        }
      }
    }
    pretag.innerHTML = b.join("");
  };

  // render initial frame
  asciiframe();

  // render all subsequent steps with
  // chained timeout calls
  // this allows us to change the speed without resetting
  const render_frame_in_steps = () => {
    asciiframe();
    setTimeout(render_frame_in_steps, render_donut_speed);
  }

  // start rendering!
  render_frame_in_steps();
};

if(document.all)
  window.attachEvent('onload',_onload);
else
  window.addEventListener("load",_onload,false);
})();
