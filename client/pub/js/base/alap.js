/**
 *ALAP hasznos kis function-ok
 *@description  - ALAP hasznos kis function-ok
 *
 * @return
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/

/**
 *
 * @Folyamatban
 * @returns jQuery dialog object
 * @author Nagy Péter
 * @version 1.01.001
 * @params:{uzeent:'',title:''}
 * 
 **/
function getFolyamatban(param) {
  
  if ($(".ui-dialog").exists()) {
     $(".ui-dialog").css("z-index","100");
  }
  var u = '<span class="hiba" >'+param.uzenet+'</span>';
  u = u + '<br/><span class="hiba" >Kérem várjon!</span>';
  //if (param.uzenet=="")
  //{
   //u = u + '<br/><span class="hiba" >Kérem várjon!</span>';
  //}
          
  var t = "Hiba...."
  var uzenetDialog  = "";
  
  if ($("#folyamatban").exists()) {
   var uzenetDialog  = $('#folyamatban')
                      .html(u)
                      .dialog({'title':param.title,
                                'autoOpen':true,
                                'draggable':false,
                                'modal':true,
                                'resizable':false,
                                'dialogClass':'alert',
                                'closeOnEscape':true,
                                'close':function(){},
                                'open': function(event, ui) {
                                    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                                 },
                                'width':'auto',
                                
                                'minHeight':220});
  }else{
     var uzenetDialog  = $('<div id="folyamatban"/>')
                         .appendTo("body")
                         .html(u)
                         .dialog({'title':param.title,
                                   'autoOpen':true,
                                   'draggable':false,
                                   'modal':true,
                                   'resizable':false,
                                   'dialogClass':'alert',
                                   'closeOnEscape':true,
                                   'close':function(){},
                                   'open': function(event, ui) {
                                       $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                                    },
                                   'width':'auto',
                                   'minHeight':220});
  }
  return uzenetDialog;
}

/**
 *
 * @
 * @returns jQuery object
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/
 jQuery.fn.visible = function() {
     return this.css('visibility', 'visible');
 };
 
 jQuery.fn.invisible = function() {
     return this.css('visibility', 'hidden');
 };
 
 //jQuery.fn.visibilityToggle = function() {
 //    return this.css('visibility', function(i, visibility) {
 //        return (visibility == 'visible') ? 'hidden' : 'visible';
 //    });
 //};


/**
 *
 * @IE ellen.script(böngésző ellen script)
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/

function isie(){
 return ((document.all)? true : false);
}

/**
 *
 * @IE ellen.script(böngésző ellen script)
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/
	function	isIE() {
		return ((navigator.appName == 'Microsoft Internet Explorer')
						|| ((navigator.appName == 'Netscape')
								&& (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
	}
	
	navigator.sayswho= (function(){
			var ua= navigator.userAgent, tem,
			M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
			if(/trident/i.test(M[1])){
					tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
					return 'IE '+(tem[1] || '');
			}
			if(M[1]=== 'Chrome'){
					tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
					if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
			}
			M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
			if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
			return M.join(' ');
	})();
	
//console.log(isIE());
//function getInternetExplorerVersion()
//{
//  var rv = -1;
//  if (navigator.appName == 'Microsoft Internet Explorer')
//  {
//    var ua = navigator.userAgent;
//    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
//    if (re.exec(ua) != null)
//      rv = parseFloat( RegExp.$1 );
//  }
//  else if (navigator.appName == 'Netscape')
//  {
//    var ua = navigator.userAgent;
//    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
//    if (re.exec(ua) != null)
//      rv = parseFloat( RegExp.$1 );
//  }
//  return rv;
//}
//function isIE(){
//	return ((document.all)? true : false);
//}



/**
 *
 * @IE ellen.script(böngésző ellen script)
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/

function ablakKez(parentWObj){
	window.close();
	parentWObj.focus();
}




/**
 *
 * @httpRequest visszaadott érték szür
 * @returns nincs
 * @param xmlDoc{string}
 * @param adat {string}
 * @returns vegtartalom {string}
 * @author Nagy Péter
 * @version 1.01.001
 * @deprecated
 **/

function VErtekAtalak(xmlDoc,adat){
  //alert(adat);
 var kezdTartalom = xmlDoc.getElementsByTagName(adat)[0].childNodes[0].nodeValue;
 //alert(kezdTartalom);
 var vegTartalom = kezdTartalom;
 
 while( vegTartalom.match('×') != null && vegTartalom.match('÷') != null  ){
  vegTartalom = vegTartalom.replace('×','<');
  vegTartalom = vegTartalom.replace('÷','>');		
 }
 
 return vegTartalom;
}

/**
 *
 * @ekezet konvetalo ha kell valminek
 * @returns
 * @author Nagy Péter
 * @version 1.01.001
 * @deprecated
 **/


