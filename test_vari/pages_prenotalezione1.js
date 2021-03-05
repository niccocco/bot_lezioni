// DEFINIZIONI
var  label_elimina_prenotazione 		= '<span style="color:#E12D32"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_annulla_prenotazione + '</span>';
var  label_prenotazione_effettuata 		= '<span style="color:#007953">'+_lbl_prenotazione_effettuata + '</span>';
var  label_prenotazione_non_consentita 	= '<span style="color:#E12D32">'+_lbl_operazione_non_consentita + '</span>';
var  label_verifica_prenotazione 		= '<span style="color:#4285F4"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_verifica_prenota + '</span>';
var  label_riprova_prenotazione 		= '<span style="color:#4285F4"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_riprova + '</span>';


// TABELLE PROFILO
// solo visualizzazione
function drawTableProfilo(data, color, id_table){
	var lista_insegnamenti = JSON.parse(data);

	$('#'+id_table).append(
		'<div class="calendar-table-row-head" style="background-color:'+color+';color:#ffffff;border:1px solid '+color+';">'+
			'<div class="custom-table-column-left" style="width:50%;">'+_lbl_corso+'</div>'+
			'<div class="custom-table-column-left" style="width:50%;">'+_lbl_docente+'</div>'+
		'</div>');
	
	lista_insegnamenti.sort((a,b) => (a.Nome > b.Nome) ? 1 : ((b.Nome > a.Nome) ? -1 : 0)); 


	for(var index in lista_insegnamenti){
		var insegnamento_data = lista_insegnamenti[index];
		
		var docenti = [];
		for(var d in insegnamento_data.Docente) docenti.push(insegnamento_data.Docente[d].Cognome + ' ' + insegnamento_data.Docente[d].Nome);
		
		var notes = [];
		if(insegnamento_data.Prenotabile == '0') notes.push( '<span style="color:#E12D32">'+_lbl_insegnamento_non_prenotabile+'</span>' );
		if(insegnamento_data.Nota != '') notes.push( '<span style="color:#E12D32">'+insegnamento_data.Nota+'</span>' );
		var notes_str = '';
		if(notes.length > 0 ) notes_str = '<div class="custom-table-column-left" style="width:100%;">'+notes.join('<br>')+'</div>';

		$('#'+id_table).append(
			'<div class="calendar-table-row">'+
				'<div class="custom-table-column-left" style="width:50%;">'+insegnamento_data.Nome+'</div>'+
				'<div class="custom-table-column-left" style="width:50%;">'+docenti.join(', ')+'</div>'+
				notes_str+
			'</div>'
		);
	}

}

// visualizzazione e modifica
function drawTable(data, insegnamenti_profilo_data, color, id_table, mode, codice_fiscale){
	var lista_insegnamenti = JSON.parse(data);
	var insegnamenti_profilo = JSON.parse(insegnamenti_profilo_data);
	var array_da_stampare = [];
	
	lista_insegnamenti.sort((a,b) => (a.Nome > b.Nome) ? 1 : ((b.Nome > a.Nome) ? -1 : 0)); 

	// divido per anni di corso
	
	for(var index in lista_insegnamenti){
		var insegnamento = lista_insegnamenti[index];
		if(mode == 'insegnamenti_extra_selezionati'){
			var docenti = [];
			for(var d in insegnamento.Docente) docenti.push(insegnamento.Docente[d].Cognome + ' ' + insegnamento.Docente[d].Nome);
			insegnamento.anno = 0;
			insegnamento.nome = insegnamento.Nome;
			insegnamento.docente = docenti.join(', ');
			insegnamento.id = insegnamento.IdInsegnamento;
			insegnamento.prenotabile = insegnamento.Prenotabile;
			insegnamento.erogante = '';
			insegnamento.nota = insegnamento.Nota;
		}
		if(mode == 'insegnamenti_extra'){
			insegnamento.IdPeriodoDidattico = $('#periodo_didattico').val();
			insegnamento.IdCorsoLaurea = $('#corso').val();
		} 
		array_da_stampare[insegnamento.anno] = [];
	}	
	
	for(var index in lista_insegnamenti){
		var insegnamento = lista_insegnamenti[index];
		array_da_stampare[insegnamento.anno].push(insegnamento);
	}
	

	// stampo la lista degli insegnamenti
	for(var index_anno in array_da_stampare){
		var id_anno = index_anno;
		var lbl_anno_tabella = _lbl_anno_+' '+index_anno;
		if(index_anno == 0) lbl_anno_tabella = _lbl_anno_zero_label;
		if(mode == 'insegnamenti_extra_selezionati'){
			lbl_anno_tabella = _lbl_titolo_tab_extra_aggiunti;
			id_anno = 'extrasel';
		} 
		
		$('#'+id_table).append(
			'<div class="calendar-table-row-head" style="background-color:'+color+';color:#ffffff;border:1px solid '+color+';">'+
				'<div class="custom-table-column-center" style="width:100%;">'+lbl_anno_tabella+'</div>'+
			'</div>'
		);

		var insegnamenti_anno = array_da_stampare[index_anno];
		for(var index_insegnamento in insegnamenti_anno){
			var insegnamento_data = insegnamenti_anno[index_insegnamento];

			var identificativo_riga_insegnamento = insegnamento_data.id+'_'+id_anno;

			var checked = '';
			var save_delete = getSaveDeleteHtml(identificativo_riga_insegnamento, _lbl_aggiungi, insegnamento_data.id, 'aggiungi', codice_fiscale, insegnamento_data.nome); //

			// var save_delete = 
			// '<a href="#" aria-label="'+_lbl_aggiungi+'" id="'+identificativo_riga_insegnamento+'" onclick="gestisciInsegnamentoExtraApriPopup('+insegnamento_data.id+', \'aggiungi\', \''+codice_fiscale+'\', \''+identificativo_riga_insegnamento+'\')" style="color:#4b5159"><i class="fa fa-plus-circle fa-2x" aria-hidden="true" title="'+_lbl_aggiungi+' '+insegnamento_data.nome+'"></i></a>';

			
			if(insegnamenti_profilo.indexOf(parseInt(insegnamento_data.id)) != -1){
				var checked = 'checked="true"';
				var save_delete = getSaveDeleteHtml(identificativo_riga_insegnamento, _lbl_elimina, insegnamento_data.id, 'elimina', codice_fiscale, insegnamento_data.nome); //
				// '<span id="'+identificativo_riga_insegnamento+'"><a href="#"  aria-label="'+_lbl_elimina+'" onclick="gestisciInsegnamentoExtraApriPopup('+insegnamento_data.id+', \'elimina\', \''+codice_fiscale+'\', \''+identificativo_riga_insegnamento+'\')" style="color:#4b5159"><i class="fa fa-trash-o fa-2x" aria-hidden="true" title="'+_lbl_elimina+' '+insegnamento_data.nome+'"></i></a></span>';
			}
			var check_box = '<div class="cboxB" onclick=""><input class="" name="insegnamenti['+insegnamento_data.id+']" type="checkbox" '+checked+' id="'+identificativo_riga_insegnamento+'"/><label for="'+identificativo_riga_insegnamento+'"></label></div>';


			var notes = [];
			if(insegnamento_data.Prenotabile == '0') notes.push( '<span style="color:#E12D32">'+_lbl_insegnamento_non_prenotabile+'</span>' );
			if(insegnamento_data.Nota != '') notes.push( '<span style="color:#E12D32">'+insegnamento_data.nota+'</span>' );
			var notes_str = '';
			if(notes.length > 0 ) notes_str = 
				'<div>'+
					'<div class="custom-table-column-left" style="width:100%;">'+notes.join('<br>')+'</div>'+
				'</div>';
			// nota: insegnamento_data.erogante contiene l'informazione della tipologia di insegnamento: erogante, mutuato o extra
			if(mode == 'insegnamenti_extra' || mode =='insegnamenti_extra_selezionati'){
				$('#'+id_table).append(
					'<div class="calendar-table-row">'+
						'<div class="custom-table-column-left" style="width:85%;">'+
							'<div>'+
								'<div class="custom-table-column-left" style="width:60%;" id="nome_insegnamento_'+identificativo_riga_insegnamento+'">'+insegnamento_data.nome+'</div>'+
								'<div class="custom-table-column-left" style="width:40%;" id="docente_'+identificativo_riga_insegnamento+'">'+insegnamento_data.docente+'</div>'+
							'</div>'+
							notes_str+
						'</div>'+
						'<div class="custom-table-column-center" style="width:15%;margin-top:20px;">'+save_delete+'</div>'+
						'<input type="hidden" id="id_periodo_didattico_'+identificativo_riga_insegnamento+'" value="'+insegnamento_data.IdPeriodoDidattico+'"/>'+
						'<input type="hidden" id="id_corso_laurea_'+identificativo_riga_insegnamento+'" value="'+insegnamento_data.IdCorsoLaurea+'"/>'+
					'</div>'
				);
			}else{
				$('#'+id_table).append(
					'<div class="calendar-table-row">'+
						'<div class="custom-table-column-left" style="width:20%;">'+check_box+'</div>'+
						'<div class="custom-table-column-left" style="width:80%;">'+
							'<div>'+
								'<div class="custom-table-column-left" style="width:50%;" id="nome_insegnamento_'+identificativo_riga_insegnamento+'">'+insegnamento_data.nome+'</div>'+
								'<div class="custom-table-column-left" style="width:50%;" id="docente_'+identificativo_riga_insegnamento+'">'+insegnamento_data.docente+'</div>'+
							'</div>'+
							notes_str+
						'</div>'+
					'</div>'
				);
			}
			
			
		}
	}
}

