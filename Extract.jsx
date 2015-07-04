// ExportSelectedLayers.jsx
// Written by M.Ubaid Raza, @mubaidr, mubaidr@gmail.com
if (!documents.length) {
	alert('Plase open a file and then try executing this script.');
} else {
	preferences.rulerUnits = Units.PIXELS;
	var dlg = new Window('dialog', 'Save Layers'),
		directory = app.activeDocument.path,
		exportData = '',
		exportObject = [],
		documentDimension = {
			x: parseFloat(app.activeDocument.width, 10),
			y: parseFloat(app.activeDocument.height, 10)
		},
		docName = app.activeDocument.name;
	dlg.margins = 20;

	exportData += 'Document Name: \t ' + app.activeDocument.name + '\n';
	exportData += 'Dimenstions (px): \t' + 'Horizontal: ' + documentDimension.x + ' , ' + 'Vertical: ' + documentDimension.y + '\n';
	exportData += '\nLayer Details: \n\n';

	/*Directory Selection*/
	dlg.dirPanel = dlg.add('group');
	dlg.dirPanel.orientation = "row";
	dlg.dirPanel.spacing = 20;

	dlg.dirPanel.btnDirectory = dlg.dirPanel.add('button', [undefined, undefined, 100, 30], 'Select directory', {
		name: 'btn_dir'
	});

	dlg.dirPanel.lblDirectory = dlg.dirPanel.add('statictext', [undefined, undefined, 360, 20], directory.fsName, {
		name: 'lbl_dir'
	});

	dlg.dirPanel.btnDirectory.onClick = function () {
		directory = Folder.selectDialog("Select folder to save...");
		if (directory == null) {
			directory = app.activeDocument.path;
		}
		dlg.dirPanel.lblDirectory.text = decodeURI(directory.fsName);
	};

	/*Type Selection*/
	dlg.typePanel = dlg.add('group');
	dlg.typePanel.orientation = "row";
	dlg.typePanel.spacing = 20;

	dlg.typePanel.cbType1 = dlg.typePanel.add('checkbox', [undefined, undefined, 230, 30], 'Save layers as PNG', {
		name: 'cb_type_1'
	});

	dlg.typePanel.cbType2 = dlg.typePanel.add('checkbox', [undefined, undefined, 230, 30], 'Save layers information', {
		name: 'cb_type_2'
	});

	dlg.typePanel.cbType1.value = true;

	dlg.typePanel.cbType1.onClick = function () {
		if (dlg.typePanel.cbType1.value) {
			dlg.typePanel.cbType2.value = false;
		} else {
			dlg.typePanel.cbType1.value = true;
		}
	};

	dlg.typePanel.cbType2.onClick = function () {
		if (dlg.typePanel.cbType2.value) {
			dlg.typePanel.cbType1.value = false;
		} else {
			dlg.typePanel.cbType2.value = true;
		}
	};

	/*Buttons*/
	dlg.btnPnl = dlg.add('group');
	dlg.btnPnl.orientation = "row";
	dlg.btnPnl.spacing = 20;

	dlg.btnPnl.btnApply = dlg.btnPnl.add('button', [undefined, undefined, 230, 30], 'Process', {
		name: 'btnApply'
	});

	dlg.btnPnl.btnCancel = dlg.btnPnl.add('button', [undefined, undefined, 230, 30], 'Exit', {
		name: 'btnCancel'
	});

	dlg.btnPnl.btnApply.onClick = handleClick;

	dlg.btnPnl.btnCancel.onClick = function () {
		dlg.close();
	};

	function handleClick() {
		var selected = null;
		if (dlg.typePanel.cbType1.value) {
			selected = dlg.typePanel.cbType1;
		} else if (dlg.typePanel.cbType2.value) {
			selected = dlg.typePanel.cbType2;
		} else {
			selected = dlg.typePanel.cbType3;
		}

		switch (selected.text) {
		case 'Save layers as PNG':
			exportAllLayers();
			break;
		case 'Save layers information':
			exportAllLayersInfo(true);
			break;
		default:
			alert('Unknown error has occured.');
			break;
		}
	}

	dlg.show();

	function exportAllLayersInfo(save) {
		var selLayers = getSelectedLayersIdx();

		for (var i = 0; i < selLayers.length; i++) {
			selectLayerByIndex(selLayers[i]);
			getSelectedLayerInfo(activeDocument.activeLayer);
		}
		if (save) saveFile();
	}

	function getSelectedLayerInfo(ref) {
		exportObject = [];
		if (ref.layers) {
			var len = ref.layers.length;
			for (var i = 0; i < len; i++) {
				var layer = ref.layers[i];
				if (layer.typename == 'LayerSet') {
					getSelectedLayerInfo(layer);
				} else {
					var x1 = parseFloat(layer.bounds[0]);
					var y1 = parseFloat(layer.bounds[1]);
					var x2 = parseFloat(layer.bounds[2]);
					var y2 = parseFloat(layer.bounds[3]);
					//return [x1,y1,x2,y2]
					exportData += 'Name: \t ' + layer.name + '\n';
					exportData += 'Dimenstions (px): \t' + 'Horizontal: ' + (x2 - x1) + ' , ' + 'Vertical: ' + (y2 - y1) + '\n';
					exportData += 'Dimenstions (%): \t' + 'Horizontal: ' + (x2 - x1) / documentDimension.x + ' , ' + 'Vertical: ' + (y2 - y1) / documentDimension.y + '\n';
					exportData += 'Bounding Box: \t Start point: (' + x1 + ',' + y1 + ') , End Point: (' + x2 + ',' + y2 + ')' + '\n';
					exportData += '\n';
					/*
										exportObject.push({
											name: layer.name,
											dimension: {
												x1: x1,
												y1: y1,
												x2: x2,
												y2: y2
											}
										});*/
				};
			}
		} else {
			var layer = ref;
			if (layer.typename == 'LayerSet') {
				getSelectedLayerInfo(layer);
			} else {
				var x1 = parseFloat(layer.bounds[0]);
				var y1 = parseFloat(layer.bounds[1]);
				var x2 = parseFloat(layer.bounds[2]);
				var y2 = parseFloat(layer.bounds[3]);
				//return [x1,y1,x2,y2]
				exportData += 'Name: \t ' + layer.name + '\n';
				exportData += 'Dimenstions (px): \t' + 'Horizontal: ' + (x2 - x1) + ' , ' + 'Vertical: ' + (y2 - y1) + '\n';
				exportData += 'Dimenstions (%): \t' + 'Horizontal: ' + (x2 - x1) / documentDimension.x + ' , ' + 'Vertical: ' + (y2 - y1) / documentDimension.y + '\n';
				exportData += 'Bounding Box: \t Start point: (' + x1 + ',' + y1 + ') , End Point: (' + x2 + ',' + y2 + ')' + '\n';
				exportData += '\n';
				/*
								exportObject.push({
									name: layer.name,
									dimension: {
										x1: x1,
										y1: y1,
										x2: x2,
										y2: y2
									}
								});*/
			}
		}
	}

	function saveFile() {
		var fileName = app.activeDocument.name.substring(0, app.activeDocument.name.lastIndexOf("."));
		//var path = app.activeDocument.path.fsName;
		var fullPath = directory + "/" + fileName + "_layers_info_" + Date.now() + ".txt";
		var file = new File(fullPath);
		file.open('w');
		file.write(exportData);
		file.close();
		alert("Successfully saved selected layers info to: \n\n" + fullPath);
	}

	function SelectAndCopy(x, y, width, height) {
		var selRegion = Array(Array(x, y),
			Array(x + width, y),
			Array(x + width, y + height),
			Array(x, y + height), Array(x, y));
		//alert(x + ',' + y + ',' + (width + x) + ',' + (height + y) + ',' + width + ',' + height);

		app.activeDocument.selection.deselect();
		app.activeDocument.selection.select(selRegion);
		app.activeDocument.selection.copy(true);
		app.activeDocument.selection.deselect();
	}

	function PasteToNewDocument(width, height, name) {
		width = new UnitValue(width, 'px');
		height = new UnitValue(height, 'px');
		var doc = documents.add(width, height, 72, "ScriptCreated", NewDocumentMode.RGB);

		app.activeDocument = doc;
		var layer = app.activeDocument.artLayers.add();
		layer.name = name;
		app.activeDocument.activeLayer = layer;

		doc.paste();
		doc.layers.getByName("Background").remove();
	}

	function CloseDoc(save) {
		if (save) {
			app.activeDocument.close(SaveOptions.SAVECHANGES);
		} else {
			app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
		}
	}

	function SaveDoc() {
		app.activeDocument.save();
	}

	function SavePNG(saveFile) {
		var layer = activeDocument.activeLayer,
			layerDimension = layer.bounds,
			topX = parseInt(layerDimension[0], 10),
			topY = parseInt(layerDimension[1], 10),
			bottomX = parseInt(layerDimension[2], 10),
			bottomY = parseInt(layerDimension[3], 10),
			width = bottomX - topX,
			height = bottomY - topY;

		//Copy selection
		SelectAndCopy(topX, topY, width, height);
		//Paste into new document
		PasteToNewDocument(width, height, layer.name);
		//Save Layer to PNG
		var pngSaveOptions = new PNGSaveOptions();
		pngSaveOptions.transparency = true;
		pngSaveOptions.artBoardClipping = true;
		activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);

		//Close temp doc
		CloseDoc(false);

		//Set original document as active
		app.activeDocument = app.documents.getByName(docName);
	}

	function SaveJPEG(saveFile) {
		var jpegSaveOptions = new JPEGSaveOptions();
		jpegSaveOptions.quality = prefs.fileQuality;
		activeDocument.saveAs(saveFile, jpegSaveOptions, true, Extension.LOWERCASE);
	}

	function main() {
		// two quick checks
		if (!okDocument()) {
			alert("Document must be saved and be a layered PSD.");
			return;
		}
		//var len = activeDocument.layers.length;

		exportData = '';
		// user preferences
		prefs = new Object();
		prefs.fileType = "PNG";
		prefs.fileQuality = 12;
		//prefs.filePath = app.activeDocument.path;
		prefs.filePath = directory;
		prefs.count = 0;

		//instantiate dialogue
		//Dialog();
		//hideLayers(activeDocument);
		//saveLayers(activeDocument);
		//toggleVisibility(activeDocument);
		//alert("Saved " + prefs.count + " files.");

		//Get all selected layers
		var selLayers = getSelectedLayersIdx();
		//get selected layers info
		//exportAllLayersInfo(false);

		hideLayers(activeDocument);
		//SaveDoc(true);

		for (var i = 0; i < selLayers.length; i++) {
			selectLayerByIndex(selLayers[i]);
			saveLayers(activeDocument.activeLayer);
		}

		showLayers(activeDocument);
		//SaveDoc(true);

		alert("Successfully saved " + prefs.count + " files to: \n\n" + directory);
	}

	function selectLayerByIndex(index, add) {
		add = (add == undefined) ? add = false : add;
		var ref = new ActionReference();
		ref.putIndex(charIDToTypeID("Lyr "), index);
		var desc = new ActionDescriptor();
		desc.putReference(charIDToTypeID("null"), ref);
		if (add) desc.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
		desc.putBoolean(charIDToTypeID("MkVs"), false);
		try {
			executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
		} catch (e) {}
	};


	function getSelectedLayersIdx() {
		var selectedLayers = new Array;
		var ref = new ActionReference();
		ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
		var desc = executeActionGet(ref);
		if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
			desc = desc.getList(stringIDToTypeID('targetLayers'));
			var c = desc.count
			var selectedLayers = new Array();
			for (var i = 0; i < c; i++) {
				try {
					activeDocument.backgroundLayer;
					selectedLayers.push(desc.getReference(i).getIndex());
				} catch (e) {
					selectedLayers.push(desc.getReference(i).getIndex() + 1);
				}
			}
		} else {
			var ref = new ActionReference();
			ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
			ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
			try {
				activeDocument.backgroundLayer;
				selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
			} catch (e) {
				selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")));
			}
			var vis = app.activeDocument.activeLayer.visible;
			if (vis == true) app.activeDocument.activeLayer.visible = false;
			var desc9 = new ActionDescriptor();
			var list9 = new ActionList();
			var ref9 = new ActionReference();
			ref9.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
			list9.putReference(ref9);
			desc9.putList(charIDToTypeID('null'), list9);
			executeAction(charIDToTypeID('Shw '), desc9, DialogModes.NO);
			if (app.activeDocument.activeLayer.visible == false) selectedLayers.shift();
			app.activeDocument.activeLayer.visible = vis;
		}
		return selectedLayers;
	};

	function hideLayers(ref) {
		if (ref.layers) {
			var len = ref.layers.length;
			for (var i = 0; i < len; i++) {
				var layer = ref.layers[i];
				if (layer.typename == 'LayerSet') hideLayers(layer);
				else layer.visible = false;
			}
		} else {
			var layer = ref;
			if (layer.typename == 'LayerSet') hideLayers(layer);
			else layer.visible = false;
		}
	}

	function showLayers(ref) {
		if (ref.layers) {
			var len = ref.layers.length;
			for (var i = 0; i < len; i++) {
				var layer = ref.layers[i];
				if (layer.typename == 'LayerSet') showLayers(layer);
				else layer.visible = true;
			}
		} else {
			var layer = ref;
			if (layer.typename == 'LayerSet') showLayers(layer);
			else layer.visible = true;
		}
	}

	function toggleVisibility(ref) {
		if (ref.layers) {
			var len = ref.layers.length;
			for (var i = 0; i < len; i++) {
				var layer = ref.layers[i];
				layer.visible = !layer.visible;
			}
		} else {
			var layer = ref;
			layer.visible = !layer.visible;
		}
	}

	function saveLayers(ref) {
		if (ref.layers) {
			var len = ref.layers.length;
			// rename layers top to bottom
			for (var i = 0; i < len; i++) {
				var layer = ref.layers[i];
				if (layer.typename == 'LayerSet') {
					// recurse if current layer is a group
					hideLayers(layer);
					saveLayers(layer);

				} else {
					// otherwise make sure the layer is visible and save it
					layer.visible = true;
					saveImage(layer.name);
					layer.visible = false;
				}
			}
		} else {
			var layer = ref;
			if (layer.typename == 'LayerSet') {
				// recurse if current layer is a group
				hideLayers(layer);
				saveLayers(layer);

			} else {
				// otherwise make sure the layer is visible and save it
				layer.visible = true;
				saveImage(layer.name);
				layer.visible = false;
			}
		}
	}

	function saveImage(layerName) {
		var handle = getUniqueName(prefs.filePath + "/" + layerName);
		prefs.count++;

		if (prefs.fileType == "PNG") {
			SavePNG(handle);
		} else {
			SaveJPEG(handle);
		}
	}

	function getUniqueName(fileroot) {
		// form a full file name
		// if the file name exists, a numeric suffix will be added to disambiguate

		var filename = fileroot;
		for (var i = 1; i < 100; i++) {
			var handle = File(filename + "." + prefs.fileType);
			if (handle.exists) {
				filename = fileroot + "-" + padder(i, 3);
			} else {
				return handle;
			}
		}
	}

	function padder(input, padLength) {
		// pad the input with zeroes up to indicated length
		var result = (new Array(padLength + 1 - input.toString().length)).join('0') + input;
		return result;
	}

	/*
	function Dialog() {
	    // build dialogue
	    var dlg = new Window ('dialog', 'Select Type'); 
		dlg.saver = dlg.add("dropdownlist", undefined, ""); 
		dlg.quality = dlg.add("dropdownlist", undefined, "");


	    // file type
	    var saveOpt = [];
		saveOpt[0] = "PNG"; 
		saveOpt[1] = "JPG"; 
		for (var i=0, len=saveOpt.length; i<len; i++) {
			dlg.saver.add ("item", "Save as " + saveOpt[i]);
		}; 
		
	    // trigger function
		dlg.saver.onChange = function() {
	        prefs.fileType = saveOpt[parseInt(this.selection)]; 
			// turn on additional option for JPG
	        if(prefs.fileType==saveOpt[1]){
	            dlg.quality.show();
	        } else {
	            dlg.quality.hide();
	        }
	    }; 
		  	   
		// jpg quality
	    var qualityOpt = [];
		for(var i=12; i>=1; i--) {
	        qualityOpt[i] = i;
	        dlg.quality.add ('item', "" + i);
		}; 

	    // trigger function
		dlg.quality.onChange = function() {
			prefs.fileQuality = qualityOpt[12-parseInt(this.selection)];
		};

	    // remainder of UI
		var uiButtonRun = "Continue"; 

		dlg.btnRun = dlg.add("button", undefined, uiButtonRun ); 
		dlg.btnRun.onClick = function() {	
			this.parent.close(0); }; 

	    dlg.orientation = 'column'; 

		dlg.saver.selection = dlg.saver.items[0] ;
		dlg.quality.selection = dlg.quality.items[0] ;
		dlg.center(); 
		dlg.show();
	}
	*/

	function okDocument() {
		// check that we have a valid document

		if (!documents.length) return false;

		var thisDoc = app.activeDocument;
		var fileExt = decodeURI(thisDoc.name).replace(/^.*\./, '');
		return fileExt.toLowerCase() == 'psd'
	}

	function exportAllLayers() {
		function showError(err) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
		}

		try {
			// suspend history for CS3 or higher
			if (parseInt(version, 10) >= 10) {
				activeDocument.suspendHistory('Save Layers', 'main()');
			} else {
				main();
			}
		} catch (e) {
			// report errors unless the user cancelled
			if (e.number != 8007) showError(e);
		}
	}
};