function ekezetKonvert(str){
	
		var ekezetTK = Array("á", "é", "í", "ú", "ü", "ű", "ó", "ö", "ő", " ");
		var ekezetTN = Array("Á", "É", "Í", "Ú", "Ü", "Ű", "Ó", "Ö", "Ő", " ");
		var text = new RegExp();
		for (var i = 0; i < 10; i++){ 
		 //var evstr=eval('/'+ekezetTOmb[i]+'/g');
			text.compile(ekezetTK[i], "g");
			str = str.replace(text, "{"+i);
			text.compile(ekezetTN[i], "g");
			str = str.replace(text, "}"+i);
		}
		return str;
}


/**
 *
 * @GetXmlHttpObject
 * @returns xmlHttpO {ActiveXObject("Msxml2.XMLHTTP")||ActiveXObject("Microsoft.XMLHTTP")}
 * @author Nagy Péter
 * @version 1.01.001
 * @deprecated
 * 
 **/


var xmlHttp;
function GetXmlHttpObject(){
 var xmlHttpO = new Object();
 try{
  // Firefox, Opera 8.0+, Safari
  xmlHttpO = new XMLHttpRequest();
 }
 catch (e){
  // Internet Explorer
  try {
   xmlHttpO = new ActiveXObject("Msxml2.XMLHTTP");
  }
  catch (e) {
   xmlHttpO = new ActiveXObject("Microsoft.XMLHTTP");
  }
 }
 return xmlHttpO;
}

/**
 *
 * @
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @deprecated
 * 
 **/
function docId(ObjId){
 return document.getElementById(ObjId);
}

/**
 *
 * @
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/

jQuery.fn.aDialog = function(adat,title,html){
/*
	MAJD JAVITANI KELL A DOLGOKAT BENNE
	EGY ERTELMES SAJATOTT KELL CSINALNI
*/		
 if ($(".ui-dialog").exists()) {
  $(".ui-dialog").css("z-index","100");
 }
	$(this).text(adat);
	$(this).html(html);	
	$(this).dialog(
	{
		'title':title,
		'autoOpen':false,
		'draggable':false,
		
		'modal':true,
		'resizable':false,
		'buttons':{
			'Ok':{
					text:'OK',
					id:'ok_gomb',
					click:function(e){
						$(this).dialog('close');
						$(this).dialog( "destroy" );
						$(this).empty();
       if ($(".ui-dialog").exists()) {
        $(".ui-dialog").css("z-index","101");
       }
					}
				}
		},
		
		'dialogClass':'alert',
		'closeOnEscape':true,
		'close':function(){
    if ($(".ui-dialog").exists()) {
     $(".ui-dialog").css("z-index","101");
    }
   },
  //'closeOnEscape':true,
  //'close':function(){},
  //'open': function(event, ui) {
      //$(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
   //},
		'width':'auto',
		'minHeight':220
	});
	$(this).dialog('open');
	return this;
}
		
/**
 *
 * @
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @ 2 SELECT ELEMEIT LEHET SORRENDBEN PAKOLGATNI
 * @param {object} arg1 source select
 * @param {object} arg2 target select
 * @param {string} arg3 mod  add||clone
 * @param {integer} arg4 1||0 ? I don't know
 * 
 * 
 **/

function ListElemMozgat(aktobj,celobj,mod,melySelect){



  
 var selOpts   = aktobj.options;
 var selOptInd = selOpts.selectedIndex;
//HA NEM URES AKT OBJECT.
//AKKOR AZ ELEMET MOZGATOM


 if(selOpts.length != 0 && selOptInd != -1 ){
  var selOptInd = selOpts.selectedIndex;
  var selOpt = selOpts[selOptInd];
  var selOptClon  = selOpt.cloneNode(true);
  var selOptValue = selOpt.getAttribute('value');
  var celObj  = docId(celobj);
  var celOpts = celObj.options;
  var celOptsLength = celOpts.length;
  var uzenetMezo = docId(uzenetMId);
  var newElem = ((mod == 'add')? selOpts[selOptInd] : selOpt.cloneNode(true));
	
  if(celOpts.length == 0){
   (isie())? celObj.options.appendChild(newElem) : celObj.options.add(newElem);
  }
  else{
   var beszJelzo = true;
   var pozJelzo  = true;
	 
   var pozElem   = '';
//HA AZ AKT OBJT ELEME MEGEGYEZIK A CEL AKKOR NEM LESZ BESZURAS
//HA EZT KIVESZEM ANNYISZOR SZUROMBE ..
   for(var i = 0; i<celOptsLength; i++){
    if(selOptValue == celOpts[i].getAttribute('value') && beszJelzo == true){
			beszJelzo = false;
    }
   }
	 
   if(beszJelzo){
    db = 0;
    for(var i = 0;i<celOptsLength;i++){
     
     if(Number(selOptValue) < Number(celOpts[i].getAttribute('value'))){
      if(db == 0){
       pozJelzo = false;
       pozElem  = celOpts[i];
       db++;  
      }
     }
     else{
      pozElem = celOpts[i];
     }
    }
		
    if(!pozJelzo){
     celObj.insertBefore(newElem,pozElem);
    }
    else{
     (isie())? celObj.options.appendChild(newElem) : celObj.options.add(newElem);
    }
   }
	 
  }
  if(mod != 'add' && melySelect == 1 ){
   aktobj.remove(selOptInd)
  }
 }
  
}