function controllaTabellaInsegnamenti(container_id){
	var selected = [];
	$('#'+container_id+' input:checked').each(function() {
		selected.push($(this).attr('name'));
	});

	if(selected.length == 0) return false;
	else return true;
}


// EMAIL
function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function modificaMailApriPopup(id_value_mail, codice_fiscale, id_popup){
	var value_mail = $('#'+id_value_mail).html();
	$('#'+id_popup).html(
	'<div id="popup_modifica_mail_title" class="row popup-title-aulestudio">'+_lbl_modifica_mail_popup_title+'</div>'+
	'<div id="popup_modifica_mail_sub_title" class="row" style="text-align:center;">'+
	_lbl_modifica_mail_popup_text+
		'<br><br>'+
		'<input value="'+value_mail+'" type="text" name="input_mail" id="input_mail" class="custom-text-input"/>'+
		'<br><span id="input_mail_error" style="color:red;display:none"></span>'+
	'</div><br>'+
	'<div id="popup_modifica_mail_buttons_row" class="button-row">'+
		'<button type="button" class="btn normal-button custom-btn-confirm" onclick="modificaMail(\''+codice_fiscale+'\', \'input_mail\', \''+id_value_mail+'\');">'+_lbl_modifica+'</button>'+
		'<button type="button" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();">'+_lbl_annulla+'</button>'+
	'</div>'
	);
	$.magnificPopup.open({
		items: { src: '#popup_modifica_mail' }, 
		type: 'inline'
	});
}

function modificaMail(codice_fiscale, id_input, id_value_mail){
	$('#message-success-profilo-content').html('');
	$('#message-error-profilo-content').html('');
	var new_mail = $('#'+id_input).val();
	
	if(isEmail(new_mail)){
	
		var url_ = './call_ajax.php?mode=modifica_mail';
		$.ajax({
			url : url_,
			type : 'POST',
			data : {CodiceFiscale: codice_fiscale, Email:new_mail},
			dataType:'json',
			success : function(data) {
				$('#'+id_input+'_error').hide();
				$('#'+id_value_mail).html(new_mail);
				$('#message-success-profilo-content').html(data);
				$('#message-success-profilo').show();
				$.magnificPopup.close();
				
			},
			error : function(request,error)
			{ console.log('custom error 2'); }
		});

	}
	else{
		$('#'+id_input+'_error').html(_lbl_alert_mail_non_valida);
		$('#'+id_input+'_error').show();
	}
}


// VALIDAZIONE PROFILO
function validateProfilo(form, do_submit){
	var msg = [];
	if(! $('#mail').val()){
		msg.push(_lbl_alert_mail_mancante);
	}
	if($('#mail').val() && !isEmail($('#mail').val())){
		msg.push(_lbl_alert_mail_non_valida);
	}
	if(! controllaTabellaInsegnamenti('search-results-table')){
		msg.push(_lbl_alert_insegnamenti_mancanti);
	}

	if(msg.length > 0){
		$("#content_popup_non_valido").html(msg.join("<br>"));
		$("#popup_non_valido_link").click();
		return false;

	}else{
		if(do_submit) form.submit();
		else return true;
	}
}


// POPOLA LE SELCT DELLA RICERCA INSEGNAMENTI DA AGGIUNGERE AL PROFILO
function getSelectDataCercaInsegnamenti(select_data, id_search_result){
					
	if(select_data.length == 0){
		$('#'+id_search_result).html('<div style="text-align:center;padding-top:20px;">'+_lbl_non_si_puo_creare_profilo+'</div>');
		$('#'+id_search_result).show();
	}
	else{
		// riempio la select scuola
		var options_scuola = $('#scuola');
		options_scuola.empty();

		for(var i=0; i<select_data.length; i++){
			var scuola_data = select_data[i];
			options_scuola.append(new Option(scuola_data.label.replace('&apos;', "'"), scuola_data.valore));
		}
		$('#scuola').select2();
		$('#tipo').select2();
		$('#corso').select2();
		$('#periodo_didattico').select2();


		var elenco_cdl = [];
		var elenco_periodi = [];

		// $('#search-toggle-content').css('display', 'none');

	}
	$('#scuola').change(function() {
		var selected_scuola = $(this).val();
		$('.after-scuola').empty();
		elenco_cdl = [];
		elenco_periodi = [];

		if(selected_scuola != 0){
			// riempio la select del tipo laurea
			var options_tipo = $('#tipo');
			options_tipo.append(new Option('--', 0));
			for(var i=0; i<select_data.length; i++){
				if(select_data[i].valore == selected_scuola){
					for(var j=0; j<select_data[i].elenco_lauree.length; j++){
						var tipo_laurea = select_data[i].elenco_lauree[j];
						options_tipo.append(new Option(tipo_laurea.tipo.replace('&apos;', "'"), tipo_laurea.valore));
						elenco_cdl[tipo_laurea.valore] = tipo_laurea.elenco_cdl;
					}
				}
			}	
		}
		$('#tipo').select2();
	});

	$('#tipo').change(function() {
		var selected_tipo = $(this).val();
		$('.after-tipo').empty();
		elenco_periodi = [];

		if(selected_tipo != 0){
			// riempio la select del cdl
			var options_cdl = $('#corso');
			options_cdl.append(new Option('--', 0));
			for(index in elenco_cdl[selected_tipo]){
				var cld_option = elenco_cdl[selected_tipo][index];
				options_cdl.append(new Option(cld_option.label.replace('&apos;', "'"), cld_option.valore));
				elenco_periodi[cld_option.valore] = cld_option.pub_periodi;
			}
		}
		$('#corso').select2();
	});

	$('#corso').change(function() {
		var selected_corso = $(this).val();
		$('.after-corso').empty();
		$('#id_corso_laurea').val(selected_corso);
		if(selected_corso != 0){
			// riempio la select del periodo didattico
			var options_pd = $('#periodo_didattico');
			options_pd.append(new Option('--', 0));
			for(index in elenco_periodi[selected_corso]){
				var pd_option = elenco_periodi[selected_corso][index];
				options_pd.append(new Option(pd_option.label.replace('&apos;', "'"), pd_option.id));
			}
		}
		$('#periodo_didattico').select2();
	});

	$('#periodo_didattico').change(function() {
		var selected_pd = $(this).val();
		$('#id_periodo_didattico').val(selected_pd);
	});
}


