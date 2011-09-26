//		stok.js v0.1
//		javascript component for modular loading.
//
//		uses:
//		- javascript application load progress bar
//		- javacsript application loader
//		- javascript application dynamic loading of modules
//
//		current version uses jquery.
//
//		To Use: 
//		- add items to be loaded with the methods provided.
//		- set a loading completed callback
//		- set a laoding progressbar
//		- call load() to load all items.


var stok = function() {



	//////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////
	// public elements
	
	
	var pub = {};


	// loading completed callback
	pub.loadCompletedAction = function() {}


	// add an array of image url to be preloaded
	pub.addImages = function( moreImageUrlsArray ) {
		
		imageUrlsArray = imageUrlsArray.concat( moreImageUrlsArray );
		
		nToLoad += moreImageUrlsArray.length;
		nLoaded = 0;
	}



	// add an array of scripts to be loaded.
	// Multiple sets (arrays) of scripts can be added,
	// And each set will be loaded in order.
	pub.addScripts = function( scriptUrlsArray ) {
		
		// add new stage of scripts loading
		scriptsStagesArray.push( scriptUrlsArray );
		
		nToLoad += scriptUrlsArray.length;
		nLoaded = 0;
	}



	// add json data to be loaded
	// parameter: array object with url string and callback
	// example: { url:'abc', callback: someObj.someFunction }
	pub.addJson = function( urlAndStoreObjArray ) {
		
		jsonArray = jsonArray.concat( urlAndStoreObjArray );	
		nToLoad += urlAndStoreObjArray.length;
		nLoaded = 0;
	}



	// add text data to be loaded
	// parameter: array object with url string and callback
	// example: { url:'abc', callback: someObj.someFunction }
	pub.addTextData = function( urlAndStoreObjArray ) {
		
		textsArray = textsArray.concat( urlAndStoreObjArray );	
		nToLoad += urlAndStoreObjArray.length;
		nLoaded = 0;
	}


	// set a jqueryUI progress bar
	pub.setJqueryUIprogressbar = function( jquiProgbar ) {
		
		jquiProgressbar = jquiProgbar;
		
	}



	// load all that has been added
	// "loadCompletedAction" callback is called when loading complete
	pub.load = function() {
				
		loadImages();
	
	}




	//////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////
	// private


	// number of items to load
	var nLoaded = 0;

	// number of items loaded
	var nToLoad = 0;


	
	/////////////////////////////////////
	// images

	
	// images to be loaded 
	var imageUrlsArray = [];

	var imagesLoadCompletedAction = function() {};
	
	var nImagesLoaded = 0;


	var loadImages = function() {
		
		$( imageUrlsArray ).each( function(){
			$('<img>').attr({ src: this }).load( imageLoadedAction );
			//(new Image()).src = this;
		});		
		
		// image loaded
		function imageLoadedAction() {
			nLoaded++;
			nImagesLoaded++;
			updateLoadProgress();
			if( nImagesLoaded == imageUrlsArray.length )
				loadScripts();
		}
		
	}



	/////////////////////////////////////
	// scripts
	

	// scripts to be loaded
	// array of arrays of strings
	// each stage is an array of string urls
	var scriptsStagesArray = [];

	// number of stages to load scripts
	var nStagesToLoad = 0;

	// current scripts loading stage
	var nStage = 0;
	
	var scriptsLoaded = 0;
	
	var scriptsLoadCompletedAction = function() {};
	

	var loadScripts = function() {

		nStagesToLoad = scriptsStagesArray.length;
		
		if( nStage < nStagesToLoad )
			loadScriptStage( nStage );
		
		// load scripts of current stage
		function loadScriptStage( n ) {

			$( scriptsStagesArray[n] ).each( loadScript );
		}
		
		// load a script
		function loadScript( index, scriptUrl ) {
			
			$.getScript( scriptUrl, scriptLoadedAction );			
		}

		// script loaded
		function scriptLoadedAction() {
			
			nLoaded++;
			scriptsLoaded++;
			updateLoadProgress();
			
			console.log('		##' + scriptsLoaded + ' == ' + scriptsStagesArray[nStage].length  );
			
			if( scriptsLoaded == scriptsStagesArray[nStage].length ) {
				scriptsLoaded = 0;
				nextStage();
			}
		}
		
		// next stage, or end loading scipts
		function nextStage() {
			nStage++;

			if( nStage < nStagesToLoad )
				loadScriptStage( nStage );
			else {
				loadJson();
			}
		}
			
	}



	/////////////////////////////////////
	// json


	// array of objects { url:'...', store:{} }
	var jsonArray = [];

	var jsonLoadCompletedAction = function() {};
	
	var nJsonLoaded = 0;


	var loadJson = function() {
		
		$( jsonArray ).each( loadJson );
		
		// load a json
		function loadJson( index, jsonLoadItem ) {
		
			$.getJSON( 
				jsonLoadItem.url, 
				function( data ) { 
					jsonLoadItem.callback( data );
					jsonLoadedAction();
				}
			);			
		}
		
		// json loaded
		function jsonLoadedAction() {
						
			nLoaded++;
			nJsonLoaded++;
			updateLoadProgress();

			if( nJsonLoaded == jsonArray.length )
				loadTexts();
		}
		
	}


	/////////////////////////////////////
	// text data


	// array of objects { url:'...', store:{} }
	var textsArray = [];

	var textsLoadCompletedAction = function() {};
	
	var nTextsLoaded = 0;


	var loadTexts = function() {

		$( textsArray ).each( loadText );
		
		// load a text data
		function loadText( index, textLoadItem ) {
			
			$.get( 
				textLoadItem.url, 
				function( data ) { 
					textLoadItem.callback( data );
					textLoadedAction();
				}
			);
					
		}
		
		// text loaded
		function textLoadedAction( data, store ) {
			nLoaded++;
			nTextsLoaded++;
			updateLoadProgress();
						
			if( nTextsLoaded == textsArray.length )
				pub.loadCompletedAction();
		}
		
	}
	
	

	
	

	/////////////////////////////////////
	// load progress


	// jquery ui progress bar reference
	var jquiProgressbar = null;

	// loading progress from 0 to 1
	var loadingProgress = 0;


	var updateLoadProgress = function() {
		
		loadingProgress = Math.round( 100 * nLoaded / nToLoad );
		jquiProgressbar.progressbar( "value" , loadingProgress );	
		
	}







	/////////////////////////////////////////////////////
	
	return pub;

}();






