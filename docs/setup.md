# Setup:

- è necessario dichiarare quale webdriver usare nel codice e bisogna controllare che questo sia stato aggiunto a  ``` %PATH%  ```
  - [geckodriver](https://github.com/mozilla/geckodriver/releases) (per Firefox)
  - [chromedriver](https://chromedriver.chromium.org/downloads) (per Chrome)
  - [Forse ci sono un briciolo di informazioni aggiuntive su questa pagina](https://www.selenium.dev/documentation/en/getting_started_with_webdriver/browsers/)


---

## STO DANDO PER SCONTATO CHE TU SAPPIA COME SI CLONA UNA REPOSITORY DA GITHUB
altrimenti tipo cerca un tutorial su gluglu percè mi fa fatica dirti che se hai già git installato (se se non ce l'hai che aspetti ad installarlo..) ti basterà fare ```git clone https://github.com/niccocco/bot_lezioni.git``` da riga di comando (cmd)

---

## Detto questo continuiamo:
- Per inserire le tue credenziali puoi:
  - creare un file chiamato ``` secrets.py ``` e al suo interno inserire i tuoi dati in questo modo:\n
   ```
      PASSWORD = "LATUAPASSWORD"
      MATRICOLA = "123456"
      CODICE_FISCALE = 'codicefiscaleminuscolo' //in realtà non credo cambi nulla tra maisucolo e minuscolo... maaa ```

- poi devi installare i pacchetti aggiuntivi che ho usato. Per fare questo devi aprire il ```cmd``` 
  e scrivere ``` python -m pip install -r requirements.txt ```


## Adesso in TEORIA se apri il file ```script.py``` da riga di comando scrivendo ```python script.py``` dovrebbe partire

(capisci che funziona guardando cosa ti viene scritto in console)(ovviamente devi andare nella cartella che hai creato (molto probabilmente involontariamente) clonando la repository)

# Attenzione: Lo script di per sè non autoprenota un bel niente!!

Per "attivare" la funzione di autoprenotazione è necessario automatizzare l'esecuzione dello script python ad un certo momento nella giornata/settimana. Mentre su linux basta usare ad esempio ```crontab```, su windows bisogna ricorrere ad un piccolo sgamo:

- crea un file batch (cioè che finisce con .bat) da qualche parte nel tuo computer
- crea un piccolo script che faccia cambiare directory e successivamente esegua lo script python.
Un esempio di questo è nel file esempio_auto.bat .
  - **Nota** che devi cambiare i percorsi affinchè riflettano la tua situazione sul **tuo** pc
- Accedere all'"utilità di pianificazione" e creare una nuova regola. Ma per questo conviene cercare un tutorial su google