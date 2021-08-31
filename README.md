# LOGIN AUTOMATICO E AUTOPRENOTAZIONE LEZIONI SU KAIROS

---------

# Per la configurazione guarda: [setup](docs/setup.md)

## Stato corrente:
   
   - Lo script agisce in 6 fasi:
      1. Autologin su kairos mediante emulazione del browser tramite [Selenium](https://www.selenium.dev/documentation/en/) 
      2. Acquisizione di tutta la pagina html e dei cookie presenti
      3. Reformattazione della pagina contenente tutte le prenotazioni per estrapolare una stringa json trattabile in python
      4. Acquisizione della stringa in formato Json
      5. due cicli ```for``` passano in esame tutte le possibili lezioni prenotabili e per ognuna di queste
      6. Viene fatta una richiesta all'API (non pubblico) di kairos che effettua effettivamente la prenotazione.

---

## Cose che mancano/cosa succede: 

[note](docs/note.md)