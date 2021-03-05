# Setup:

- è necessario dichiarare quale webdriver usare nel codice e bisogna controllare che questo sia stato aggiunto a  ``` %PATH%  ```
  - [geckodriver](https://github.com/mozilla/geckodriver/releases) (per Firefox)
  - [chromedriver](https://chromedriver.chromium.org/downloads) (per Chrome)


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

# ciao sono pigro e non ho finito di scrivere ciao
