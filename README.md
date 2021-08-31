# Script per prenotarsi in automatico alle lezioni in presenza su kairos

## ⚠️⚠️⚠️ lo script potrebbe smettere di funzionare da un momento all'altro senza preavviso, specie se cambiano le politiche di login da Ottobre ⚠️⚠️⚠️

## 🔧 Per configurare lo script: [setup](docs/setup.md)

## Stato corrente:
   
   - Lo script agisce in 5 fasi:
      1. Autologin su kairos mediante emulazione del browser con [Selenium](https://www.selenium.dev/documentation/en/) 
      2. Scrape di tutta la pagina html e dei cookie presenti
      3. Reformattazione della pagina contenente tutte le prenotazioni per estrapolare una stringa json
      4. Acquisizione della stringa
      5. Richiesta a kairos di prenotarsi per ciascun giorno uno dopo l'altro

---

## ❔ Cose che mancano/cosa succede: 
💻 [note](docs/note.md)

# ❗️❗️Disclaimer:
Fate quello che vi pare ma non rompete perchè non sono responsabile se per qualche motivo il vostro ip viene bannato per spam di richieste o non riuscite a prenotarvi in tempo perchè il programma non è partito in tempo per la corsa di lunedì a mezzanotte e quindi tutti i posti sono già finiti.
