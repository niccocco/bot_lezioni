# Script per prenotarsi in automatico alle lezioni in presenza su kairos


## 🔧 Per configurare lo script: [setup](docs/setup.md)

## Stato corrente:
   
   - Lo script agisce in 5 fasi:
      1. Autologin su kairos mediante emulazione del browser con [Selenium](https://www.selenium.dev/documentation/en/) 
      2. Scrape di tutta la pagina html e dei cookie presenti
      3. Reformattazione della pagina contenente tutte le prenotazioni per estrapolare una stringa json
      4. Acquisizione della stringa
      5. Richiesta a kairos di prenotarsi per ciascun giorno uno dopo l'altro

---

## Cose che mancano/cosa succede: 

[note](docs/note.md)