/**
 *
 * @
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @HTML elem generalasa
 * @deprecated
 **/

function  ElemGenerator(elem,felem,id){
	var newElem = document.createElement(elem);
	newElem.id  = id;
	felem.appendChild(newElem);
return newElem;
}



/**
 *
 * @
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @ez egy nagyon hasznost kis dolog
 * @az elem pozic. adja vissza
 * @ez autocomplite tooltiphez
 * @param {object} arg1 source
 * @param {object} arg2 target
 **/

function findPos(obj,obj2) {
 var curleft = curtop = 0;
 if (obj.offsetParent) {
	var  db=0;
  do{
   curleft += obj.offsetLeft;
   curtop  += obj.offsetTop;
	 db++;
	//mert igy lehet relativan megadni az elhelyeszkedeset itt +-ja az az elemekhez viszonyitott offset
	//nagyon király
  }while (obj = obj.offsetParent);
	
 }
 obj2.style.left = (curleft+((isie())? 1 : -1))+'px';
 obj2.style.top  = (curtop+23)+'px';
}


/**
 *
 * @
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @sajat autocom. pszakkep
 * @egermozgasa elvileg nem  hasznalom
 **/


function egerMozgas(obj){

 if(docId('polgSzS')){
  var lista = docId('polgSzS');  
  var i = 1;
  var child = obj;

  while( (child = child.previousSibling) != null ) 
   i++;
   
  if(docId('light')){
   
   if(aktpos < i){//akkor a le
    docId('light').className = '';
    docId('light').setAttribute('id','');
    obj.className = 'light';
    obj.setAttribute('id','light');
    aktpos = i;
    
     if( i < old_le ){
         lemuvj = false;
      }
      else if(i >= old_le){
         lemuvj  = true;
         old_fel = (i-6)+1;
      }
   }
   else if( aktpos > i){// fel
    docId('light').className = '';
    docId('light').setAttribute('id','');
    obj.className = 'light';
    obj.setAttribute('id','light');
    aktpos = i;
      if( i > old_fel ){
         felmuvj = false;
      }
      else if(i <= old_fel){
         felmuvj = true;
         old_le  = (i+6)-1;
      }
      
   }
   else{
    //alert('Egyenlő!');
   }
  }
  else{
   obj.className = 'light';
   obj.setAttribute('id','light');
   aktpos = i;
    if( i < old_le ){
         lemuvj = false;
      }
      else if(i >= old_le){
         lemuvj  = true;
         old_fel = (i-6)+1;
      }
  }
 }
}

/**
 *
 * @aktulais datumom adja. a option parametereknek megf
 * @returns keltezes datum strin
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/

  var getDate = function(option){
   var _date=new Date();
   var _options = ((option!=null)? option:{  year: 'numeric', month: 'long', day: 'numeric' });
   return _date.toLocaleString('hu-HU',_options);
 } 

/**
 *
 * @DATUM VISSZA ADAJA A DATUMOT EV HONAP NAP TOMB
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/



 function oraperc(o,e)
{
		if(NumberOnly(e)==false) return false;
		if(document.all?true:false) keynum = e.keyCode; //IE
		else keynum = e.which; // Netscape/Firefox/Opera
		keychar = String.fromCharCode(keynum);
		
		var regExpSzam = /^\d/;
		if(!regExpSzam.test(keychar)) return true;
		
		switch(o.value.length)
		{
				case 0:
						if(keychar<3)
								{o.value=keychar;return false;}
						else
								o.value="0";
				case 1:
						if(o.value+keychar>23)
								return false;
						o.value+=keychar;
						keychar=null;
						
				case 2:
						o.value+=":";
						if(keychar==null)
								return false;
				
				case 3:
						if(keychar<6)
								{o.value+=keychar;return false;}
						else
								o.value+='0';
				case 4:
						o.value+=keychar;
				default:
						return false;
		}
}



/**
 *
 * @DATUM VISSZA ADAJA A DATUMOT EV HONAP NAP TOMB
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/



function stringToDate(datumStringTomb,sepChar){
 var ev,honap,nap;
 var visszDatumTomb = new Array();
 for( var i = 0;i<datumStringTomb.length;i++){
  var datDate =  new Date();
  var stringDarabTomb = datumStringTomb[i].split(sepChar);
  ev    = stringDarabTomb[0];
  honap = stringDarabTomb[1]-1;//ez lehet hogy nem is kell
  nap   = stringDarabTomb[2];
  visszDatumTomb[i] = datDate.setFullYear(ev,honap,nap);
 }
 return visszDatumTomb;
   //docId('label').innerHTML=(datDate2-datDate1)/(24*60*60*1000)+" nap a különbség";
   //alert((datDate2-datDate1)/(24*60*60*1000))
}

/**
 *
 * @A leütött bill.száma
 *
 * @param e {event} 
 * @returns keynum {string}
 * @author Nagy Péter
 * @version 1.01.001
 *
 **/