// PRENOTAZIONI EFFETTUATE E DA EFFETTUARE
function printPrenotazioni(lezioni, prenotazioni_container_id, prenotazioni_container_id_passate, color, matricola, msg_empty, mode, el_config_json, codice_fiscale){

	$('#'+prenotazioni_container_id).empty();
	$('#'+prenotazioni_container_id_passate).empty();
	var show_passate = false;
	var qr_codes_array = [];

	var n_passate = 0;
	var n_future = 0;

	var el_config = JSON.parse(el_config_json);
	
	// data di oggi
	var today_timestamp = new Date();

	if(lezioni != null)
	if(lezioni.length > 0){

		// ordino le lezioni secondo la data e l'ora
		lezioni.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
		

		for(index in lezioni){

			var turno = lezioni[index];
			var last_minute_found = false;
			var last_minute_text = '';

			// #### prima sezione
			// trovo la data
			var aux = turno.data.split('/');
			var timestamp = new Date(aux[2]+'/'+aux[1]+'/'+aux[0]  +" 23:59:00"  );
			// var timestamp = new Date(aux[2]+'/'+aux[1]+'/'+aux[0]  +" 00:01:00"  );
			var data_lezione = week_labels_array_en[timestamp.getDay()] + ' ' + timestamp.getDate() + ' ' + month_labels_array[timestamp.getMonth()] + ' ' + timestamp.getFullYear();

			var passata = timestamp < today_timestamp;
			var odierna =  timestamp.getFullYear() === today_timestamp.getFullYear() && timestamp.getMonth() === today_timestamp.getMonth() && timestamp.getDate() === today_timestamp.getDate();
			
			// cancellabilità della prenotazione
			if(el_config.EasylessonPreavvisoCancellazione != ''){
				// ho definito nel config un intervallo di tempo per cui la prenotazione può essere cancellata
				var intervallo_cancellabilita = (today_timestamp.getTime() + el_config.EasylessonPreavvisoCancellazione * 60000) /1000;
				var cancellabile = turno.timestamp > intervallo_cancellabilita;	
			}else{
				// caso normale, se la lezione non è di oggi e non è nemmeno passata allora posso cancellarla
				var cancellabile = !odierna && !passata;
			}

			
			var operation_row = '';
			var entries_array = [];
			var turno_operation = '';
			var turno_operation_array = [];
			var trovata_non_prenotabile = false;
			
			// costruisco un array con le lezioni di quel giorno
			var second_section_array = [];
			var find_prenotata = false;
			turno.prenotazioni.sort((a, b) => (a.ora_inizio+a.ora_fine > b.ora_inizio+b.ora_fine) ? 1 : -1);
			
			for(index_lezioni in turno.prenotazioni){
				var lezione = turno.prenotazioni[index_lezioni];
				var lezione_timestamp = new Date( aux[2]+'/'+aux[1]+'/'+aux[0]  + " "+ lezione.ora_inizio+":00" );

				other_info = '';

				var indicazione_prenotata = '';

				// la lezione è stata prenotata
				if(lezione.prenotata){
					var data_prenotata = '1';
					find_prenotata = true;

					// nel caso della prenotazione a singola lezione, la cancellabilità riguarda la singola lezione, solo caso con preavviso da config
					if(el_config.PrenotazioneSlot == "0" && el_config.EasylessonPreavvisoCancellazione != ''){
						var cancellabile = (lezione_timestamp.getTime()/1000) > intervallo_cancellabilita;	
					}
					
					// la lezione non è di oggi e non è nemmeno passata, posso cancellarla
					// if(!odierna && !passata){
					if(cancellabile){
						var info_operation = label_prenotazione_effettuata + '&nbsp;';
						var operation = 
						'<a href="#" id="'+lezione.entry_id+'" title="'+ _lbl_annulla_prenotazione +'"'+
								'onclick="gestisciPrenotazione_apri_popup(\'['+lezione.entry_id+']\', '+lezione.entry_id+', \''+matricola+'\', \''+mode+'\', \''+odierna+'\', \''+codice_fiscale+'\', \''+lezione.entry_id+'\', \''+cancellabile+'\', \''+el_config.PrenotazioneSlot+'\');"'+
							'>'+
								label_elimina_prenotazione+
							'</a>';
						turno_operation = 'annulla_prenotazione';
						turno_operation_array.push('annulla_prenotazione');
					}
	
					// la lezione è di oggi oppure è passata, non posso cancellarla
					else{
						var info_operation = label_prenotazione_effettuata;
						var operation = '';

						// if(odierna){
						if(!cancellabile){
							operation = '<br><span class="explanation-text" style="font-weight:lighter">'+_lbl_non_si_puo_cancellare+'</span>';
							turno_operation = 'prenotazione_effettuata_non_si_puo_cancellare';
							turno_operation_array.push('prenotazione_effettuata_non_si_puo_cancellare');

						}else{
							turno_operation = 'prenotazione_effettuata';
							turno_operation_array.push('prenotazione_effettuata');
						}
					} 
					if(el_config.PrenotazioneSlot == "1")
					indicazione_prenotata = '<i class="fa fa-check custom-color" aria-hidden="true"></i>';
				}

				// la lezione non è già stata prenotata
				else{
					var data_prenotata = '0';
					var info_operation = '';

					// var lezione_timestamp = new Date( aux[2]+'/'+aux[1]+'/'+aux[0]  + " "+ lezione.ora_inizio+":00" );
					var now = new Date();
					if(lezione.prenotabile == '1'){
						if(/* odierna */ !cancellabile && lezione_timestamp < now){
							var operation = '';
							var other_info = _lbl_lezione_gia_iniziata_non_prenotabile;
							turno_operation = 'iniziata_non_prenotable';
							turno_operation_array.push('iniziata_non_prenotable');

						}
						else{
							var operation = 
							'<a href="#" id="'+lezione.entry_id+'" class="only-1-click" title="'+_lbl_verifica_prenota+'"'+
									'onclick="gestisciPrenotazione_apri_popup(\'['+lezione.entry_id+']\', '+lezione.entry_id+', \''+matricola+'\', \''+mode+'\', \''+odierna+'\', \''+codice_fiscale+'\', \''+lezione.entry_id+'\', \''+cancellabile+'\', \''+el_config.PrenotazioneSlot+'\');"'+
								'>'+
									label_verifica_prenotazione+
								'</a>';
							turno_operation = 'verifica_prenota';
							turno_operation_array.push('verifica_prenota');

						}
					}
					else{
						var operation = _lbl_non_prenotabile;
						var other_info = '';
						turno_operation = 'non_prenotable';
						turno_operation_array.push('non_prenotable');

					}
					
						
				}

				var last_minute_icon = '';
				if(lezione.last_minute){
					last_minute_found = true;
					last_minute_icon = '<a href="#" class="toggler-element" data-son-id="toggler_text_'+turno.timestamp+index+'"><img src="customer/clock.png" width="20" height="20" style="margin-bottom:5px;"/></a>';
				}

				var indicazione_posto = '';
				if(mode == 'gestisci' && el_config.IndicazionePosto != 0)
					indicazione_posto = _lbl_posto_assegnato+': '+lezione.posto;

				var posto_dichiarato = '';
				if(el_config.RilevaPresenzaAula != 0){
					if(lezione.PresenzaAula == '1'){
						posto_dichiarato = _lbl_popup_riepilogo_presente;
						if(el_config.RilevaPostoAula != 0 && lezione.PostoOccupato && lezione.PostoOccupato != 'undefined') posto_dichiarato += ' ' + _lbl_popup_riepilogo_posto + ' ' + lezione.PostoOccupato;
					}else if(lezione.PresenzaAula == '0'){
						posto_dichiarato = _lbl_popup_riepilogo_assente;
					}
				}

				var posti_liberi = lezione.capacita - lezione.presenti;
				var string_posti_liberi = '';
				if(posti_liberi <= 0) 	string_posti_liberi = '<br><span class="rounded-element-red">&nbsp;&nbsp;&nbsp;'+_lbl_non_ci_sono_posti+'&nbsp;&nbsp;&nbsp;</span>';
				// if(posti_liberi == 1) 	string_posti_liberi = '<em><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_un_posto_libero+'&nbsp;<i class="fa fa-angle-double-left" aria-hidden="true"></i></em><br>';
				// if(posti_liberi > 1) 	string_posti_liberi = '<em><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_ci_sono + posti_liberi + _lbl_posti_disponibili_su + lezione.capacita+'&nbsp;<i class="fa fa-angle-double-left" aria-hidden="true"></i></em><br>';
				if(university != 'unifi' && university != 'unifi_test'&& university != 'UNIFI'&& university != 'UNIFI_TEST'){
					if(posti_liberi == 1) 	string_posti_liberi = '<em><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_un_posto_libero+'&nbsp;<i class="fa fa-angle-double-left" aria-hidden="true"></i></em><br>';
					if(posti_liberi > 1) 	string_posti_liberi = '<em><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_ci_sono + posti_liberi + _lbl_posti_disponibili_su + lezione.capacita+'&nbsp;<i class="fa fa-angle-double-left" aria-hidden="true"></i></em><br>';	
				}
				var prova = university == 'UNIFI';
				debugger;

				// var string_posti_liberi = '';

				var note = '';
				if(lezione.note){
					note = 
					'<a href="#" id="toggler-notes-'+lezione.entry_id+'" class="toggler-element" data-son-id="toggle-notes-content-'+lezione.entry_id+'"><i class="fa fa-plus-circle custom-color" aria-hidden="true"></i>&nbsp;'+_lbl_vedi_note+'</a>'+
					'<div id="toggle-notes-content-'+lezione.entry_id+'" style="display:none" class="box-note">'+decodeURIComponent( encodeURIComponent(lezione.note) )+'</div>';

				}

				var array_string = [];
				var riepilogo_string = [];
				
				array_string.push('<span class="libretto-course-name">'+indicazione_prenotata+' '+lezione.nome+last_minute_icon+'</span>');
				array_string.push(lezione.ora_inizio + ' - '+ lezione.ora_fine);
				array_string.push('<b>' + lezione.aula + '</b>');

				riepilogo_string.push(lezione.nome);
				riepilogo_string.push(data_lezione + ', ' + lezione.ora_inizio + ' - '+ lezione.ora_fine);
				riepilogo_string.push(lezione.aula + ' ['+turno.sede+']');
				
				if(posto_dichiarato != '') array_string.push('<br><span style="color:#2980B9;">' + posto_dichiarato + '</span>');
				
				if(indicazione_posto != '') array_string.push('<br>' + indicazione_posto);
				if(string_posti_liberi != '')array_string.push('<br>' + '<span id="posti_liberi_string_'+lezione.entry_id+'" data-postiliberi="'+posti_liberi+'" data-capacita="'+lezione.capacita+'">'+string_posti_liberi+'</span>'+
				note);

				if(el_config.PrenotazioneSlot == "0")
					array_string.push('<br>' +
					'<span class="attendance-course-detail" id="info_operation_'+lezione.entry_id+'">'+info_operation+'</span>' + operation + 
					'<br><span class="explanation-text" id="other_info_'+lezione.entry_id+'">'+other_info+'</span>' + 
					'<input id="prenotata_'+lezione.entry_id+'" type="hidden" value="'+data_prenotata+'"/>');
				
				if(el_config.PrenotazioneSlot == "1"){
					entries_array.push(lezione.entry_id);
				}

				string_lezione = array_string.join('<br>');

				second_section_array.push(string_lezione+'<div id="riepilogo_string_'+lezione.entry_id+'" style="display:none;">'+riepilogo_string.join('<br>')+'</div>');

			}
			// prenotazione a fascia
			if(el_config.PrenotazioneSlot == "1"){
				var id_slot = entries_array.join('-');
				var entries_string = entries_array.join(',');
				data_prenotata = '0';
				info_operation = '';
				operation = '';
				other_info = '';

				// vecchia gestione
				/* if(turno_operation == 'verifica_prenota'){
					var operation = 
					'<a href="#" id="'+id_slot+'" title="'+_lbl_verifica_prenota+'"'+
							'class="only-1-click" onclick="gestisciPrenotazione_apri_popup(\'['+entries_string+']\', \''+id_slot+'\', \''+matricola+'\', \''+mode+'\', \''+odierna+'\', \''+codice_fiscale+'\', \''+id_slot+'\', \''+cancellabile+'\', \''+el_config.PrenotazioneSlot+'\');"'+
						'>'+
							label_verifica_prenotazione+
						'</a>';
				}
				else if(turno_operation == 'iniziata_non_prenotable'){
					var other_info = _lbl_lezione_gia_iniziata_non_prenotabile;
				}
				else if(turno_operation == 'prenotazione_effettuata_non_si_puo_cancellare'){
					data_prenotata = '1';
					var info_operation = label_prenotazione_effettuata;
					var operation = '<br><span class="explanation-text" style="font-weight:lighter">'+_lbl_non_si_puo_cancellare+'</span>';
				}
				else if(turno_operation == 'annulla_prenotazione'){
					data_prenotata = '1';
					var info_operation = label_prenotazione_effettuata + '&nbsp;';
					var operation = 
					'<a href="#" id="'+id_slot+'" title="'+ _lbl_annulla_prenotazione +'"'+
							'onclick="gestisciPrenotazione_apri_popup(\'['+entries_string+']\', \''+id_slot+'\', \''+matricola+'\', \''+mode+'\', \''+odierna+'\', \''+codice_fiscale+'\', \''+id_slot+'\', \''+cancellabile+'\', \''+el_config.PrenotazioneSlot+'\');"'+
						'>'+
							label_elimina_prenotazione+
						'</a>';
				}
				else if(turno_operation == 'prenotazione_effettuata'){
					data_prenotata = '1';
					var info_operation = label_prenotazione_effettuata;
					var operation = '';
				}
				else if(turno_operation == 'non_prenotable'){
					var info_operation = _lbl_non_prenotabile;
				} */
				
				// prenotate
				// if(turno_operation == 'annulla_prenotazione'){
				if(turno_operation_array.includes("annulla_prenotazione")){
					data_prenotata = '1';
					var info_operation = label_prenotazione_effettuata + '&nbsp;';
					var operation = 
					'<a href="#" id="'+id_slot+'" title="'+ _lbl_annulla_prenotazione +'"'+
							'onclick="gestisciPrenotazione_apri_popup(\'['+entries_string+']\', \''+id_slot+'\', \''+matricola+'\', \''+mode+'\', \''+odierna+'\', \''+codice_fiscale+'\', \''+id_slot+'\', \''+cancellabile+'\', \''+el_config.PrenotazioneSlot+'\');"'+
						'>'+
							label_elimina_prenotazione+
						'</a>';
				}
				// else if(turno_operation == 'prenotazione_effettuata_non_si_puo_cancellare'){
				else if(turno_operation_array.includes("prenotazione_effettuata_non_si_puo_cancellare")){
					data_prenotata = '1';
					var info_operation = label_prenotazione_effettuata;
					var operation = '<br><span class="explanation-text" style="font-weight:lighter">'+_lbl_non_si_puo_cancellare+'</span>';
				}
				// else if(turno_operation == 'prenotazione_effettuata'){
				else if(turno_operation_array.includes("prenotazione_effettuata")){
					data_prenotata = '1';
					var info_operation = label_prenotazione_effettuata;
					var operation = '';
				}

				// non prenotate
				// else if(turno_operation == 'iniziata_non_prenotable'){
				else if(turno_operation_array.includes("iniziata_non_prenotable")){
					var other_info = _lbl_lezione_gia_iniziata_non_prenotabile;
				}
				// if(turno_operation == 'verifica_prenota'){
				else if(turno_operation_array.includes("verifica_prenota")){
					var operation = 
					'<a href="#" id="'+id_slot+'" title="'+_lbl_verifica_prenota+'"'+
							'class="only-1-click" onclick="gestisciPrenotazione_apri_popup(\'['+entries_string+']\', \''+id_slot+'\', \''+matricola+'\', \''+mode+'\', \''+odierna+'\', \''+codice_fiscale+'\', \''+id_slot+'\', \''+cancellabile+'\', \''+el_config.PrenotazioneSlot+'\');"'+
						'>'+
							label_verifica_prenotazione+
						'</a>';
				}
				else/*  if(turno_operation == 'non_prenotable') */{
					var info_operation = _lbl_non_prenotabile;
				}



				


				operation_row = 
				'<div style="text-align:center">'+
					'<span class="attendance-course-detail" id="info_operation_'+id_slot+'">'+info_operation+'</span>' + operation + 
					'<br><span class="explanation-text" id="other_info_'+id_slot+'">'+other_info+'</span>' + 
					'<input id="prenotata_'+id_slot+'" type="hidden" value="'+data_prenotata+'"/>'+
				'</div>';
			}
			var pdf_export = 
				'<span class="text-link" id="export_pdf_'+turno.timestamp+index+'"  onclick="$(\'#form_export_pdf_'+turno.timestamp+index+'\').submit();">'+
					'<i class="fa fa-file-text-o" aria-hidden="true" style="color:'+color+'"></i>&nbsp;'+_lbl_esporta_pdf +
				'</button>'+
				'<form  method="post" id="form_export_pdf_'+turno.timestamp+index+'" action="export_pdf'+easylesson_export_pdf_version+'.php">'+
					'<input type="hidden" name="language" value="'+language+'"/>'+
					'<input type="hidden" name="matricola" value="'+matricola+'"/>'+
					'<input type="hidden" name="color" value="'+color.replace('#', '')+'"/>'+
					'<input type="hidden" name="qr" value="'+turno.qr+'"/>'+
					'<input type="hidden" name="sede" value="'+turno.sede+'"/>'+
					'<input type="hidden" name="ora_inizio" value="'+turno.ora_inizio+'"/>'+
					'<input type="hidden" name="ora_fine" value="'+turno.ora_fine+'"/>'+
					'<input type="hidden" name="data_lezione" value="'+data_lezione+'"/>'+
					'<input type="hidden" name="ora_prima_lezione" value="'+turno.prenotazioni[0].ora_inizio+'"/>';
			for(var p in turno.prenotazioni){
				var lezione = turno.prenotazioni[p];
				if(el_config.IndicazionePosto == 0) lezione.posto = 0;
				pdf_export += '<input type="hidden" name="prenotazioni[]" value="'+lezione.prenotata+'|'+lezione.nome+'|'+lezione.ora_inizio + ' - ' + lezione.ora_fine+'|'+lezione.aula+'|'+lezione.posto+'"/>';
			}
			pdf_export += '</form>';


			
			if(odierna && mode == 'gestisci' && find_prenotata){
				var check_in = 
					'<a id="custom-popup-link_'+turno.timestamp+index+'"  href="#custom_popup_'+turno.timestamp+index+'"  class="custom-popup-link" >'+
						'<i class="fa fa-qrcode" aria-hidden="true" style="color:'+color+'"></i>&nbsp;'+_lbl_effettua_check_in +
					'</a>' +
					getPopupPrenotazione(turno, color, data_lezione, matricola, el_config, index);
				qr_codes_array.push(turno.qr);
			
				if(easylesson_text_operation){
					// operation_row = easylesson_text_operation;
					pdf_export = '';
					check_in = '';
				} 
				else 
					operation_row = '<div class="row" stye="padding-left:5px;padding-right:5px;"><div class="col-xs-6">'+check_in+'</div><div class="col-xs-6" style="text-align:right">'+pdf_export+'</div></div>';

			}
			else if (mode == 'gestisci' && find_prenotata){
				if(easylesson_text_operation){
					// operation_row = easylesson_text_operation;
					pdf_export = '';
					check_in = '';
				} 
				else 
					operation_row += '<div class="row" stye="padding-left:5px;padding-right:5px;"><div class="col-xs-12" style="text-align:right">'+pdf_export+'</div></div>';
			}
			
			// caso unitn, sovrascrivo checkin e pdf
			if(university == 'unitn' || university == 'uniud'){
				operation_row = _lbl_operation_row_unitn;
			}

			var first_section = 
				'<span class="box-header-big">'+data_lezione+'</span><br>'+
				'<span class="box-header-small">'+_lbl_sede+': '+turno.sede+'</span><br>'+
				'<span class="box-header-small">'+_lbl_turno+': '+turno.ora_inizio + ' - ' + turno.ora_fine+'</span>';

			if(last_minute_found){
				last_minute_text = 
				'<div class="row"><div class="col-xs-12" style="text-align:center; padding-top:10px;">'+
					'<a href="#" class="toggler-element" data-son-id="toggler_text_'+turno.timestamp+index+'" style="color:#4b5159;">'+
						'<img src="customer/clock.png" width="20" height="20" style="margin-bottom:5px;"/>'+
						_lbl_last_minute+'&nbsp;<i class="fa fa-angle-double-down" aria-hidden="true"></i>'+
					'</a>'+
					'<div id="toggler_text_'+turno.timestamp+index+'" style="display:none;text-align:left;padding:20px;border:1px solid #dddddd;">'+_lbl_last_minute_text+'</div>'+
				'</div></div>';
			}
			if(el_config.PrenotazioneSlot == "0") var id_slot = lezione.entry_id;
			var box = renderBox({ // elena
				header:first_section, 
				section_1: second_section_array.join('<hr style="border-top:1px solid #dddddd;">'), 
				section_2: operation_row + last_minute_text, 
				main_color: color, 
				color_text_header:'#ffffff',
				options_section_2: 'id="second_section_row_'+id_slot+'"'
				// options_section_2: 'id="second_section_row_'+lezione.entry_id+'"'
			});
			box = '<div class="row" id="box_'+turno.qr+'"><div class="col-md-3"></div><div class="col-md-6">'+box+'</div><div class="col-md-3"></div><div>';
			
			if(mode == 'gestisci' && passata){
				$('#'+prenotazioni_container_id_passate).append(box);
				show_passate = true;
				n_passate++;
			}
			else{
				$('#'+prenotazioni_container_id).append(box);
				n_future++;
			}
		}
	}
	if(show_passate) $('#open_passate').show();
	if(n_future == 0){
		$('#'+prenotazioni_container_id).append('<div class="login-border-container row"><div class="container-box">'+msg_empty+'</div></div>');
	}



	if(easylesson_text_operation) return [];
	return qr_codes_array;
}

