  /**
 *FELÜLET GENERÁLÁSA
 *@description  - bármilyen html tag
 *  generálható paraméterezhető
 *- input egy {json} array||object
 *
 * @return
 * @author Nagy Péter
 * @version 1.01.003
 * 
 **/
  
  

jQuery.fn.nezetGeneralo = function(dataArray,contener,form,torles){

  
  var adatok  = dataArray;

  var _l;
  var _l_jelzo        = false;
  var _g;
  var _g_jelzo        = false;
  var existsGroup     = '';
  var existsFieldset  = '';
  var existsLegend    = '';
  var _g_id           = '';
  var table           = 'igenybevevok';
  var base_url        = $('#base_url').val();
  var megye           = (($('#_megyekod').exists())?$('#_megyekod').val().trim():'3')
                  
  

  var tarolo  = ((contener == '')? $('#igeny_kontener'):contener);
  if (torles) {
    tarolo.empty();
  }
      
  
  var lastElement = '';
  for(key in adatok){
    var existsLabel = '';
  if (adatok[key].html['tag']=='html'){
         
     if(!(jQuery.type(adatok[key].html['parent'])=== "undefined") && adatok[key].html['parent']  != ''){
      var newSpan=document.createElement('span');
          newSpan.setAttribute('id',adatok[key].html['id']);
          $(document.getElementById(adatok[key].html['parent']).appendChild(newSpan)).html(adatok[key].html['value']);
     }else{
     }
 
  }else if (adatok[key].html['tag']=='input') {
//INPUT 
//-------------EZT ki kell emelni majd mert ha valtoztani kell akkor minden hol kell
      if(
         (!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && !_g_jelzo
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         )
         
         ||
         
         (!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && _g_jelzo
            && (  _g_id != adatok[key].html['group']['id'] )
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         )
         ) {
         
         
         var newGroup      =  document.createElement('fieldset');
         newGroup.setAttribute("id", adatok[key].html['group']['id']);
         existsGroup    = document.getElementById(tarolo.attr('id')).appendChild(newGroup);
         existsLegend   =$('<legend>'+adatok[key].html['group']['title']+'</legend>').appendTo($(existsGroup));
         
         _g    = existsGroup;
         _g_id = adatok[key].html['group']['id'];
         _g_jelzo = true;
         
         
         
      }else if(!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && _g_jelzo
            && (  _g_id == adatok[key].html['group']['id'] )
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         ){
      }
      else{
         existsGroup = '';
         _g_id       = '';
         _g_jelzo = false;
      }

      
      var hidden  = '';
      if(!(jQuery.type(adatok[key].html['hidden'])=== "undefined") && adatok[key].html['hidden']){
        hidden  = adatok[key].html['hidden'];
      }

      
      if (adatok[key].html['label']!==''){
        var newL = document.createElement('div');
        //newL.innerHTML =  '<span class="k_label" '+((hidden)?'style="visibility:hidden;"':'')+'>'+adatok[key].html['label']+'</span>';
        newL.innerHTML =  '<span class="k_label" '+((hidden)?'style="display:none;"':'')+'>'+adatok[key].html['label']+'</span>';
        newL.setAttribute('id','label_'+adatok[key].html['id']);
        
        if(!(jQuery.type(adatok[key].html['class'])=== "undefined") && adatok[key].html['class']){
          newL.setAttribute('class',adatok[key].html['class']);
        }
        
        if (existsGroup) {
            existsLabel  = _g.appendChild(newL);
        }else{
           existsLabel  = document.getElementById(tarolo.attr('id')).appendChild(newL);   
        }
        
        _l  = existsLabel;
        _l_jelzo = true;
       
      }
      
     var   newElement  = document.createElement(adatok[key].html['tag']);
     
     
     if(!(jQuery.type(adatok[key].html['type'])=== "undefined"))
        newElement.setAttribute('type',adatok[key].html['type']);
        
      if(!(jQuery.type(adatok[key].html['src'])=== "undefined"))
        newElement.setAttribute('src',adatok[key].html['src']);
     
     if(!(jQuery.type(adatok[key].html['id'])=== "undefined"))
        newElement.setAttribute('id',adatok[key].html['id']);
        
     if(!(jQuery.type(adatok[key].html['name'])=== "undefined"))
        newElement.setAttribute('name',adatok[key].html['name']);
     
     if((!(jQuery.type(adatok[key].html['value'])=== "undefined") && adatok[key].html['value'] != '' && !(adatok[key].html['value']===null)))
        newElement.setAttribute('value',adatok[key].html['value']);
        
     if(!(jQuery.type(adatok[key].html['checked'])=== "undefined")&& adatok[key].html['checked'])
        newElement.setAttribute('checked',true);
        
     if(!(jQuery.type(adatok[key].html['disabled'])=== "undefined") && adatok[key].html['disabled']){
        newElement.setAttribute('disabled',adatok[key].html['disabled']);
        
     }
    
     if(!(jQuery.type(adatok[key].html['style'])=== "undefined") && adatok[key].html['style'])
        newElement.setAttribute('style',adatok[key].html['style']);
     
     if(!(jQuery.type(adatok[key].html['placeholder'])=== "undefined"))
        newElement.setAttribute('placeholder',adatok[key].html['placeholder']);     
     
     if(!(jQuery.type(adatok[key].html['autocomplete'])=== "undefined") && adatok[key].html['autocomplete'])
      newElement.setAttribute('data-autocomplete',true);
     
     if(!(jQuery.type(adatok[key].html['mandantory'])=== "undefined"))
      newElement.setAttribute('data-mandantory',adatok[key].html['mandantory']);        
      
     if ( hidden  ) {
      var _style=((newElement.getAttribute('style'))? newElement.getAttribute('style'):'');
          //_style+=' visibility:hidden;';
          _style+=' display:none;';
      newElement.setAttribute('style',_style); 
     }
     
     
     
        
      if (!(jQuery.type(adatok[key].html['label'])=== "undefined")
          && adatok[key].html['label']!=='') {
          var existsElement  =  _l.appendChild(newElement);
      }else if(adatok[key].html['label']=='' && _l_jelzo){
        
    //A LABEL ES AZ UTANA KOVETKEZO TAGET BELE.
        var newS = document.createElement('span');
        newS.innerHTML  = '-';
        _l.appendChild(newS)
        _l_jelzo = false;                        
        var existsElement  =  _l.appendChild(newElement);
      }
      else{
        var existsElement  = document.getElementById(tarolo.attr('id')).appendChild(newElement);
      }
    
      

      
      
      
      
    }else if (adatok[key].html['tag']=='select') {
//SELECT TAG GENERALASA
 if(
         (!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && !_g_jelzo
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         )
         
         ||
         
         (!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && _g_jelzo
            && (  _g_id != adatok[key].html['group']['id'] )
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         )
         ) {
         
         
         var newGroup      =  document.createElement('fieldset');
         newGroup.setAttribute("id", adatok[key].html['group']['id']);
         existsGroup    = document.getElementById(tarolo.attr('id')).appendChild(newGroup);
         existsLegend   =$('<legend>'+adatok[key].html['group']['title']+'</legend>').appendTo($(existsGroup));
         
         _g    = existsGroup;
         _g_id = adatok[key].html['group']['id'];
         _g_jelzo = true;
         
         
         
      }else if(!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && _g_jelzo
            && (  _g_id == adatok[key].html['group']['id'] )
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         ){
      }
      else{
         existsGroup = '';
         _g_id       = '';
         _g_jelzo = false;
      }

      if (adatok[key].html['label']!==''){
        var newL = document.createElement('div');
        //newL.innerHTML =  '<span class="k_label" '+((hidden)?'style="visibility:hidden;"':'')+'>'+adatok[key].html['label']+'</span>';
        newL.innerHTML =  '<span class="k_label" '+((hidden)?'style="display:none;"':'')+'>'+adatok[key].html['label']+'</span>';
        newL.setAttribute('id','label_'+adatok[key].html['id']);
        
        if(!(jQuery.type(adatok[key].html['class'])=== "undefined") && adatok[key].html['class']){
          newL.setAttribute('class',adatok[key].html['class']);
        }
        
        if (existsGroup) {
            existsLabel  = _g.appendChild(newL);
        }else{
           existsLabel  = document.getElementById(tarolo.attr('id')).appendChild(newL);   
        }
        
        _l  = existsLabel;
        _l_jelzo = true;
       
      }
     
     
     
     
      var hidden  = '';
      if(!(jQuery.type(adatok[key].html['hidden'])=== "undefined") && adatok[key].html['hidden']){
        hidden  = adatok[key].html['hidden'];
      }
      
      var newElement  = document.createElement(adatok[key].html['tag']);
          newElement.setAttribute('id',adatok[key].html['id']);
          newElement.setAttribute('data-column',adatok[key].html['id']);
      if(!(jQuery.type(adatok[key].html['style'])=== "undefined") && adatok[key].html['style'])
        newElement.setAttribute('style',adatok[key].html['style']);
        
      if(!(jQuery.type(adatok[key].html['mandantory'])=== "undefined"))
        newElement.setAttribute('data-mandantory',adatok[key].html['mandantory']);
        
      if(!(jQuery.type(adatok[key].html['size'])=== "undefined"))
        newElement.setAttribute('size',adatok[key].html['size']);
        
     
      if ( hidden  ) {
        var _style=((newElement.getAttribute('style'))? newElement.getAttribute('style'):'');
            //_style+=' visibility:hidden;';
            _style+=' display:none;';
        newElement.setAttribute('style',_style); 
      }
          
          
      if(!(jQuery.type(adatok[key].html['disabled'])=== "undefined") && adatok[key].html['disabled'])  newElement.setAttribute('disabled',adatok[key].html['disabled']);
      if (!(jQuery.type(adatok[key].html['label'])=== "undefined") && adatok[key].html['label']!=='') {
        var existsElement  =  _l.appendChild(newElement);
      }else if(adatok[key].html['label']=='' && _l_jelzo){

        var newS = document.createElement('span');
        newS.innerHTML  = '-';
        _l.appendChild(newS);
        var existsElement  =  _l.appendChild(newElement);
        _l_jelzo = false;
        
      }
      else{
        var existsElement  = document.getElementById(tarolo.attr('id')).appendChild(newElement);
      }
      
      
//OPTION TAGEK GENERALASA

      var selectedValue  =  adatok[key].html['selected'];
      var content   = '';
      var value     = '';
      var selected  = 'selected';
      
      for(var i=0;i<adatok[key].html['data'].length;i++){
        
        content = adatok[key].html['data'][i]['content'];
        value   = adatok[key].html['data'][i]['value'];
        
        var newOption = document.createElement('option');
            newOption.text = adatok[key].html['data'][i]['content'];
            newOption.setAttribute('data-column', adatok[key].html['data'][i]['content']);
            newOption.setAttribute('data-id', adatok[key].html['data'][i]['value']);
            if (!jQuery.isEmptyObject(adatok[key].html['data'][i]['data-attr'])) {
              for(attr_name in adatok[key].html['data'][i]['data-attr']){
                newOption.setAttribute('data-'+attr_name.split('-')[1], adatok[key].html['data'][i]['data-attr'][attr_name]);
              }
            }
            newOption.setAttribute('data-id', adatok[key].html['data'][i]['value']);
            newOption.setAttribute('value', ((adatok[key].html['data'][i]['value']!="x")? adatok[key].html['data'][i]['content']:''));
            
//console.log(content,'            x            ',selectedValue);
            if( content==selectedValue || content.split('-')[1]==selectedValue) {
//console.log(newOption);
              newOption.setAttribute('selected','selected');
            }else if(value==selectedValue){
//console.log(newOption);
              newOption.setAttribute('selected','selected');
            }else{
              
            }
        existsElement.add(newOption);
      }
    }else if (adatok[key].html['tag']=='textarea') {
      



//TEXTAREA

      
//-------------EZT ki kell emelni majd mert ha valtoztani kell akkor minden hol kell
       if(
         (!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && !_g_jelzo
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         )
         
         ||
         
         (!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && _g_jelzo
            && (  _g_id != adatok[key].html['group']['id'] )
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         )
         ) {
         
         
         var newGroup      =  document.createElement('fieldset');
         newGroup.setAttribute("id", adatok[key].html['group']['id']);
         existsGroup    = document.getElementById(tarolo.attr('id')).appendChild(newGroup);
         existsLegend   =$('<legend>'+adatok[key].html['group']['title']+'</legend>').appendTo($(existsGroup));
         
         _g    = existsGroup;
         _g_id = adatok[key].html['group']['id'];
         _g_jelzo = true;
         
         
         
      }else if(!(jQuery.type(adatok[key].html['group'])=== "undefined")
            && adatok[key].html['group']
            && _g_jelzo
            && (  _g_id == adatok[key].html['group']['id'] )
            && !(jQuery.isEmptyObject(adatok[key].html['group']))
         ){
      }
      else{
         existsGroup = '';
         _g_id       = '';
         _g_jelzo = false;
      }

      
      var hidden  = '';
      if(!(jQuery.type(adatok[key].html['hidden'])=== "undefined") && adatok[key].html['hidden']){
        hidden  = adatok[key].html['hidden'];
      }

      
      if (adatok[key].html['label']!==''){
       var newL = document.createElement('div');
       //newL.innerHTML =  '<span class="k_label" '+((hidden)?'style="visibility:hidden;"':'')+'>'+adatok[key].html['label']+'</span>';
       newL.innerHTML =  '<span class="k_label" '+((hidden)?'style="display:none;"':'')+'>'+adatok[key].html['label']+'</span>';
       newL.setAttribute('id','label_'+adatok[key].html['id']);
       
       if(!(jQuery.type(adatok[key].html['class'])=== "undefined") && adatok[key].html['class']){
          newL.setAttribute('class',adatok[key].html['class']);
        }
       
       if (existsGroup) {
           existsLabel  = _g.appendChild(newL);
       }else{
          existsLabel  = document.getElementById(tarolo.attr('id')).appendChild(newL);   
       }
       
       _l  = existsLabel;
       _l_jelzo = true;
       
     }
      
      
      var   newElement  = document.createElement(adatok[key].html['tag']);
     
     
     if(!(jQuery.type(adatok[key].html['id'])=== "undefined"))
        newElement.setAttribute('id',adatok[key].html['id']);
        
     if(!(jQuery.type(adatok[key].html['name'])=== "undefined"))
        newElement.setAttribute('name',adatok[key].html['name']);
     
     if((!(jQuery.type(adatok[key].html['value'])=== "undefined") && adatok[key].html['value'] != '' && !(adatok[key].html['value']===null)))
        $(newElement).text(adatok[key].html['value']);
        
     
        
     if(!(jQuery.type(adatok[key].html['disabled'])=== "undefined") && adatok[key].html['disabled'])
        newElement.setAttribute('disabled',adatok[key].html['disabled']);
    
     if(!(jQuery.type(adatok[key].html['style'])=== "undefined") && adatok[key].html['style'])
        newElement.setAttribute('style',adatok[key].html['style']);
     
     if(!(jQuery.type(adatok[key].html['placeholder'])=== "undefined"))
        newElement.setAttribute('placeholder',adatok[key].html['placeholder']);     
     
     if(!(jQuery.type(adatok[key].html['autocomplete'])=== "undefined") && adatok[key].html['autocomplete'])
      newElement.setAttribute('data-autocomplete',true);
      
     if(!(jQuery.type(adatok[key].html['mandantory'])=== "undefined"))
      newElement.setAttribute('data-mandantory',adatok[key].html['mandantory']);
      
      
     if ( hidden  ) {
      var _style=((newElement.getAttribute('style'))? newElement.getAttribute('style'):'');
          //_style+=' visibility:hidden;';
            _style+=' display:none;';
      newElement.setAttribute('style',_style); 
     }
      
      
      if (!(jQuery.type(adatok[key].html['label'])=== "undefined")
          && adatok[key].html['label']!=='') {
          var existsElement  =  _l.appendChild(newElement);
      }else if(adatok[key].html['label']=='' && _l_jelzo){
        
    //A LABEL ES AZ UTANA KOVETKEZO TAGET BELE.
        var newS = document.createElement('span');
        newS.innerHTML  = '-';
        _l.appendChild(newS)
        _l_jelzo = false;                        
        var existsElement  =  _l.appendChild(newElement);
      }
      else{
        var existsElement  = document.getElementById(tarolo.attr('id')).appendChild(newElement);
      }      
      
      
      
    }else{
      
      
    }
    
    
    
    
    
    
    if (adatok[key].html['plugin']!=='') {
    
      switch(adatok[key].html['plugin']){
        
            case 'datepicker':
            var dateFormat  = 'yy-mm-dd';
            if (adatok[key].html['placeholder']!='') {
              switch(adatok[key].html['placeholder']){
                case'0000':
                   dateFormat  = 'yy';
                  break;
                case'0000-00-00':
                     dateFormat  = 'yy-mm-dd';
                  break;
                default:break;
              }
            }else{
              
            }
            
            
            if (dateFormat!='yy') {
              $(existsElement).datepicker({
                 dateFormat: dateFormat
                 ,changeMonth:true
                 ,changeYear:true
                 ,yearRange:"-100:+10"
                 //,minDate: -20
                 //,maxDate: "+1M +10D"
                 //,showOn: "button"
                 //,buttonImage: "images/calendar.gif"
                 //,buttonImageOnly: true
                 //,minDate: new Date(1889, 10 - 1, 25)
                 //,maxDate: '+30Y'
                 ,inline: true
              });
            }
            
            
            $($('#'+$(existsElement).attr('id'))).on('keypress',function(event){
                var dateFormat  = 'yy-mm-dd';
                var dateF = 'nap';
              if ($(this).attr('palceholder')!='') {
                  switch($(this).attr('placeholder')){
                    case'0000':
                      dateFormat  = 'yy';
                      dateF = 'ev';
                      break;
                    case'0000-00-00':
                      dateFormat  = 'yy-mm-dd';
                      dateF = 'nap';
                      break;
                    default:break;
                  }
              }
              else{
              }
              return DatumEllenorizKP($(this).get(0),event,'true',dateF,'1970','2030','-');
            });
            break;
        
        case'NumberOnly':
          $(existsElement).on('keypress',function(event){
                return NumberOnly(event);
             })
          break;
        
        
        case'function':
          
          var event = adatok[key].html['function']['event'];
          var functionName  = adatok[key].html['function']['name'];
          var element = existsElement;
          
          $(element).on(event,function(event){
            return window[functionName](element,event);
          });
          
          break;
        
        default:
          var u = "<span>Hiba a kereső felület generálása közben (hibás vagy nem létező plugin index)<br/> Kérem foduljon a rend.!</span>";
          var t = "Hiba...."
          $('#dialog').aDialog('',t,u);
          break;
      }
    }
    lastElement = newElement;
  }
  return {allapot:true};
  
}