function KeyNum( e ){
 var keynum;
 if( window.event ){
  keynum = e.keyCode;
 }
 else if( e.which ){
  keynum = e.which;
 }
 return keynum;
}



/**
 *
 * @A leütött bill.száma
 *
 * @param e {event} 
 * @returns keynum {string}
 * @author Nagy Péter
 * @version 1.01.001
 *
 **/
 
 

function NumberOnly(e)
{
	if(e.charCode==0) return true;
	isie()?keynum = e.keyCode:keynum = e.which;
	if(keynum==13) return true;
	keyChar = String.fromCharCode(keynum);
	reNumber = /\d/;
	if(reNumber.test(keyChar)) return true;
	return false;
}
  
  
  
/**
 *
 * @JQUERY
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @DATUM VALIDALO
 * 
 **/	


//DatumValid('1956.02.30','.');

function DatumValid(object,sepChar){
	
  var datumStr   = object.value.split(sepChar);
  var datmillsec = stringToDate(new Array(object.value),sepChar);//tomb,sepcar
	var dat1   = new Date(datmillsec[0]);
	var ev     = dat1.getUTCFullYear();
	var honap  = ( (dat1.getUTCMonth()+1) < 10 )?'0'+(dat1.getUTCMonth()+1) : dat1.getUTCMonth()+1;
	var nap    = ( dat1.getUTCDate() < 10 )?'0'+(dat1.getUTCDate()):dat1.getUTCDate();
	var tDatum = ev+'.'+honap+'.'+nap;
	if(  object.value == tDatum ){
   return true;
	}
	else{
	 return false;
	}
 }
 
 	 

 

/**
 *
 * @JQUERY
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @SAJAT TOOLTIP MOZGATASOHOZ XY POZ.
 * @Itt a scroll-erteket szamolja ki
 * 
 **/	
 
 
	var egerx;
	var egery;
	var mozogHat = false;
  $('body').on({
    mouseover:function(event){
      var scrollErtekY =' ';
      var scrollErtekX = '';
      if(event.pageY && event.pageX){//MOZ
        scrollErtekY=document.documentElement.scrollTop;//event.pageY
        scrollErtekX=document.documentElement.scrollLeft;//event.pageX
      }
      else if (event.clientY && event.clientX){//IE
      scrollErtekY = (document.documentElement.scrollTop ?
                              document.documentElement.scrollTop :
                              document.body.scrollTop);
      scrollErtekX = (document.documentElement.scrollLeft ?
                              document.documentElement.scrollLeft :
                              document.body.scrollLeft);
      }
      else {
      }
//ha httprequest-et használok akkor event.clientX is kell nem tudom hogy miért
      egerx = (scrollErtekX);
      egery = (scrollErtekY);
      NemMozogHat();
    }
  });
	
/**
 *
 * @JQUERY
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @SAJAT TOOLTIP MOZGATASOHOZ
 * @Itt jelenitem meg a tooltippet
 * 
 **/

  $('#feltetelek').on({
    mouseover:function(event){
      
	var jelzo = 0;
	var obj = $('#tooltip');
	var belEgerX = event.clientX;
	var belEgerY = event.clientY;
	var obj = document.getElementById('tooltip');

	if(!mozogHat){
		if( jelzo == 0 ){
			obj.style.position        = "absolute";
			obj.style.backgroundColor = "#FFFFFF";
			obj.style.border          = "4px outset #000000";
			obj.style.font="normal normal bold 12px Times New Roman";
			obj.style.top        = (((belEgerY)+egery)+10)+"px";
			obj.style.left       = (((belEgerX)+egerx)+10)+"px";
			tooltipContent($('#tooltip').html($('#feltetelkontener').html()));
		}else{
			var selectOffsetL  = obj.offsetLeft;
			var selectOffsetT  = obj.offsetTop;
			obj.className    ='tooltip';
			obj.style.top    = selectOffsetT+"px";
			obj.style.left   = selectOffsetL+500+"px";
		}
		mozogHat = true;
	}
			
    }
  });
	
	
	
/**
 *
 * @JQUERY
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @SAJAT TOOLTIP MOZGATASOHOZ
 * @Itt veszem rejtem el a  tooltippet
 * 
 **/	
	
  $('#feltetelek').on({
    mouseout:function(event){
      if( $($('#tooltip').exists() )){
        $('#tooltip').toggleClass('elrejt');
        $('#tooltip').empty();
        $('#tooltip').css(  "border",'none' );
        mozogHat = false;
      }
    }
  });