function getPopupPrenotazione(turno, color, data_lezione, matricola, el_config, index){
	var text_box = 
		'<span style="color:'+color+'">'+_lbl_sede+':</span> '+turno.sede+'<br>'+
		'<span style="color:'+color+'">'+_lbl_turno+':</span> '+turno.ora_inizio + ' - ' + turno.ora_fine+'<br>'+
		'<span style="color:'+color+'">'+_lbl_orario_prima_lezione+':</span> '+turno.prenotazioni[0].ora_inizio+'<br>'+
		'<span style="color:'+color+'">'+_lbl_matricola_studente_eth+':</span> '+matricola+'<br>';
	
	var info_lezioni = [];
	for(var p in turno.prenotazioni){
		var lezione = turno.prenotazioni[p];
		if(lezione.prenotata){
			var info_lezione =
			'<i class="fa fa-angle-right" aria-hidden="true" style="color:'+color+'"></i>&nbsp;' + '<span>' + lezione.nome + '</span><br>' +
			'&nbsp;&nbsp;' + lezione.ora_inizio + ' - ' + lezione.ora_fine + ', ' + lezione.aula;
			if(el_config.IndicazionePosto == '1' && lezione.posto) info_lezione = info_lezione + '<br>&nbsp;&nbsp;' + _lbl_posto_assegnato + ': ' + lezione.posto;
			info_lezioni.push(info_lezione);
		}
	}
	if(info_lezioni.length > 0){
		text_box += 
		'<hr><div style="color:'+color+';font-size:120%;padding-bottom:10px;">'+ _lbl_dettaglio_lezioni +'</div>' +
		'<div style="text-align:left">' + info_lezioni.join('<br>') + '</div>'; 
	}



	
	var box = renderBox({header:data_lezione, section_1: text_box, section_2: '', main_color: color, color_text_header:'#ffffff'});

	
	var content = 
	'<div id="custom_popup_'+turno.timestamp+index+'" class="mfp-hide white-popup">'+
		'<div class="row popup-title-aulestudio" style="color:'+color+';">'+_lbl_check_in_prenotazione+'</div>' +
		'<div class="row popup-text-aulestudio"><div style="display:inline-block;padding-top:10px;padding-bottom:10px;" id="qrcode_'+turno.qr+'"></div></div>' +
		// '<div class="row popup-title-aulestudio" style="color:'+color+'">'+_lbl_check_in_prenotazione+'</div>' +
		'<div class="row popup-text-aulestudio"><div style="display:inline-block;padding-top:10px;padding-bottom:10px;width:80%;">'+ _lbl_check_in_spiegazione_popup + '</div></div>' +
		'<div class="row popup-text-aulestudio"><div style="display:inline-block;width:290px;">'+ box +'</div></div>' +
	'</div>';

	return content;
}

