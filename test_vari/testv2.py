import requests
import json
from bs4 import BeautifulSoup
import re

pagina_da_tagliare = """ <html><head><title>Ciao</title></head>
<body>
    <div id="prenotalezioni_avviso" class="explanation-text"><p>Di seguito l'elenco delle lezioni per le quali potrai prenotare il posto a lezione in aula; ricordiamo che le lezioni che si svolgono completamente a distanza non saranno riportate in elenco.</p><p>Per visualizzare l'orario completo delle tue lezioni della settimana odierna clicca su <a href='index.php?view=easycourse&_lang=it&include=corso' class='custom-color'><i class='fa fa-angle-double-right' aria-hidden='true'></i>&nbsp;Consulta il tuo orario</a></div>
	

	
	<div id="prenotazioni_container"></div>

	<div id="popup_conferma" class="mfp-hide white-popup">
		<div id="popup_conferma_title" class="row popup-title-aulestudio"></div>
		<div id="popup_conferma_sub_title" class="row" style="text-align:center;"></div>
		<br>
		<div id="popup_conferma_buttons_row" class="button-row"></div>
	</div>
<script>
	// Gestione della dimensione iniziale del sub menu
	

	if(typeof isBig === 'undefined') isBig = false;
	var isBig = $(window).width() >= 768;

	//dimensione del sottomenu
	var dimension_sub_menu = 250;
	var dimension_sub_menu_one = 250;
	
</script>
	
	<script>

		$(document).ready(function ($) {
			var lezioni_prenotabili = JSON.parse('[{"data":"01\/03\/2021","sede":"C.Didat.Morgagni (Piano Terra)","ora_inizio":"08:00","ora_fine":"14:00","qr":"","prenotazioni":[{"nome":"CALCOLO NUMERICO","ora_inizio":"08:30","ora_fine":"10:30","aula":"Aula 014","entry_id":130323,"last_minute":false,"capacita":47,"presenti":40,"prenotabile":true,"note":"","prenotata":true,"posto":0,"PresenzaAula":null,"PostoOccupato":null},{"nome":"FISICA II","ora_inizio":"10:50","ora_fine":"12:50","aula":"Aula 014","entry_id":130294,"last_minute":false,"capacita":47,"presenti":38,"prenotabile":true,"note":"","prenotata":true,"posto":0,"PresenzaAula":null,"PostoOccupato":null}],"timestamp":1614582000},{"data":"01\/03\/2021","sede":"C.Didat.Morgagni (1\u00b0 Piano)","ora_inizio":"14:00","ora_fine":"20:00","qr":"","prenotazioni":[{"nome":"ANALISI MATEMATICA II","ora_inizio":"14:20","ora_fine":"16:20","aula":"Auditorium B","entry_id":129941,"last_minute":false,"capacita":84,"presenti":84,"prenotabile":false,"note":"","prenotata":true,"posto":0,"PresenzaAula":null,"PostoOccupato":null}],"timestamp":1614603600},{"data":"02\/03\/2021","sede":"C.Didat.Morgagni (Piano Terra)","ora_inizio":"08:00","ora_fine":"14:00","qr":"","prenotazioni":[{"nome":"FISICA II","ora_inizio":"08:30","ora_fine":"10:30","aula":"Aula 014","entry_id":130308,"last_minute":false,"capacita":47,"presenti":38,"prenotabile":true,"note":"","prenotata":true,"posto":0,"PresenzaAula":null,"PostoOccupato":null},{"nome":"CALCOLO NUMERICO","ora_inizio":"10:50","ora_fine":"12:50","aula":"Aula 014","entry_id":130337,"last_minute":false,"capacita":47,"presenti":39,"prenotabile":true,"note":"","prenotata":true,"posto":0,"PresenzaAula":null,"PostoOccupato":null}],"timestamp":1614668400},{"data":"02\/03\/2021","sede":"C.Didat.Morgagni (Piano Terra)","ora_inizio":"14:00","ora_fine":"20:00","qr":"","prenotazioni":[{"nome":"FONDAMENTI DI INFORMATICA","ora_inizio":"14:10","ora_fine":"16:10","aula":"Auditorium A","entry_id":129969,"last_minute":false,"capacita":84,"presenti":84,"prenotabile":false,"note":"","prenotata":true,"posto":0,"PresenzaAula":null,"PostoOccupato":null}],"timestamp":1614690000},{"data":"04\/03\/2021","sede":"C.Didat.Morgagni (1\u00b0 Piano)","ora_inizio":"08:00","ora_fine":"14:00","qr":"","prenotazioni":[{"nome":"LABORATORIO DI INFORMATICA","ora_inizio":"10:40","ora_fine":"12:40","aula":"Aula Informatica 112 (la lezione si svolge anche nelle aule: Aula Informatica 113)","entry_id":133787,"last_minute":false,"capacita":20,"presenti":17,"prenotabile":true,"note":"","prenotata":false,"posto":0,"PresenzaAula":null,"PostoOccupato":null},{"nome":"LABORATORIO DI INFORMATICA","ora_inizio":"10:40","ora_fine":"12:40","aula":"Aula Informatica 113 (la lezione si svolge anche nelle aule: Aula Informatica 112)","entry_id":133788,"last_minute":false,"capacita":20,"presenti":20,"prenotabile":false,"note":"","prenotata":true,"posto":0,"PresenzaAula":null,"PostoOccupato":null}],"timestamp":1614841200},{"data":"04\/03\/2021","sede":"C.Didat.Morgagni (Piano Terra)","ora_inizio":"14:00","ora_fine":"20:00","qr":"","prenotazioni":[{"nome":"FONDAMENTI DI INFORMATICA","ora_inizio":"14:10","ora_fine":"16:10","aula":"Auditorium A","entry_id":129984,"last_minute":false,"capacita":84,"presenti":84,"prenotabile":false,"note":"","prenotata":true,"posto":0,"PresenzaAula":null,"PostoOccupato":null}],"timestamp":1614862800}]') ;
			var empty_msg = 
				'<span class="title-box-content-big custom-color">'+_lbl_nessuna_lezione_prenotabile+'</span>'+
				'<br><br>'+
				_lbl_nessuna_lezione_prenotabile_testo+
				'<br><br>';
			
			var qr_codes_array = printPrenotazioni(lezioni_prenotabili, 'prenotazioni_container', '', '#004180', '7046719', empty_msg, 'prenota', '{"ControlloAccessi":"0","ControlloCapienzaAula":"1","ControlloOrePrenotateSettimana":"0","ControlloOreInsegnamentoPeriodoDidattico":"0","ControlloOreInsegnamentoSettimana":"0","ModalitaCalcolo":"1","PrenotazioneSlot":"0","PreavvisoPrenotazione":"7","IndicazionePosto":"0","TolleranzaIngresso":"15","RilevaPresenzaAula":"0","RilevaPostoAula":"0","InsegnamentiExtracurricolari":0,"ScadenzaDichiarazionePresenza":"15","MessaggioAppAgenda":"Se non lo hai gi\u00e0 fatto ti ricordiamo di eliminare il tuo profilo contenente gli insegnamenti del primo semestre; in seguito creane uno nuovo per gli insegnamenti del secondo semestre. Dopo questa operazione potrai prenotare il posto a lezione dal Luned\u00ec alle 00.01 al Sabato alle 23.59 per le lezioni che si terranno in presenza nella settimana seguente. Se non trovi il tuo corso di studi o un insegnamento, devi fare riferimento alla tua Scuola consultando <a href=https:\/\/www.unifi.it\/vp-9333-scuole.html>https:\/\/www.unifi.it\/vp-9333-scuole.html<\/a>","MessaggioAppAgendaDataUpdate":"2021-02-11","EasylessonPreavvisoCancellazione":""}', 'CCCNCL01M29A564I');

		});

	</script>

	




	
		
	</div>

	


	<script>
		// Internet Explorer 6-11 -> non supportato
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if(isIE)
			$('#browser-alert').show();
	
	
		$(document).ready(function(e) {
			$('.input-datepicker').datepicker().on('changeDate', function (ev) {
				calendario = false;
				$('.datepicker').hide();
				if( ! $(this).hasClass('no-submit') ) $('.main-form').submit();
			});
			
			$('.input-group-addon').click(
				function() {
					var index = $('.input-group-addon').index( this );
					$('.input-datepicker:eq('+index+')').trigger('focus');
				}
			);
			
			$('.from-datepicker').datepicker().on('changeDate', function (ev) {
				var date_from = new Date($(this).datepicker('getDate'));
				var date_to = new Date($('.to-datepicker').datepicker('getDate'));
				
				if(date_from.getDate() > date_to.getDate()){
					var n_days = parseInt($(this).attr("data-to-datepicker-range"));
					if(isNaN(n_days)) n_days = 1;
					
					date_to.setDate(date_from.getDate() + n_days);
					$('.to-datepicker').datepicker("update", date_to);
				}
			});

			$('.custom-popup-link').magnificPopup({
				closeBtnInside:true
			});
			$('.toggler-element').click(function(){
				var son_id = $(this).attr('data-son-id');
				$('#'+son_id).toggle('slow');

			});

			
		});
		////
		// -------------------------------------------------------------------- Script per la gestione del caso mobile
		if($( window ).width() < 768){
			// ri-organizzo la barra 
			setMobileTopBar('index.php?view=home&_lang=it', '1', '', 'index.php?view=login&include=login&_lang=it', '<span class="lang_container" >&nbsp;&nbsp;<a class= "new-focus-lang link_language" style = "color:#FFFFFF; position:relative;" href="?view=prenotalezione&include=prenotalezione&_lang=it">it</a>&nbsp;</span><span class="lang_container" >&nbsp;&nbsp;<a class= "new-focus-lang link_language" style = "color:#FFFFFF; position:relative;" href="?view=prenotalezione&include=prenotalezione&_lang=en">en</a>&nbsp;</span><span class="lang_container" >&nbsp;&nbsp;<a class= "new-focus-lang link_language" style = "color:#FFFFFF; position:relative;" href="?view=prenotalezione&include=prenotalezione&_lang=es">es</a>&nbsp;</span>', 'Logout','Login');

		}
	
	</script>



	<!-- skip inizio pagina e al menu -->
	<div id="skip-link-menu">
		<a href="#main-menu" class="skip-popup">Vai al menu principale</a>
	</div>

	
	<!-- Powered by EasyStaff -->
	<div id="page-footer" class="page-footer hidden-print"  style="padding-left:65px;">
				<a href="http://www.easystaff.it/" target="_blank" style="color:#333333;">Powered by EasyStaff - 2020</a>
	</div>

			


</div>






<script src='assets/js/plugins/jquery.pnotify.js'></script>
<script src='assets/js/plugins/jquery.sparkline.min.js'></script>
<script src='assets/js/plugins/mwheelIntent.js'></script>
<script src='assets/js/plugins/mousewheel.js'></script>
<script src='assets/js/bootstrap/tab.js'></script>
<script src='assets/js/bootstrap/dropdown.js'></script>
<script src='assets/js/bootstrap/tooltip.js'></script>
<script src='assets/js/bootstrap/collapse.js'></script>
<script src='assets/js/bootstrap/transition.js'></script>
<script src='assets/js/plugins/jquery.knob.js'></script>
<script src='assets/js/plugins/jquery.flot.min.js'></script>
<script src='assets/js/plugins/fullcalendar.js'></script>
<script src='assets/js/plugins/datatables/datatables.min.js'></script>
<script src='assets/js/plugins/chosen.jquery.min.js'></script>
<script src='assets/js/plugins/jquery.timepicker.min.js'></script>
<script src='assets/js/plugins/daterangepicker.js'></script>
<script src='assets/js/plugins/colpick.js'></script>
<script src='assets/js/plugins/moment.min.js'></script>
<script src='assets/js/plugins/datatables/bootstrap.datatables.js'></script>
<script src='assets/js/bootstrap/modal.js'></script>
<script src='assets/js/plugins/raphael-min.js'></script>
<script src='assets/js/plugins/morris-0.4.3.min.js'></script>
<script src='assets/js/plugins/justgage.1.0.1.min.js'></script>
<script src='assets/js/plugins/jquery.maskedinput.min.js'></script>
<script src='assets/js/plugins/jquery.maskmoney.js'></script>
<script src='assets/js/plugins/summernote.js'></script>
<script src='assets/js/plugins/dropzone-amd-module.js'></script>
<!-- <script src='assets/js/plugins/jquery.validate.min.js'></script> -->
<script src='assets/js/plugins/jquery.bootstrap.wizard.min.js'></script>
<script src='assets/js/plugins/jscrollpane.min.js'></script>

<script src="js/magnificpopup/jquery.magnific-popup.js"></script>


<!-- nuovo datepicker -->
<link href="assets/css/plugins/bootstrap-datepicker.min.css" rel="stylesheet">
<script src="assets/js/plugins/bootstrap-datepicker.min.js"></script>
<script src="assets/js/plugins/bootstrap-datepicker.it.min.js"></script>
<script src="assets/js/plugins/bootstrap-datepicker.es.min.js"></script>
<script src="assets/js/plugins/bootstrap-datepicker.en-GB.min.js"></script>



<!-- schedule
<link href  = "js/select2/css/select2.min.css" rel="stylesheet" />
<script src = "js/select2/js/select2.min.js"></script> -->

<!-- <link href  = "assets/js/select2/css/select2.min.css" rel="stylesheet" />
<script src = "assets/js/select2/js/select2.min.js"></script>

<script src = "js/jquery.form.js"></script>
<script src = "js/jquery.validate.js"></script> -->


<script>
	//portali presenti
	var n_portali 	= '4';

	//messaggio allegati
	if(visualizza_allegati)
		var label_message = _lbl_message_grid_allegato;
	else 
		var label_message = _lbl_message_grid;

	if(university == 'UNIMI')
		label_message = label_message + "<br/>In caso di ricerca nulla nel periodo didattico scelto, verificare i successivi.";


	//descrizioni frecce next/prev week
	
	var main_url 		= "/agendaweb/index.php";
	var language 		= "it";

	//popup mappa
	var mappa_assente	= "Mappa assente";

	//valori spuntati della legenda

	if('1')
		var ar_codes_ = ("").split("|");
	else
		var ar_codes_ = [];

	if('1')
		var ar_select_ = ("").split("|");
	else
		var ar_select_ = [];

	//export excel
	var label_export_excel_button 		= "Export Excel";


	//indica se si è o meno nella "vista calendario"
	var calendario = false;
	var portale_corrente = "prenotalezione";

	if(legend_position == '') legend_position = 'bottom';



	var empty_box 						= "0";
	var col_cells 						= "0";
	var all_events 						= "0";

	//label prenotazioni ad elenco



	var _lbl_message_note_event		= "<i class='fa fa-asterisk' aria-hidden></i> Un asterisco vicino al nome dell'evento può indicare la presenza di una nota. Cliccare sull'evento per visualizzarne il contenuto.";
	if(visualizza_allegati)
		var _lbl_message_note_event	= "<i class='fa fa-asterisk' aria-hidden></i> Un asterisco vicino al nome dell'evento può indicare la presenza di una nota, di un allegato o di un link. Cliccare sull'evento per visualizzarne il contenuto.";



	/* if(visualizza_allegati){
		var _lbl_vedi_note			= "<?php// echo $_lbl_vedi_note_o_allegati; ?>";
			} */


</script>



<!-- @include _footer -->
</body>
</html>
"""

zuppetta_inglese = BeautifulSoup(pagina_da_tagliare, features="lxml")

print(zuppetta_inglese.findAll('script'))
print("#################################")
print("#################################")
print("#################################")

#print(zuppetta_inglese)
print("#################################")
print("#################################")
print("#################################")

bono = zuppetta_inglese.script
bono.string
type(bono.string)
#print(bono)

print("#################################")
print("#################################")
print("#################################")

#print(zuppetta_inglese.findAll('script', text="lezioni_prenotabili",recursive=True))

print("#################################")
print("#################################")
print("#################################")

x = zuppetta_inglese.string


ciao = re.findall('^JSON', pagina_da_tagliare)

#print(ciao)

y = pagina_da_tagliare.find("JSON.parse")
#print(y)
print("--.-.-.-.--")
z = pagina_da_tagliare.partition("JSON.parse")
print(z[2])
print("--.-.-.-.--")
intermedio_lista_lezioni = z[2].partition("') ;")
print(intermedio_lista_lezioni[0])
print("--.-.-.-.--")

output_lista_lezioni = intermedio_lista_lezioni[0].strip("('")
print(output_lista_lezioni)
print("--.-.-.-.--")

#madonna = json.loads(output_lista_lezioni[0])
#print(madonna)