/**
 *
 * @JQUERY
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @SAJAT TOOLTIP MOZGATASOHOZ
 * @A BODYBN TORTENO MOZGAS MIATT KELL
 * 
 **/	
	

	function NemMozogHat(){
		mozogHat = false;
	}
	
	
	
/**
 *
 * @JQUERY
 * @returns nincs
 * @author Nagy Péter
 * @version 1.01.001
 * @SAJAT TOOLTIP MOZGATASOHOZ
 * @TOOLTIP TARTALOM
 * 
 **/	
	
	function tooltipContent(obj,content){
		obj.html(content);
		if(	$('#tooltip').exists() ){
			$('#tooltip').toggleClass('elrejt');
		}
	}
 
/**
 *
 * @author Nagy Péter
 * @version 1.01.001
 * @SAJAT TRIM FUGGVENY.
 * 
 **/	
if(	typeof String.prototype.trim	!==	'function'	){
	String.prototype.trim	=	function(){
		return this.replace(/^\s+|\s+$/g,'');
	}
}
	 
/**
 *
 * @JQUERY
 * @return
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/

 jQuery.fn.exists = function(){return jQuery(this).length>0;}


//
//$('input[ id^="pipa_"]').live({
//   click:function(){
//    docId("layer").className='elrejt';
//    docId("beKarbContainer").className='elrejt';
//   }
//  });


/**
 *
 * @
 * @return boolean 
 * @author Nagy Péter
 * @version 1.01.001
 * @description a két dátum object  jövőbeni dátumot tartalmaz-e
 * @deprecated
 **/



function datumJovo(datObj1,datObj2,idTart){
  
  var check = '/[\/.-]/';
  var datK  = datObj1.value.replace(/[\/.-]/gi, '-');
  var datI  = datObj2.value.replace(/[\/.-]/gi, '-');
  datK  = datK.split('-');
  datI  = datI.split('-');
  
  var datumK = new Date(datK[0],((datK[1])-1),datK[2]);
  var datumI = new Date(datI[0],((datI[1])-1),datI[2]);
  
  var dK = Date.UTC(datK[0],((datK[1])-1),datK[2]);
  var dI = Date.UTC(datI[0],((datI[1])-1),datI[2]);
  var today =new Date();
  today.setDate(today.getDate());
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  
  
  var kul = (datumI - datumK);
  var minutes = 1000 * 60;
  var hours   = minutes * 60;
  var days    = hours * 24;
  var years   = days * 365;
  var millsec = dI-dK;
  
  //return kul/eval(idTart);
  var vAdat= true;
  vAdat = (today  < datumK  && today < datumI )? true : false;
  return vAdat;
  
 }
 
 
 /**
 *
 * @
 * @return különbség
 * @author Nagy Péter
 * @version 1.01.001
 * @description a két dátum között különbséget adja vissza a kívánt formában idTart
 * @deprecated
 * 
 **/
 
 

 function datumKulSz(datObj1,datObj2,idTart){

  var check = '/[\/.-]/';
  var datK  = datObj1.value.replace(/[\/.-]/gi, '-');
  var datI  = datObj2.value.replace(/[\/.-]/gi, '-');
  datK  = datK.split('-');
  datI  = datI.split('-');
  
  var datumK = new Date(datK[0],((datK[1])-1),datK[2]);
  var datumI = new Date(datI[0],((datI[1])-1),datI[2]);
  
  var dK = Date.UTC(datK[0],((datK[1])-1),datK[2]);
  var dI = Date.UTC(datI[0],((datI[1])-1),datI[2]);
  
  var kul = (datumI - datumK);
  var minutes = 1000 * 60;
  var hours   = minutes * 60;
  var days    = hours * 24;
  var years   = days * 365;
  var millsec = dI-dK;
  
  return kul/eval(idTart);
 }



/**
 *
 * @
 * @return table object
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/


/**
 *
 * @
 * @return table object
 * @author Nagy Péter
 * @version 1.01.001
 * 
 **/


jQuery.fn.createTable = function(t_adatok,t_attr,row_id){
	var thead	  =	"";
	var table 	= document.createElement("table");
			table.setAttribute("id",t_attr.id);
			
	var thead	=	false;

	for(var i = 0; i < t_adatok.length; i++){
		
		var row = table.insertRow(table.rows.length);
		var header 	= table.createTHead();
		
		if (!thead) {
			var header 	= table.createTHead();
			var h_row 	= header.insertRow(0);
			var h_cell;
		}
		
		for (key in t_adatok[i]) {
			row.setAttribute("id","_"+t_adatok[i][row_id]);
			if (!thead) {
				h_cell	=	document.createElement('th');
				//h_cell						=	h_row.insertCell(h_row.cells.length);
				h_cell.innerHTML 	= key;
				h_row.appendChild(h_cell);
   }
    var cell 					= row.insertCell(row.cells.length);
      cell.setAttribute("data-name",key);
      cell.innerHTML = ((t_adatok[i][key])?t_adatok[i][key]:''); 
		}
		thead	=	true;
	}
	$(this).html(table);
	return $(this).find("table");
};