function gestisciPrenotazione_apri_popup(entries_id, id_lesson, matricola, mode, odierna, codice_fiscale, id_btn_element, cancellabile, PrenotazioneSlot){
	// mode= prenota o gestisci

	var prenotata = $('#prenotata_'+id_lesson).val();
	if(prenotata == '0'){

		if($('#'+id_btn_element).hasClass('clicked')) return false;
		else $('#'+id_btn_element).addClass('clicked');

		$('#popup_conferma_title').html(_lbl_popup_prenotazione_effettuata_titolo);
		$('#popup_conferma_sub_title').html(_lbl_popup_prenotazione_effettuata_testo);
		$('#popup_conferma_buttons_row').html(
			'<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>'
		);
		if(odierna == 'false'){
			gestisciPrenotazione(entries_id, id_lesson, matricola, mode, odierna, codice_fiscale, id_btn_element, cancellabile, PrenotazioneSlot);
		}
		else{
			$('#popup_conferma_title').html(_lbl_prenotazione_odierna_non_canc_popup);
			$('#popup_conferma_sub_title').html('');
			$('#popup_conferma_buttons_row').html(
				'<button type="button" class="btn normal-button custom-btn-confirm" onclick="gestisciPrenotazione(\''+entries_id+'\', \''+id_lesson+'\', \''+matricola+'\', \''+mode+'\', \''+odierna+'\', \''+codice_fiscale+'\', \''+id_btn_element+'\', \''+cancellabile+'\', \''+PrenotazioneSlot+'\');">'+_lbl_conferma_operazione+'</button>'+
				'<button type="button" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();" >'+_lbl_annulla +'</button>'
			);
			$.magnificPopup.open({
				items: { src: '#popup_conferma' }, 
				type: 'inline'
			});
		}
		

	}else{
		$('#popup_conferma_title').html(_lbl_popup_annulla_prenotazione_titolo);
		$('#popup_conferma_sub_title').html('');
		$('#popup_conferma_buttons_row').html(
			'<button type="button" class="btn normal-button custom-btn-confirm" onclick="gestisciPrenotazione(\''+entries_id+'\', \''+id_lesson+'\', \''+matricola+'\', \''+mode+'\', \''+odierna+'\', \''+codice_fiscale+'\', \''+id_btn_element+'\', \''+cancellabile+'\', \''+PrenotazioneSlot+'\');">'+_lbl_conferma_operazione+'</button>'+
			'<button type="button" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();" >'+_lbl_annulla +'</button>'
		);
		$.magnificPopup.open({
			items: { src: '#popup_conferma' }, 
			type: 'inline'
		});
	}
	

}

