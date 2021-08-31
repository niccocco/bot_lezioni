# LOGIN AUTOMATICO E AUTOPRENOTAZIONE LEZIONI SU KAIROS

----------------------



Allora il procedimento con il quale questo programma funziona è abbastanza semplice e probabilmente non è neanche il modo più veloce/efficiente (vedi cose da fare)


## Cose da fare:

- non dover dipendere da selenium per effettuare il login ma utilizzare [requests](https://requests.readthedocs.io/en/master/)
- non dover dipendere da selenium per l'acquisizione della stringa delle lezioni
- aggiungere la possibilità di selezionare quali lezioni prenotare/non prenotare (è presente un accenno ma non funziona bene)
- aggiungere la possibilità di notificare tramite mail/MQTT l'avvenuta prenotazione per un feedback visivo in caso di deployment in un server headless
- Aggiungere la funzione di auto-riprova della prenotazione nel caso il server di kairos non fosse (ancora) raggiungibile