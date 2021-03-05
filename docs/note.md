# LOGIN AUTOMATICO E AUTOPRENOTAZIONE LEZIONI SU KAIROS

----------------------

## TODO:

- con questo vado sul login di shibboleth e mi riporta su kairos <https://kairos.unifi.it/auth/auth_app_test.php?response_type=token&client_id=client&redirect_uri=https://kairos.unifi.it/agendaweb/index.php?view=login&scope=openid+profile>
- una volta giunto in quella pagina facccio login e copio cookies

-------------------------------------------------------------------

# cosa fanno i file in */test vari/* ?

## .

### bella domanda.. però:

- [testv2.py]("./test_vari/testv2.py") è la prova che gesoo può essere stronzo e devo manipolare il risultato ottenuto dalla pagina come fosse una **lista**
- [test.py]('test_vari/test.py') sto stronzo è caos
- [test.py]("../test_vari/test.py")
- # marameo.py
  è molto importante perchè c'è lo script che fa l'autologin



---

# **WOW**

1. Fare POST a ``` https://shibboleth.unifi.it/idp/profile/SAML2/Redirect/SSO?execution=e1s1 ``` con body ``` _eventId_proceed=&j_password=PASSWORD&j_username=MATRICOLA ```
2. quella richiesta restituirà un indirizzo che aperto in un browser creerà i cookies necessari per effettuare il login
3. a questo punto basterà copiare i cookies ed utilizzarli nella richiesta della lista delle lezioni per la settimana
4. questo è l'url **brutto** a cui fare la richiesta ``` import requests url = 'https://kairos.unifi.it/agendaweb/index.php?view=prenotalezione&include=prenotalezione&_lang=it' headers = {'Connection': 'keep-alive','Pragma': 'no-cache','Cache-Control': 'no-cache','Upgrade-Insecure-Requests': '1','User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36','Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9','Sec-GPC': '1','Sec-Fetch-Site': 'same-origin','Sec-Fetch-Mode': 'navigate','Sec-Fetch-User': '?1','Sec-Fetch-Dest': 'document','Referer': 'https://kairos.unifi.it/agendaweb/index.php?view=prenotalezione&include=prenotalezione_home&_lang=it','Accept-Encoding': 'gzip, deflate, br','Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7','Cookie': 'PHPSESSID=2v3t0h74gantu09f84n7v7b9i4; _shibsession_6b6169726f732e756e6966692e697468747470733a2f2f6b6169726f732e756e6966692e69742f73686962626f6c657468=_1776eaa64fb4d278b7998890c8bb646a'}    req = requests.get(url, headers=headers)  print(req.status_code)  print(req.headers)\print(req.text) ```