function gestisciPrenotazione(entries_id, id_lesson, matricola, mode, odierna, codice_fiscale, id_btn_element, cancellabile, PrenotazioneSlot){
	$.magnificPopup.close();

	var prenotata = $('#prenotata_'+id_lesson).val();

	if(prenotata == '0'){
		var new_prenotata = 1;
		var url_ = './call_ajax.php?mode=salva_prenotazioni&codice_fiscale=' + codice_fiscale  + '&id_entries=' + entries_id;
		// if(odierna=='true'){
		if(cancellabile=='false'){
			var new_title = '';
			var new_label = '';
			var other_info = '<br><span class="explanation-text" style="font-weight:lighter">'+'Prenotazione non cancellabile'/* _lbl_non_si_puo_cancellare */+'</span>';
		}
		else{
			var new_title =  _lbl_annulla_prenotazione; 
			var new_label = label_elimina_prenotazione;
			var other_info = '';
		}
		var new_info_operation = label_prenotazione_effettuata + '&nbsp;';
		
	}
	else{
		var new_prenotata = 0;
		var url_ = './call_ajax.php?mode=cancella_prenotazioni&codice_fiscale=' + codice_fiscale  + '&id_entries=' + entries_id;
		var new_title = _lbl_verifica_prenota;
		var new_label = label_verifica_prenotazione;
		var new_info_operation = _lbl_prenotazione_annullata + '&nbsp;';
		var other_info = '';
		if(mode=="gestisci") other_info = _lbl_prenotazione_non_piu_visualizzata;

	}

	$.ajax({
		url : url_,
		type : 'GET',
		data : {id_btn_element: id_btn_element},
		dataType:'json',
		success : function(data) {
			var open_popup = true;
			$('#popup_conferma_title').html('');
			$('#popup_conferma_sub_title').html('');
			$('#popup_conferma_buttons_row').html('');

			if(data.result == 'Success' || data.Messaggio =="Cancellazione avvenuta con successo"){
				$('#prenotata_'+id_lesson).val(new_prenotata);
				$('#'+id_lesson).html(new_label);
				$('#'+id_lesson).prop('title', new_title);
				$('#info_operation_'+id_lesson).html(new_info_operation);
				$('#other_info_'+id_lesson).html(other_info);

				if(new_prenotata == 1){
					var lbl = '<span class="success-title">'+_lbl_prenotazione_effettuata+'</span><br>';
					if(PrenotazioneSlot == '0') lbl += '<span style="font-size:18px;">'+_lbl_hai_prenotato_la_lezione+':<br>'+ $('#riepilogo_string_'+id_lesson).html()+'</span><br><br>';
					lbl += '<span class="explanation-text" style="font-size:17px;"><p>'+_lbl_prenotazione_effettuata_text+'</p></span>';
				}
				else{
					var lbl = '<span class="neutral-title">'+_lbl_operazione_effettuata+'</span><br><span class="explanation-text" style="font-size:17px;"><p>'+_lbl_prenotazione_annullata_text+'</p></span>';
				}

				// gestione della riga sottostante con qrcode e checkin, solo per caso lezione singola, per caso slot la riga contiene l'operazione
				if(PrenotazioneSlot == '0'){
					if(new_prenotata == 1)
						$('#second_section_row_'+id_lesson).show();
					else if(new_prenotata == 0)
						$('#second_section_row_'+id_lesson).hide();
				}
				/* else{
					$('#second_section_row_'+id_lesson).html('prova modifica');
				} */


				// gestione dell'indicazione dei posti liberi
				var id_lesson_array = String(id_lesson).split('-'); // mi serve per il caso della prenotazione a slot

				for(var l in id_lesson_array){
					var current_id_lesson = id_lesson_array[l];
					var posti_liberi = parseInt($('#posti_liberi_string_'+current_id_lesson).attr('data-postiliberi'));
					if(new_prenotata == 0){
						var posti_liberi = parseInt($('#posti_liberi_string_'+current_id_lesson).attr('data-postiliberi')) + 1;
					}
					else{
						var posti_liberi = parseInt($('#posti_liberi_string_'+current_id_lesson).attr('data-postiliberi')) - 1;
					}
					
					$('#posti_liberi_string_'+current_id_lesson).attr('data-postiliberi', posti_liberi);

					var string_posti_liberi = '';
					if(posti_liberi <= 0) 	string_posti_liberi = '<br><span class="rounded-element-red">&nbsp;&nbsp;&nbsp;'+_lbl_non_ci_sono_posti+'&nbsp;&nbsp;&nbsp;</span>';
					if(posti_liberi == 1) 	string_posti_liberi = '<em><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_un_posto_libero+'&nbsp;<i class="fa fa-angle-double-left" aria-hidden="true"></i></em><br>';
					if(posti_liberi > 1) 	string_posti_liberi = '<em><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_ci_sono + posti_liberi + _lbl_posti_disponibili_su + $('#posti_liberi_string_'+current_id_lesson).attr('data-capacita')+'&nbsp;<i class="fa fa-angle-double-left" aria-hidden="true"></i></em><br>';
					

					if(PrenotazioneSlot == '0') $('#posti_liberi_string_'+current_id_lesson).html(string_posti_liberi);
					else $('#posti_liberi_string_'+current_id_lesson).html('');
				}
				
				$('#message-container-text').html(_lbl_operazione_effettuata);
				$('#message-container').show();

				$('#popup_conferma_title').html(lbl);
				if(typeof data.message !== 'undefined') $('#popup_conferma_sub_title').html('<hr>' + '<span style="font-size:20px">'+data.message+'</span>');
				// var prova = $('#popup_conferma_sub_title').html();
				// $('#popup_conferma_sub_title').html('<hr>' + '<span style="font-size:20px">'+"prova"+'</span>');
				$('#popup_conferma_buttons_row').html(
					'<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>'
				);

			
			}
			else if(data.result == 'Warning'){

				$('#popup_conferma_title').html('<span class="error-title">'+_lbl_prenotazione_non_consentita+'</span><br><span class="explanation-text" style="font-size:17px;">'+_lbl_prenotazione_non_consentita_text+'</span>');
				if(typeof data.message !== 'undefined') $('#popup_conferma_sub_title').html('<hr>' + '<span style="font-size:20px">'+data.message+'</span>');
				$('#popup_conferma_buttons_row').html(
					'<button type="button"  class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>'
				);


				$('#info_operation_'+id_lesson).html(label_prenotazione_non_consentita + '&nbsp;');
				$('#'+id_lesson).html(label_riprova_prenotazione);
				$('#'+id_lesson).prop('title', _lbl_riprova);
			}
			else if(data.result == 'Error'){
				$('#popup_conferma_title').html('<span class="error-title">'+_lbl_prenotazione_non_consentita+'</span><br><span class="explanation-text" style="font-size:17px;">'+_lbl_prenotazione_non_consentita_text+'</span>');
				if(typeof data.message !== 'undefined') $('#popup_conferma_sub_title').html('<hr>' + '<span style="font-size:20px">'+data.message+'</span>');
				$('#popup_conferma_buttons_row').html(
					'<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>'
				);

				$('#info_operation_'+id_lesson).html(label_prenotazione_non_consentita + '&nbsp;');
				$('#'+id_lesson).html(label_riprova_prenotazione);
				$('#'+id_lesson).prop('title', _lbl_riprova);
			}
			else{
				$('#popup_conferma_title').html(_lbl_operazione_non_effettuata);
				$('#popup_conferma_buttons_row').html(
					'<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>'
				);
			}

			if(open_popup){
				$.magnificPopup.open({
					items: { src: '#popup_conferma' }, 
					type: 'inline'
				});	
			}
			$('#'+id_btn_element).removeClass('clicked');

			
		},
		error : function(request,error)
		{ console.log('custom error 1'); }
	});	

}

function renderBox(options){

	var header = '';
	var section_1 = '';
	var section_2 = '';
	var options_section_2 = '';
	if(options.options_section_2) options_section_2 = options.options_section_2;
	if(options.header != '') header = '<div class="colored-box-header" style="background-color:'+options.main_color+';color:'+options.color_text_header+';">'+ options.header +'</div>';
	if(options.section_1 != '') section_1 = '<div class="colored-box-section-1">'+ options.section_1 +'</div>';
	if(options.section_2 != '') section_2 = '<div class="colored-box-section-2" '+options_section_2+'>'+ options.section_2 +'</div>';
	
	var box =
		'<div class="colored-box" style="border:1px solid '+options.main_color+';">'+
			header+
			section_1+
			section_2+
		'</div>';
	return box;
}