/**
 *
 * @
 * @return 
 * @author Nagy Péter
 * @version 1.01.001
 * @description a trim függvényt valósítom meg
 * 
 **/




function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}
 
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}




/**
 *
 * @
 * @return 
 * @author Nagy Péter
 * @version 1.01.001
 * @description textarea maxlength attributomot valósítom meg
 * 
 * 
 **/

/*textarea:lekezelése*/		
		$('textarea[maxlength]').on({
   keydown:function(){
     var max =$(this).attr('maxlength');
     if($(this).val().length > max ){
       $(this).val($(this).val().substr(0, $(this).attr('maxlength')));
     }
   },
   focus:function(){
    $(this).css({backgroundColor: '#e5fff3'});
   },
    blur:function(){
    $(this).css({backgroundColor: ''});
   }
  });



/*DÁTUM:  Dávid*/


Date.prototype.getMonthLong = function()
{
	var honap = this.getMonth()+1;
	honap += "";
	if(honap.length==1) honap = "0" + honap;
	return honap;
}

Date.prototype.getDateLong = function()
{
	var x = this.getDate();
	x += "";
	if(x.length==1) x = "0" + x;
	return x;
}

Date.prototype.getHoursLong = function()
{
	var x = this.getHours();
	x += "";
	if(x.length==1) x = "0" + x;
	return x;
}

Date.prototype.getMinutesLong = function()
{
	var x = this.getMinutes();
	x += "";
	if(x.length==1) x = "0" + x;
	return x;
}

Date.prototype.getSecondsLong = function()
{
	var x = this.getSeconds();
	x += "";
	if(x.length==1) x = "0" + x;
	return x;
}

Date.prototype.getDateString = function()
{
	return this.getFullYear + "-" + this.getMonthLong + "-" + this.getSecondsLong;
}

function createSelection(field, start, end){
	if( field.createTextRange )
	{
		var selRange = field.createTextRange();
		selRange.collapse(true);
		selRange.moveStart('character', start);
		selRange.moveEnd('character', end-start);
		selRange.select();
	}
	else if( field.setSelectionRange )
	{
		field.setSelectionRange(start, end);
	}
	else if( field.selectionStart )
	{
		field.selectionStart = start;
		field.selectionEnd = end;
	}	
	field.focus();
}

