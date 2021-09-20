# Script per prenotarsi in automatico alle lezioni in presenza su kairos

## ⚠️ lo script potrebbe smettere di funzionare da un momento all'altro senza preavviso, specie se cambiano le politiche di login da Ottobre ⚠️

### Kairos non funziona? Non vuoi restare sveglio domenica notte perchè il giorno dopo hai lezione? Questa potrebbe essere una soluzione per te!

## 🔧 Per configurare lo script: [setup](docs/setup.md)

## Stato corrente:
   - Lo script controlla la presenza del token di accesso (che non è altro che una serie di parametri in formato JSON codificati in BASE64)
   - controlla la connessione a kairos, (ed eventualmente) a google
   - se non è mai stato effettuato il login, lo effettua e salva il token di accesso nel file [secret.py](/secret.py)
   - procede ad ottenere la lista delle lezioni
   - prenota le lezioni 
---

## ❔ Progressi/nuove funzioni: 
💻 [note](docs/note.md)

# ❗️❗️Disclaimer:
Fate quello che vi pare ma non rompete perchè non sono responsabile se per qualche motivo il vostro ip viene bannato per spam di richieste o non riuscite a prenotarvi in tempo perchè il programma non è partito in tempo per la corsa di lunedì a mezzanotte e quindi tutti i posti sono già finiti.