// POSTO IN AULA
function printLezioniPosto(lezioni_prenotate, container_id, config_rileva_posto_aula, codice_fiscale){
	
	$('#'+container_id).empty();

	var n_lezioni_prenotate = 0;
	var html_table_dichiara_posto = '';
	for(index in lezioni_prenotate){
		var turno_corrente = lezioni_prenotate[index];
		for(index_lezione in turno_corrente['prenotazioni']){
			
			var lezione = turno_corrente['prenotazioni'][index_lezione];
			if(lezione['PresenzaAula'] == 1) continue;
			if(!lezione['check']) continue;

			n_lezioni_prenotate ++;

			style_right_select = '';
			style_right_salva = '';
			if(config_rileva_posto_aula != '1'){
				style_right_select = 'padding-top:30px';
				style_right_salva = 'padding-top:10px';

			}


			html_table_dichiara_posto += 
				'<div id="row_'+lezione['entry_id']+'" class="row" style="text-align:center;display:inline;vertical-align:middle;">'+

					'<div id="riepilogo_lezione_'+lezione['entry_id']+'" class="col-md-4" style="margin-bottom:30px;line-height:25px;">'+
						'<b>' + turno_corrente['data'] + '&nbsp;' + lezione['ora_inizio'] + ' - ' + lezione['ora_fine'] + '</b><br>' + lezione['aula'] + ' [' + turno_corrente['sede']+ ']' + '<br>' + '<span class="libretto-course-name">'+ lezione['nome'] + '</span>' +
					'</div>'+

					'<div id="operazioni_posto_'+lezione['entry_id']+'" class="col-md-8" style="text-align:left">'+
						'<div class="row">'+
							'<div class="col-md-10">'+

								'<div class="row" style="'+style_right_select+'">'+
									'<div class="col-xs-6" style="text-align:right"><label for="selct_presenza_'+lezione['entry_id']+'">'+_lbl_presente_non_presente+': </label></div>'+
									'<div class="col-xs-6"><select id="selct_presenza_'+lezione['entry_id']+'" name="selct_presenza_'+lezione['entry_id']+'" class="selct_presenza autocomplete form-control full-width" data-posto-id="txt_posto_'+lezione['entry_id']+'"><option value="">-- </option><option value="0">'+_lbl_non_presente+' </option><option value="1">'+_lbl_presente+'</option></select></div>'+
								'</div>';

								if(config_rileva_posto_aula == '1')
								html_table_dichiara_posto += 
								'<div class="row" style="margin-top:10px;">'+
									'<div class="col-xs-6" style="text-align:right"><label for="txt_posto_'+lezione['entry_id']+'">'+_lbl_dichiara_posto+': </label></div>'+
									'<div class="col-xs-6"><input class="highlight form-control" type="text" id="txt_posto_'+lezione['entry_id']+'" name="txt_posto_'+lezione['entry_id']+'" style="width:100%;" disabled></div>'+
								'</div>';
								
								
							html_table_dichiara_posto +=
							'</div>'+

							'<div class="col-md-2" style="text-align:center;margin-top:20px;font-size:20px;'+style_right_salva+'">'+
								'<a href="#" '+
									'onclick="gestisciPosto_apri_popup('+
										lezione['entry_id']+', '+
										'\''+config_rileva_posto_aula+'\', '+
										'\''+codice_fiscale+'\');" id="salva_posto_'+lezione['entry_id']+'" data-lezione-id="'+lezione['entry_id']+'" class="custom-color"><i class="fa fa-angle-double-right" aria-hidden="true"></i>&nbsp;'+_lbl_salva+'</a>' +
							'</div>'+
						'</div>'+
					'</div>'+


				'</div><hr style="border-top:solid 1px #999999">';


		}
	}
		
	$('#n_eventi_da_inserire_n_posto').html(n_lezioni_prenotate);  
	

	
	$('#'+container_id).html('<div class="login-border-container row">' + html_table_dichiara_posto + '</div>');
	$('.selct_presenza').select2({ width: '100%' });           

	
	
	/* $('.selct_presenza').change(function(){
		var posto_txt_id = $(this).attr('data-posto-id');
		if(config_rileva_posto_aula == '1' && $(this).val() == 1){
			$('#'+posto_txt_id).prop('disabled', false);
		}else{
			$('#'+posto_txt_id).prop('disabled', true);
		}
	}); */
	

}

function gestisciPosto_apri_popup(entry_id, config_rileva_posto_aula, codice_fiscale){

	var titolo = '';
	var sottotitolo = '';
	var btn_row = '';


	presente = $('#selct_presenza_'+entry_id).val();
	posto = $('#txt_posto_'+entry_id).val();
	
	if(presente == ''){
		titolo = _lbl_popup_no_presente_assente_titolo;
		sottotitolo = _lbl_popup_no_presente_assente_testo;
		btn_row = '<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>';
	}
	else if(presente == '0'){
		titolo = _lbl_popup_assente_titolo;
		sottotitolo = _lbl_popup_assente_testo + '<br><br>' + $('#riepilogo_lezione_'+entry_id).html() + '<br><br><span class="popup-title-aulestudio">' + _lbl_sei_sicuro_di_salvare + '</span>';
		btn_row = '<button type="button" class="btn normal-button custom-btn-confirm" onclick="gestisciPosto('+entry_id+', '+presente+', \''+posto+'\', \''+codice_fiscale+'\');">'+_lbl_conferma_operazione+'</button>'+
		'<button type="button" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();" >'+_lbl_annulla +'</button>';
	}
	else if(presente == '1'){
		if(config_rileva_posto_aula==1 && (!posto || posto=='undefined')){
			titolo = _lbl_popup_presente_no_posto_titolo;
			sottotitolo = _lbl_popup_presente_no_posto_testo;
			btn_row = '<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_ho_capito +'</button>';
		}
		else{
			titolo = _lbl_popup_presente_titolo;
			sottotitolo = _lbl_popup_presente_testo_1+'<br><br>' + $('#riepilogo_lezione_'+entry_id).html();
			if(config_rileva_posto_aula==1)
				sottotitolo += '<br><br>' + _lbl_popup_presente_testo_2+'<br><b>'+posto+'</b>';

			sottotitolo += '<br><br><span class="popup-title-aulestudio">' + _lbl_sei_sicuro_di_salvare + '</span>';
			btn_row = '<button type="button" class="btn normal-button custom-btn-confirm" onclick="gestisciPosto('+entry_id+', '+presente+', \''+posto+'\', \''+codice_fiscale+'\');">'+_lbl_conferma_operazione+'</button>'+
			'<button type="button" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();" >'+_lbl_annulla +'</button>';
		}
	}
	else{
		titolo = _lbl_errore;
		sottotitolo = '';
		btn_row = '<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>';
		console.log('azione sconosciuta prenota posto');
	}

	$('#popup_conferma_posto_title').html(titolo);
	$('#popup_conferma_posto_sub_title').html(sottotitolo);
	$('#popup_conferma_posto_buttons_row').html(btn_row);
	$.magnificPopup.open({
		items: { src: '#popup_conferma_posto' }, 
		type: 'inline'
	});

}

function gestisciPosto(entry_id, presente, posto, codice_fiscale){
	
	var url_ = './call_ajax.php?mode=gestisci_posto';
 	
	$.ajax({
		url : url_,
		type : 'POST',
		data : {CodiceFiscale: codice_fiscale, Entry:entry_id, Stato:presente, Posto:posto},
		dataType:'json',
		success : function(data) {
			if(data == 200){
				$('#popup_conferma_posto_title').html('');
				$('#popup_conferma_posto_sub_title').html('');
				$('#popup_conferma_posto_buttons_row').html('');


				var riepilogo = '';
				if(presente == '1'){
					riepilogo = _lbl_popup_riepilogo_presente;
					if(posto && posto!='undefined') riepilogo += ' '+_lbl_popup_riepilogo_posto + ' <b>' + posto + '</b>';
					else riepilogo += '.';
				}
				else{
					riepilogo = _lbl_popup_riepilogo_assente;
				}

				// gestisco la riga
				var riepilogo_lezione = $('#riepilogo_lezione_'+entry_id).html();
				// style_right_select = 'padding-top:30px';
				// style_right_salva = 'padding-top:10px';

				$('#row_'+entry_id).html(
				'<div class="col-md-4" style="margin-bottom:30px;">'+riepilogo_lezione+'</div>'+
				'<div class="col-md-8" style="margin-bottom:30px;">'+
				'<div class="row">'+
					'<div class="col-md-10" style="font-size:17px;padding-top:30px">'+
					riepilogo+
					'</div>'+
					'<div class="col-md-2" style="font-size:20px;color:green;padding-top:30px">'+
						'<i class="fa fa-check" aria-hidden="true" style="color:green"></i>&nbsp;'+_lbl_salvato+'</div>'+
					'</div>'
				);


				lbl = 
					'<span class="success-title">'+_lbl_operazione_effettuata+'</span><br>'+
					'<span class="explanation-text" style="font-size:17px;"><p>'+riepilogo+'</p></span>';
				$('#popup_conferma_posto_title').html(lbl);
				// if(typeof data.message !== 'undefined') $('#popup_conferma_posto_sub_title').html('<hr>' + data.message);
				$('#popup_conferma_posto_buttons_row').html('<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>');



	
			}
			
		},
		error : function(request,error)
		{ console.log('custom error 2'); }
	});	
}


