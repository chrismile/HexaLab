/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 * 
 * @author Christoph Neuhauser (WebGL 2.0 Compute support)
 * 
 * The MIT License
 * 
 * Copyright ? 2010-2019 three.js authors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



var WEBGL = {

	isWebGLAvailable: function () {

		try {

			var canvas = document.createElement( 'canvas' );
			return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );

		} catch ( e ) {

			return false;

		}

	},

	isWebGL2Available: function () {

		try {

			var canvas = document.createElement( 'canvas' );
			return !! ( window.WebGL2RenderingContext && canvas.getContext( 'webgl2' ) );

		} catch ( e ) {

			return false;

		}

	},

	isWebGL2ComputeAvailable: function () {

		try {

			var canvas = document.createElement( 'canvas' );
			return !! ( window.WebGL2ComputeRenderingContext && canvas.getContext( 'webgl2-compute' ) );

		} catch ( e ) {

			return false;

		}

	},

	getWebGLErrorMessage: function () {

		return this.getErrorMessage( 1 );

	},

	getWebGL2ErrorMessage: function () {

		return this.getErrorMessage( 2 );

	},

	getWebGL2ComputeErrorMessage: function () {

		return this.getErrorMessageCompute();

	},

	getErrorMessage: function ( version ) {

		var names = {
			1: 'WebGL',
			2: 'WebGL 2',
			3: 'WebGL 2.0 Compute'
		};

		var contexts = {
			1: window.WebGLRenderingContext,
			2: window.WebGL2RenderingContext,
			3: window.WebGL2ComputeRenderingContext
		};

		var message = 'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>.';

		var element = document.createElement('div');
		element.id = 'webglmessage';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '500px';
		element.style.margin = '5em auto 0';
		element.style.position = 'fixed';
		element.style['background-color'] = 'rgba(0,0,0,0.5)';

		if ( contexts[ version ] ) {

			message = message.replace( '$0', 'graphics card' );

		} else {

			message = message.replace( '$0', 'browser' );

		}

		message = message.replace( '$1', names[ version ] );

		element.innerHTML = message;

		return element;

	},

	getErrorMessageCompute: function () {

		// https://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
		// https://www.w3schools.com/howto/howto_css_modals.asp
		var css =
			".closediv {"+
				"color: #dddddd;"+
				"float: right;"+
				"font-size: 28px;"+
				"font-weight: bold;"+
			"}\n"+
			".close:hover,\n"+
			".close:focus {"+
				"color: #000;"+
				"text-decoration: none;"+
				"cursor: pointer;"+
			"}";
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		head.appendChild(style);
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		
		// style="text-align: right; font-size: 28px; font-weight: bold;"
		var message = '<div class="closediv"><span class="close">&times;</span></div><p>Your browser or graphics card do not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL 2.0 Compute</a>.</p>';

		var element = document.createElement( 'div' );
		element.id = 'webglmessage';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.left = '50%';
		element.style.top = '5%';
		element.style.transform = 'translate(-50%, -50%)';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '80%';
		element.style.margin = '1em auto 0';
		element.style.position = 'absolute';
		element.style['background-color'] = 'rgba(0,0,0,0.2)';

		element.innerHTML = message;

		var span = element.getElementsByClassName("close")[0];
		span.onclick = function() {
			element.style.display = "none";
		}

		return element;

	}
};