function CsakSzamIrhatoAzInputba(obj, event){
	vezerlok = Array(8, 9, 13, 37, 38, 39, 40, 46, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123);
	if (window.event)
	{
		keynum = event.keyCode; //IE
	}
	else if (event.which) // Netscape/Firefox/Opera
	{
		keynum = event.which;
	}
	
	if ((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
	{
		return "szam";
	}
	else
	{
		for (var i = 0; i < vezerlok.length; i++)
		{
			if (keynum == vezerlok[i])
				return "vezerlo";
		}
		return false;
	}
}


function DatumEllenorizKP(o,e,optional_kiegeszites,optional_type,optional_minYear,optional_maxYear,
			  optional_dateSeparator,optional_timeSeparator,optional_dateTimeSeparator)
{
	
	if(NumberOnly(e)==false) return false;
	
        if(o==undefined || e==undefined) return false;
        if(o.type!="text" || e.type!="keypress") return false;

	if(document.all?true:false) keynum = e.keyCode; //IE
	else keynum = e.which; // Netscape/Firefox/Opera
		
	keychar = String.fromCharCode(keynum);
	var regExpSzam = /^\d/;
	//if(!regExpSzam.test(keychar) && !keynum==8) return;
	if(!regExpSzam.test(keychar)) return;
	
	var myDate=new Date();
	var _minYear = (myDate.getFullYear()-100);
	var _maxYear = (myDate.getFullYear()+100);
	
	if(optional_dateSeparator==undefined || optional_dateSeparator=="" || optional_dateSeparator.length!=1) var separator="-";
	else var separator=optional_dateSeparator;
	
	if(optional_timeSeparator==undefined || optional_timeSeparator=="" || optional_timeSeparator.length!=1) var separator2=":";
	else var separator2=optional_timeSeparator;
	
	if(optional_dateTimeSeparator==undefined || optional_dateTimeSeparator=="" || optional_dateTimeSeparator.length!=1) var separator1=" ";
	else var separator1=optional_dateTimeSeparator;
	
	
	
	
	if(optional_type==undefined || optional_type=="") var type=3;
	else
	{
		
		
		//var yearLength = myDate.getFullYear() + ""; yearLength = yearLength.length;
		
		if(optional_type=="ev") var type=1,typelength=4;
		
		else if(optional_type=="honap")	var type=2,typelength=7;
		
		else if(optional_type=="nap") var type=3,typelength=10;
		
		else if(optional_type=="ora") var type=4,typelength=13;
		
		else if(optional_type=="perc") var type=5,typelength=16;
		
		else if(optional_type=="masodperc") var type=6,typelength=19;
		
		else var type=3;
		
	}
	
	if(optional_minYear==undefined || optional_minYear=="") var minYear=_minYear;
	else var minYear=optional_minYear;
	
	if(optional_maxYear==undefined || optional_maxYear=="") var maxYear=_maxYear;
	else var maxYear=optional_maxYear;
	
	if(optional_kiegeszites==undefined || optional_kiegeszites=="" || optional_kiegeszites=='true') var kieg=true;
	else var kieg=false;
	
	minYear+="";
	maxYear+="";
	
	if(kieg)
	{
		var mostDatum = myDate.getFullYear(); mostDatum+="";
		if(type>1) {mostDatum += separator + myDate.getMonthLong();}
		if(type>2) {mostDatum += separator + myDate.getDateLong();}
		if(type>3) {mostDatum += separator1 + myDate.getHoursLong();}
		if(type>4) {mostDatum += separator2 + myDate.getMinutesLong();}
		if(type>5) {mostDatum += separator2 + "00";}
		//if(type>5) {mostDatum += separator2 + myDate.getSecondsLong();}
		
		if(o.selectionStart != o.selectionEnd)
		{var selStart = o.selectionStart;var selEnd = o.selectionEnd;}
		else{var selStart = 0;var selEnd = 0;}
	}
	
	var meddig = 0;
	if(!selStart) meddig=o.value.length;
	else meddig=selStart;

	var str = o.value.substr(0,meddig).concat(keychar);	
	len = str.length;
	var olength = o.value.length - selStart;
	
	if(isie())
	{
		var range = document.selection.createRange();
		if(range && range.text != "")
		{
			// Calculate start and end points
			var sourceSelEnd = range.boundingLeft;
			var sourceSelStart = sourceSelEnd - range.text.length;
			len -= sourceSelEnd-sourceSelStart
			if(typelength==range.text.length) len=typelength;
		}
		
	}
	
	switch(len)
	{
		case 1:
		if(!minmax()) return false;
		o.value=str;
		if(kieg) kiegeszit_date();
		return false;
	
		case 2:
		if(!minmax()) {return false;}
		o.value=str.substr(0,len);
		if(kieg) kiegeszit_date();
		return false;
	
		case 3:
		if(!minmax()) return false;
		o.value = str.substr(0,len);
		if(kieg) kiegeszit_date()
		return false;
	
		case 4:
		if(!minmax()) return false;
		o.value = str.substr(0,len);
		if(kieg) kiegeszit_date();
		
		case 5:
		if(type>=2)
		{
			if(len==4)
			{
				o.value = str.substr(0,len) + separator;
				if(kieg) kiegeszit_date();
				return false;
			}
			else o.value = str.substr(0,len-1) + separator;
		}
		else
		{
			if(kieg) kiegeszit_date();
			return false;
		}
		
		case 6:
		if(bennevan(0,1,keychar))
		{
			o.value = o.value.substr(0,5) + keychar;
			if(kieg) kiegeszit_date();
			return false;
		}
		else o.value = o.value.substr(0,5) + "0";
		
		
		case 7:
		if(o.value.charAt(5)==1 && !bennevan(0,2,keychar))
		{
			if(kieg) kiegeszit_date();
			return false;
		}
		else if(o.value.charAt(5)==0 && keychar==0)
		{
			if(kieg) kiegeszit_date();
			return false;
		}
		o.value = o.value.substr(0,6) + keychar;
		
		case 8:
		if(type>=3)
		{
			o.value = o.value.substr(0,7) + separator;
			if(len!=8)
			{
				if(kieg) kiegeszit_date();
				return false;
			}
		}
		
		case 9:
		if(bennevan(1,3,keychar) && !(keychar==3 && o.value.substr(5,2)==2))
		{
			o.value = o.value.substr(0,8) + keychar;
			if(kieg) kiegeszit_date();
			return false;
		}
		else o.value = o.value.substr(0,8) + "0";
		
		case 10:
		var ev = o.value.substr(0,4);
		var honap = o.value.substr(5,2);
		var nap = o.value.charAt(8)+keychar;
		var d = new Date(ev,honap-1,nap);
		if(d.getFullYear()!=ev){if(kieg) kiegeszit_date();return false;}
		if(d.getMonth()+1!=honap){if(kieg) kiegeszit_date();return false;}
		if(d.getDate()!=nap){if(kieg) kiegeszit_date();return false;}
		o.value = o.value.substr(0,9) + keychar;
		
		case 11:
		if(type>=4)
		{
			o.value = o.value.substr(0,10) + separator1;
			if(len!=11)
			{
				if(kieg) kiegeszit_date();
				return false;
			}
		}
		else
		{
			if(kieg) kiegeszit_date();
			return false;
		}
		
		case 12:
		if(bennevan(0,2,keychar))
		{
			o.value = o.value.substr(0,11) + keychar;
			if(kieg) kiegeszit_date();
			return false
		}
		else
		{
			o.value = o.value.substr(0,11) + "0";
		}
		
		case 13:
		if(o.value.charAt(11)==2 && keychar>3) return false;		
		o.value = o.value.substr(0,12) + keychar;
		
		case 14:
		if(type>=5)
		{
			o.value = o.value.substr(0,13) + separator2;
			if(len!=14)
			{
				if(kieg) kiegeszit_date();
				return false;
			}
		}
		else
		{
			if(kieg) kiegeszit_date();
			return false;
		}
		
		case 15:
		if(bennevan(0,5,keychar))
		{
			o.value = o.value.substr(0,14) + keychar;
			if(kieg) kiegeszit_date();
			return false
		}
		else
		{
			o.value = o.value.substr(0,14) + "0";
		}
		
		case 16:
		o.value = o.value.substr(0,15) + keychar;
		
		case 17:
		if(type>=6)
		{
			o.value = o.value.substr(0,16) + separator2;
			if(len!=17)
			{
				if(kieg) kiegeszit_date();
				return false;
			}
		}
		
		case 18:
		if(bennevan(0,5,keychar))
		{
			o.value = o.value.substr(0,17) + keychar;
			if(kieg) kiegeszit_date();
			return false
		}
		else
		{
			o.value = o.value.substr(0,17) + "0";
		}
		
		case 19:
		if(keychar==o.value.charAt(18)) o.value=o.value.substr(0,18);
		o.value = o.value.substr(0,18) + keychar;
		return false;

		default:
		return false;
	}
	
	function bennevan(tol,ig,mit)
	{
		if(tol<=ig)
			for(var i=tol;i<ig+1;i++)
				if(tomb[i]==mit) return true;
		return false;
	}
	
	function kiegeszit_date()
	{
		len = o.value.length;
		if(o.value==mostDatum.substr(0,len))
		{
			o.value += mostDatum.substr(len);
			createSelection(o,len,o.value.length);
		}
		else if(len>10)
		{
			var nullTime = "00"+separator2+"00"+separator2+"00";
			o.value += nullTime.substr(len-11);
			createSelection(o,len,o.value.length);
		}
	}

	function minmax()
	{
		if(str.substr(0,len) < minYear.substr(0,len) || str.substr(0,len) > maxYear.substr(0,len)) return false;
		return true;
	}
}


//o: object, type=mint DatumEllenorizKp -nel
function FinalDatumCheck(o,optional_type){
	return false;
	if(optional_type==undefined || optional_type=="") {var type=3; typelength=10;}
	else
	{	
		if(optional_type=="ev") {var type=1; var typelength = 4;}
		
		else if(optional_type=="honap")
		{var type=2; var typelength=7;}
		
		else if(optional_type=="nap")
		{var type=3; var typelength=10;}
		
		else if(optional_type=="ora")
		{var type=4; var typelength=13;}
		
		else if(optional_type=="perc")
		{var type=5; var typelength=16;}
		
		else if(optional_type=="masodperc") {var type=6; var typelength=19;}
		
		else {var type=3; var typelength=19;}
	}
	
	var hiba = false;
	var str = o.value;
	if(str.length==0)
	{
		return;
	}
	else
	{
		o.value = o.value.substr(0,typelength);
		if(type>0) var ev = str.substr(0,4);
		if(type>1) var honap = str.substr(5,2);
		if(type>2) var nap = str.substr(8,2);
		if(type>3) var ora = str.substr(11,2);
		if(type>4) var perc = str.substr(14,2);
		if(type>5) var masodperc = str.substr(17,2);
		
		if(type<1) var honap="01";
		if(type<2) var nap="01";
	
		var regExpSzam = /^\d{4}/;
		if(ev && !regExpSzam.test(ev)) hiba=true;
		var regExpSzam = /^\d{2}/;
		if(honap && !regExpSzam.test(honap)) hiba=true;
		if(nap && !regExpSzam.test(nap)) hiba=true;
		if(ora && !regExpSzam.test(ora)) hiba=true;
		if(perc && !regExpSzam.test(perc)) hiba=true;
		if(masodperc && !regExpSzam.test(masodperc)) hiba=true;
		
		var d = new Date(ev,honap-1,nap);
		if(d.getFullYear()!=ev) hiba=true;
		if(d.getMonth()+1!=honap) hiba=true;
		if(d.getDate()!=nap) hiba=true;
		
		if(ev.length!=4) hiba=true;
		if(ora>23 || ora<0) hiba=true;
		if(perc>59 || perc<0) hiba=true;
		if(masodperc>59 || masodperc<0) hiba=true;
	}
	if(hiba)
	{
		o.value="";alert("Hibás dátum, törölve!");
	}
}

var tomb = Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,21,
		     23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,
		     43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59);

/*&*/