// INSEGNAMENTI EXTRACURRICULARI
function gestisciInsegnamentoExtraApriPopup(id_corso, operazione, codice_fiscale, identificativo_riga_insegnamento){

	var titolo = '';
	var sottotitolo = '';
	var btn_row = '';
	var nome_insegnamento = '<b>' + $('#nome_insegnamento_'+identificativo_riga_insegnamento).html() + '</b>';
	var n_ins_aggiunti = parseInt($('#num_insegnamenti_extracurriculari').val());
	var n_ins_config =  parseInt($('#num_insegnamenti_extracurriculari_config').val());

	if(operazione == 'aggiungi' && n_ins_aggiunti + 1 > n_ins_config){
		titolo = _lbl_num_ins_extra_raggiunto_popup_title;
		sottotitolo = _lbl_num_ins_extra_raggiunto_popup_text;
		btn_row = '<button type="button" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();" >'+_lbl_ho_capito +'</button>';
	}
	else if(operazione == 'aggiungi'){
		titolo = _lbl_conferma_aggiunta_al_profilo_1 + nome_insegnamento + _lbl_conferma_aggiunta_al_profilo_2;
		if(config_el_prenotazione_slot == '0') sottotitolo = _lbl_popup_aggiunta_extra_txt;
		else sottotitolo = _lbl_popup_aggiunta_extra_txt_slot;
		
		if(! identificativo_riga_insegnamento.includes("extrasel")){
			style_btn = 'style="width:350px;"';
			btn_torna_al_profilo = '<button type="button" '+ style_btn +' class="btn normal-button custom-btn-confirm" onclick="gestisciInsegnamentoExtra('+id_corso+', \''+operazione+'\', \''+codice_fiscale+'\', \''+identificativo_riga_insegnamento+'\', \''+link_menu_prenotalezione_profilo+'\');">'+_lbl_conferma_operazione_e_torna+'</button>';
			btn_row = 
			'<button type="button" style="width:350px;" class="btn normal-button custom-btn-confirm" onclick="gestisciInsegnamentoExtra('+id_corso+', \''+operazione+'\', \''+codice_fiscale+'\', \''+identificativo_riga_insegnamento+'\', \''+link_menu_prenotalezione_profilo+'\');">'+_lbl_conferma_operazione_e_torna+'</button>'+
			'<button type="button" style="width:350px;" class="btn normal-button custom-btn-confirm" onclick="gestisciInsegnamentoExtra('+id_corso+', \''+operazione+'\', \''+codice_fiscale+'\', \''+identificativo_riga_insegnamento+'\', \'\');">'+_lbl_conferma_operazione_e_rimani+'</button>'+
			'<button type="button" style="width:350px;" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();" >'+_lbl_annulla +'</button>';
		}
		else{
			btn_row = 
			'<button type="button" class="btn normal-button custom-btn-confirm" onclick="gestisciInsegnamentoExtra('+id_corso+', \''+operazione+'\', \''+codice_fiscale+'\', \''+identificativo_riga_insegnamento+'\', \'\');">'+_lbl_conferma_operazione+'</button>'+
			'<button type="button" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();" >'+_lbl_annulla +'</button>';
		}

	}
	else if(operazione == 'elimina'){
		titolo = _lbl_conferma_elimina_al_profilo_1 + nome_insegnamento + _lbl_conferma_elimina_al_profilo_2;
		if(config_el_prenotazione_slot == '0') sottotitolo = _lbl_popup_elimina_extra_txt;
		else  sottotitolo = _lbl_popup_elimina_extra_txt_slot;
		btn_row = '<button type="button" class="btn normal-button custom-btn-confirm" onclick="gestisciInsegnamentoExtra('+id_corso+', \''+operazione+'\', \''+codice_fiscale+'\', \''+identificativo_riga_insegnamento+'\', \'\');">'+_lbl_conferma_operazione+'</button>'+
		'<button type="button" class="btn normal-button custom-btn-delete" onclick="$.magnificPopup.close();" >'+_lbl_annulla +'</button>';
	}else{
		titolo = _lbl_errore;
		sottotitolo = '';
		btn_row = '<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>';
		console.log('azione sconosciuta inserimento insegnamenti extra');
	}


	$('#popup_conferma_ins_extra_title').html(titolo);
	$('#popup_conferma_ins_extra_sub_title').html(sottotitolo);
	$('#popup_conferma_ins_extra_buttons_row').html(btn_row);
	$.magnificPopup.open({
		items: { src: '#popup_conferma_ins_extra' }, 
		type: 'inline'
	});
}

function gestisciInsegnamentoExtra(id_corso, operazione, codice_fiscale, identificativo_riga_insegnamento, link_back){
	// alert("operazione= "+ operazione + " id_corso="+ id_corso + " codice_fiscale="+ codice_fiscale + " identificativo_riga_insegnamento="+ identificativo_riga_insegnamento	);
	var n_ins_aggiunti = parseInt($('#num_insegnamenti_extracurriculari').val());
	var n_ins_config =  parseInt($('#num_insegnamenti_extracurriculari_config').val());
	var id_periodo_didattico =  $('#id_periodo_didattico_'+identificativo_riga_insegnamento).val();
	var id_corso_laurea =  $('#id_corso_laurea_'+identificativo_riga_insegnamento).val();
	
	if(operazione == 'aggiungi'){
		n_ins_aggiunti = n_ins_aggiunti + 1;
		var save_delete = getSaveDeleteHtml(identificativo_riga_insegnamento, _lbl_elimina, id_corso, 'elimina', codice_fiscale, $('#nome_insegnamento_'+identificativo_riga_insegnamento).html()); 
		var url_ = './call_ajax.php?mode=salva_insegnamento_extracurriculare&codice_fiscale='+codice_fiscale+'&id_corso='+id_corso+'&id_periodo_didattico='+id_periodo_didattico+'&id_corso_laurea='+id_corso_laurea;
		var text_popup = _lbl_extra_aggiunto_popup_text;
	}else if(operazione == 'elimina'){
		n_ins_aggiunti = n_ins_aggiunti - 1;
		var save_delete = getSaveDeleteHtml(identificativo_riga_insegnamento, _lbl_aggiungi, id_corso, 'aggiungi', codice_fiscale, $('#nome_insegnamento_'+identificativo_riga_insegnamento).html()); 
		var url_ = './call_ajax.php?mode=rimuovi_insegnamento_extracurriculare&codice_fiscale='+codice_fiscale+'&id_corso='+id_corso;
		var text_popup = _lbl_extra_eliminato_popup_text;
	}
	
	$.ajax({
		url : url_,
		type : 'POST',
		data : {CodiceFiscale: codice_fiscale, Corso:id_corso, id_periodo_didattico:id_corso_laurea, id_corso_laurea:id_corso_laurea},
		dataType:'json',
		success : function(data) {
			if(data['statusCode'] == 200){
				$('#'+identificativo_riga_insegnamento).html(save_delete);
				$('#num_insegnamenti_extracurriculari').val(n_ins_aggiunti);
				if(n_ins_aggiunti >= n_ins_config){
					$('#modifica_extracurr').hide();
					$('#msg_numero_insegnamenti_raggiunto').show();
				}else{
					$('#modifica_extracurr').show();
					$('#msg_numero_insegnamenti_raggiunto').hide();
				}
			}
			if(link_back != ''){
				window.location.href = link_back;
			}else{
				$('#popup_conferma_ins_extra_title').html(_lbl_operazione_effettuata);
				$('#popup_conferma_ins_extra_sub_title').html(text_popup);
				$('#popup_conferma_ins_extra_buttons_row').html('<button type="button" class="btn normal-button custom-btn-service" onclick="$.magnificPopup.close();">'+_lbl_chiudi +'</button>');	
			}
			
		},
		error : function(request,error)
		{ console.log('custom error 3'); }
	});	

	

}

function getSaveDeleteHtml(identificativo_riga_insegnamento, _lbl_azione, insegnamento_data_id, azione, codice_fiscale, insegnamento_data_nome){
	var icon = 'fa fa-plus-circle fa-2x'; 
	if(azione == 'elimina') icon = 'fa fa-trash-o fa-2x'; 
	var string =  
	'<span id="'+identificativo_riga_insegnamento+'">'+
		'<a href="#"  aria-label="'+_lbl_azione+'" onclick="gestisciInsegnamentoExtraApriPopup('+insegnamento_data_id+', \''+azione+'\', \''+codice_fiscale+'\', \''+identificativo_riga_insegnamento+'\')" style="color:#4b5159">'+
			'<i class="'+icon+'" aria-hidden="true" title="'+_lbl_elimina+' '+insegnamento_data_nome+'"></i>'+
		'</a>'+
	'</span>';
	return string;
}

