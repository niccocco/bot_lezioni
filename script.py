from bs4 import BeautifulSoup
import sys, time, requests, json
from bs4.element import PYTHON_SPECIFIC_ENCODINGS
from os import error, linesep

from secret import MATRICOLA, PASSWORD, CODICE_FISCALE

#TODO: aggiungere la possibilità di aggiungere automaticamente i parametri di matricola e password, anche poerchè il codice fiscale su può ottenere decodificando il token in base 64
#TODO: add telegram bot integration

#devo controllare che il file secrets contenga tutti i parametri:
lineaTokenContenuta = "TOKEN"
secretsFile = open("secret.py", "r")
lineeSecrets = secretsFile.readlines()
tokenSalvato = False
secretsFile.close()

for linea in lineeSecrets:
    if lineaTokenContenuta in linea:
        #esiste una variabile che si chiama token, posso importare tutto
        from secret import TOKEN
        tokenSalvato = True
        print("!! trovato token salvato !!")
if tokenSalvato == False:
    print(
        "!! token non salvato, questa vikta la prenotazione sarà più lunga !!")
# fine controllo salvataggio token

debug = False  #se falso, non esegue il programma in uatomatico quando invocato
debugLog = False  # mostra o nasconde tutti i mesasggi con livello 2


class erroreRispostaPrenotazione(Exception):
    pass


headers = {
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    'Accept':
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'DNT': '1',
    'Accept-Language': 'it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate, br'
}


tempo_refresh_stallo = 60

url_redirect = "https://kairos.unifi.it/auth/auth_app_test.php?response_type=token&client_id=client&redirect_uri=https://kairos.unifi.it/agendaweb/index.php%3Fview=login&scope=openid+profile"
urlPrenotazione = "https://kairos.unifi.it/agendaweb/call_ajax.php?mode=salva_prenotazioni&codice_fiscale={}}&id_entries=[{}}]"



print(
    "Programma fatto male da Niccolo Cocchi. Non ho nessuna responsabilità per qualsiasi uso del software"
)


class kairosBot():
    """Classe contentente:\n
        logIn() che permette il login automatico su kairos, la lettura della lista delle lezioni e il controllo della connessione ad internet\n
        prenotaPlis() permette di automatizzare il processo di prenotazione vero e proprio """
    def __init__(self) -> None:
        print("ciao")

        #variabili utili:
        self.tentativiKairos = 0  # counter dei tentativi di contatto di kairos
        self.tentativiInternet = 0  # counter                  controllo connessione internet

        self.internetOn = False  # serve per evitare di ricontrollare la connessione ad internet se quest controllo è già stato eseguito con successo
        self.isGoogleOnline = False  # serve per vedere se il pc è connesso ad internet
        
        self.secondiKairos = 60 # tempo tra un tentativo e l'altro
        self.secondiGoogle = 20

        self.dataLogin = {
            "j_username": MATRICOLA,
            "j_password": PASSWORD,
            "_eventId_proceed": ""
        }

        if tokenSalvato == True:
            self.access_token = TOKEN

        #
        #controlli e decisioni si svolgono qua:
        #1] in ogni caso in primis controlliamo se kairos è online, anche perchè non ha senso continuare altrimenti
        #
        #2] se il token non è stato salvato, lo ottengo
        #
        #3] se kairos è online e il token è già stato salvato
        if self.internetOn == False:
            self.controlloInternet(self.internetOn)

        if tokenSalvato == False:
            self.ottieniToken()

        self.prenota()
        #
        #

    def inizio(self):

        self.__init__


    def controlloInternet(self, sitoOn):
        """Controlla se il sito è online, altrimenti spregiudica la possibilità che il pc non sia connesso ad internet e aspetto finchè """
        self.isGoogleOnline = False
        self.sitoOn = sitoOn
        while self.sitoOn == False:
            try:
                printLivelli("Provo a contattare kairos", 4)
                sys.stdout.flush()

                kairosHead = requests.head(
                    url="https://kairos.unifi.it",
                    timeout=(10, 20))  #10s di timeout sono più che sufficienti
                #la parte di codice che segue viene eseguita solo se la richiesta va a buon fine

            except KeyboardInterrupt:  #usciamo dal programma perchè è stato fatto contol+c, serve per scappare dalla richiesta
                sys.exit(0)

            except:
                #arriviamo qua se kairos non è raggiungibile
                printLivelli(
                    "Errore di connessione con kairos",
                    3)
                self.tentativiKairos += 1

                #se kairos non è raggiungibile, controllo che almeno il computer sia online
                while self.isGoogleOnline == False:
                    try:
                        self.tentativiInternet += 1
                        printLivelli("controllo la connessione ad internet contattando google")
                        google204 = requests.head(
                            url=
                            "https://connectivitycheck.gstatic.com/generate_204",
                            timeout=(5, 10))
                        printLivelli(google204.status_code, 2)

                        if google204.status_code == 204:
                            printLivelli("ok, internet fa", livello=1)
                            self.isGoogleOnline = True
                        else:
                            printLivelli(
                                "Ho ricevuto una risposta da google che non era quella prevista. Ma è pur sempre una risposta quindi la connessione è avvenuta con successo e internet è presente",
                                3)

                    except:
                        #errore di connessione a google
                        printLivelli(
                            stringa=
                            "Probabilmente il DNS del tuo PC o in generale la connessione ad internet non è disponibile al momento",
                            livello=3)
                        printLivelli(stringa="Ritento tra {} secondi".format(self.secondiGoogle),
                                     livello=0)
                        time.sleep(self.secondiGoogle)#questo tempo di attesa vale solo se google non risponde

                    else:
                        printLivelli(
                            stringa=
                            "Connessione con il server google riuscita, internet è disponibile, il problema è di kairos",
                            livello=1)
                        self.isGoogleOnline = True

                printLivelli("------STATISTICHE TENTATIVI------", 2)
                printLivelli("| KAIROS \t\t \t{}  |".format(
                    self.tentativiKairos),
                             livello=2)
                printLivelli("| INTERNET tentativi \t  {}|".format(
                    self.tentativiInternet),
                             livello=2)
                printLivelli("---------------------------------", livello=2)

                printLivelli("Riprovo tra {} secondi".format(self.secondiKairos),0)
                for s in range(self.secondiKairos): # controllo visivo che il programma stia circa funzionando
                    print(".", end=" ")
                    sys.stdout.flush()
                    time.sleep(1)

                time.sleep(self.secondiKairos)
                self.sitoOn = False

            else:
                printLivelli("-> Kairos è raggiungibile.", 1)
                printLivelli("Codice {}".format(kairosHead.status_code), 2)
                self.sitoOn = True
                self.isGoogleOnline = True

        print("Problema di connessione risolto")

    def ottieniToken(self):
        """Ottiene l'access_token corrispondente all'utente e lo salva in secrets.py"""
        try:
            urlLogin = "https://kairos.unifi.it/auth/auth_app_test.php"

            ###### inizializzo una sessione requests per avere la permanenza dei cookie
            reqTok = requests.Session()

            ###### apro la pagina di login
            printLivelli("APRO LA PAGINA DI LOGIN", 4)
            login = reqTok.get(url=urlLogin, timeout=(10,10))

            printLivelli("ok", livello=1)
            printLivelli("codice: {}".format(login.status_code), 2)

            ###### analizzo la pagina per prendere il valore di JSESSIONID
            printLivelli("ANALISI DELLA PAGIAN RESTITUITA", 4)

            parsedPage = BeautifulSoup(login.content, "html.parser")

            ##### action è la parte finale del link che contiene la jsessionid corretta
            action = parsedPage.find('form').get('action')

            printLivelli("JSESSIONID OTTENUTA", 4)
            printLivelli("jsession: \t {}".format(action), 2)

            ###### creo l'url per il login
            urlKairos = "https://shibboleth.unifi.it" + action

            printLivelli("EFFETTUO IL LOGIN", 4)
            loginFatto = reqTok.post(urlKairos, data=self.dataLogin)

            printLivelli("ok", livello=1)
            printLivelli("codice: {}".format(loginFatto.status_code), 2)
            printLivelli("Cookies: {}".format(loginFatto.cookies), 2)

            ########### retrive RelayState and SAMLResponse ##########
            printLivelli("ANALISI DELLA PAGINA RESTITUITA", 4)
            parsedPage = BeautifulSoup(loginFatto.content, "html.parser")
            parametri = parsedPage.find_all("input", type="hidden")
            printLivelli("ok", 1)

            ###### create a dict of parameters I need to pass ######
            tokenRS_SAMLR = {}  #RelayState e SAMLRespose
            print("CREO LISTA PARAMETRI", 4)
            for p in parametri:
                tokenRS_SAMLR[p.get("name")] = p.get("value")
                printLivelli(
                    "nome: {} ### value: {}".format(p.get("name"),
                                                    p.get("value")), 2)
            printLivelli("ok", 1)

            ###### creo il link per il login
            printLivelli("ottengo il nuovo url in cui fare riciesta", 4)
            urlPostSAML2 = parsedPage.find("form").get("action")
            printLivelli("ok", 1)
            printLivelli("urlPostSAML: {}".format(urlPostSAML2), 2)

            ##### ottengo la pagina che contiene il token di accesso con i dati dell'utente
            printLivelli("INVIO TOKEN ACCESSO RS e SAMLR", 4)
            # serve ad ottenere due cookie:
            # sono i cookie "_opensaml_req_...." e "_shibssession_"
            rispostaRedirectJs = reqTok.post(url=urlPostSAML2,
                                             data=tokenRS_SAMLR)
            printLivelli("ok", 1)
            printLivelli("codice: {}".format(rispostaRedirectJs.status_code),
                         2)

            ##### ora la pagina dovrebbe contenere un url che vado a prendere
            # l'url contiene l'access_token
            printLivelli("ANALISI DELLA PAGINA RESTITUITA", 4)
            parsedPage = BeautifulSoup(
                rispostaRedirectJs.content, "html.parser"
            )  #riciclo parsedPage perchè tanto quello di prima non ci serve

            # estraggo l'access token
            printLivelli("CERCO L'ACCESS_TOKEN", 4)
            if debugLog == True:
                f = open("pagina.html", "w+")
                f.write(str(parsedPage))
                f.close()

            access_url = parsedPage.find("script",
                                         type="text/javascript").string
            access_url = access_url.split('window.location="')[1]
            access_url = access_url.split('"')[0]
            access_token = access_url.split("#access_token=")[1]
            print(access_token)
            printLivelli("ok", 1)

            #molto probabilmente è sbagliato fare così, ma va bè:

            print("ACCESS_TOKEN TROVATO", 4)
            printLivelli(access_token, 2)

            printLivelli("SALVO l'ACCESS_TOKEN", 4)

            # intanto controllo che (anche se molto difficile) il token non sia già stato scritto
            #e poi me ne frego e sovrascrivo quello che c'è scritto
            
            secretsFile = open("secret.py", "r")
            lineeSecrets = secretsFile.readlines()
            secretsFile.close()
            lineaTrovata = False
            i = 0
            while lineaTrovata == False:
                for linea in lineeSecrets:
                    #cerco intanto se è presente la linea del file
                    if lineaTokenContenuta in linea:
                        printLivelli(
                            "Modifico la riga della configurazione (non testato)",
                            3)
                        #la linea del token è contenuta nel file
                        lineaTrovata = True
                        # la riscrivo
                        lineeSecrets[i] = "{} = '{}'".format(
                            lineaTokenContenuta, access_token)
                        secretsFile.writelines(lineeSecrets)
                        secretsFile.close()

                    i += 1

                if lineaTrovata == False:
                    printLivelli(
                        "Aggiungo nella configurazione l'access_token (nuova linea)",
                        0)
                    #aggiungo io la linea corretta
                    secretsFile.close()
                    with open("secret.py", "a") as f:

                        f.write(" \n")
                        f.write("{} = '{}'".format(lineaTokenContenuta, access_token))
                        f.close()

                    lineaTrovata = True

            self.access_token = access_token  #serve per quando TOKEN non è mai stato salvato o se è cambiato

            #
            #
            #
            #
            #

        except error:
            #se per qualunque motivo c'è un errore, ricomincio da capo e mostro l'errore
            printLivelli(error.args, 3)
            printLivelli("ricomincio", 0)
            self.__init__()

            pass

        else:
            printLivelli("TOKEN SISTEMATO", 4)
            pass


    def prenota(self, tentativo = 0):
        """Apre la pagina delle lezioni, estrapola il contenuto utile ed effettua le prenotazioni"""
        try:
            reqPrenota = requests.Session()
            tokenAccess = {}
            tokenAccess["access_token"] = self.access_token
            printLivelli("Log-in..", 4)
            reqPrenota.post(
                "https://kairos.unifi.it/agendaweb/login.php?from=&from_include=",
                data=tokenAccess)

            printLivelli("ok", 1)

            paginaLezioni = reqPrenota.get(
                "https://kairos.unifi.it/agendaweb/index.php?view=prenotalezione&include=prenotalezione&_lang=it", headers=headers
            )

            printLivelli("ok", 1)
            printLivelli(paginaLezioni.status_code, 2)
            

            ########################################################
            #                                                      #
            ##             MANIPOLAZIONE DEL DUMP                 ##
            ###      DELLA PAGINA IN HTML PER OTTENERE           ###
            ##      LA LISTA DELLE LEZIONI PER LA SETTIMANA       ##
            #                                                      #
            ########################################################

            #tutto questo si basa sul fatto che nella pagina deve esserci solo un "JSON.parse"

            # partition("JSON.parse") divide la stringa paginaLezioni in una lista di 3 elementi
            # con @ primo elemento che è la pagina html PRIMA DI 'JSON.parse'
            #     @ secondo elemento che è proprio 'JSON.parse'
            #     @ terzo elemento che è il RESTO DELLA PAGINA ma contiene come primi elementi la lista delle lezioni a cui mi devo iscrivere
            printLivelli("Divido la pagina in corrispondenza di 'JSON.parse'",
                         4)
            
            #pulizia di caratteri incomprensibili
            paginaLezioni = str(paginaLezioni.content)
            paginaLezioniNonPronta = paginaLezioni.replace("\\t", linesep)
            paginaLezioniNonPronta = paginaLezioniNonPronta.replace("\\n", linesep)
            paginaLezioniNonPronta = paginaLezioniNonPronta.replace("\\r", linesep)
            paginaLezioniNonPronta = paginaLezioniNonPronta.replace("\\", "")
            paginaLezioniNonPronta = paginaLezioniNonPronta.replace("b'", "")
    

            paginaLezioniS = BeautifulSoup(paginaLezioniNonPronta, "html.parser")
            paginaLezioniS = str(paginaLezioniS)
    
            if debugLog == True:
                f = open("paginaLezioni.html", "w+")
                f.write(paginaLezioniS)
                f.close()

            lezioniTaglio = paginaLezioniS.partition("JSON.parse")
            
            
            #qua faccio lo stesso procedimento della riga precedente MA la lista ha come divisore "') ;"
            # con @ primo elemento che è la stringa CHE MI INTERESSA
            #     @ secondo elemento che è proprio "') ;"
            #     @ terzo elemento che è il RESTO DELLA PAGINA che non mi interessa minimamente
            printLivelli("taglio la parte post-lista delle lezioni", 0)
            lezioniTaglio = lezioniTaglio[2].partition("') ;")

            #prendo il primo elemento della lista creata
            listaDelleLezioni = lezioniTaglio[0].strip("('")
            printLivelli("la lista delle lezioni è lunga: " +
                  str(len(listaDelleLezioni)))



            #print("""%%%%%%%%%%%%%%%%%%%%%%%%%""")
            #print(lista_bella_delle_lezioni)
            #print("""%%%%%%%%%%%%%%%%%%%%%%%%%""")
            if len(listaDelleLezioni) <= 5:
                #TODO: asdasdasdas
                printLivelli("ATTENZIONE!!! la lista della prenotazione delle lezioni è vuota")
                time.sleep(10)
                tentativo += 1
                self.prenota(tentativo)
                if tentativo > 100:
                    print("il numero di tentativi è: " +
                          str(tentativo) + " mi ammazzo")
                    exit()

                else:
                    pass
            else:
                printLivelli("ok la lista è abbastanza lunga", 1)

       

            
            #debug:
            #listaDelleLezioni = open("lezioni.json", "r")
            #listaDelleLezioni = listaDelleLezioni.read()
            
            listaLezioniJson = json.loads(listaDelleLezioni)

            #TODO: lista di errori
            
            for giorno in listaLezioniJson:
                for lezione in giorno["prenotazioni"]:
                    #controllo se la lezione è già stata prenotata/se è prenotabile
                    try:
                        printLivelli("╔══════════════ {} ══════════════╗".format(lezione["nome"]), 0)
                        if (lezione["prenotata"] == False) and (lezione["prenotabile"] == True):
                            printLivelli("Sto prenotando: {}".format(lezione["nome"]))
                            entry_id = lezione["entry_id"]
                            urlPrenotazione = urlPrenotazione.format(CODICE_FISCALE, entry_id)
                            rispostaPrenotazione = requests.get(url=urlPrenotazione) # qua non c'è timeout perchè è importante che li faccia tutti
                            rispostaJSON = json.loads(rispostaPrenotazione)
                            esito = rispostaJSON['result']
                            motivo = rispostaJSON['message']
                            if esito == "Success":
                                printLivelli("Prenotazione avvenuta con successo",1)
                                printLivelli("║ {}".format(motivo), 2)
                            elif esito == "Warning":
                                printLivelli("Attenzione!", 0)
                                printLivelli(motivo, 3)
                            elif esito == "Error":
                                printLivelli("Errore", 3)
                                printLivelli(motivo, 3)
                            else:
                                printLivelli("Risultato non riconosciuto", 3)
                                printLivelli(rispostaPrenotazione.content)
                        elif (lezione["prenotata"] == True) and (lezione["prenotabile"] == True):
                            printLivelli("la lezione risulta già prenotata", 3)
                        elif lezione["prenotabile"] == False:
                            printLivelli("la lezione non è prenotabile", 3)
                        else:
                            printLivelli("situazione strana")
                    
                    except error:
                        printLivelli("Si è verificato un errore strano nella prenotazione della lezione", 3)
                        printLivelli(error.args,  2)
                        pass
                    printLivelli("")
                    
                    




            
                    
            
            
            if True == False:
                raise erroreRispostaPrenotazione("scemo")
            pass
        except erroreRispostaPrenotazione:  #sono da chiamare con raise erroreRispostaPrenotazione(listaErrori)
            pass
        except error as er:
            # qua ci sono dei classici errori di rete, perciò nel dubbio:
            printLivelli(er.args, 3)
            pass
        else:
            pass

        pass


#TODO: da mettere che ogni volta che c'è un errroe, questo viene aggiunto in una lista e poi sono stampati a video alla fine

#TODO: una funzione che gestisce il livello di importanza dei mesaggi


def printLivelli(stringa, livello=0):
    """0:info\n\
    1: ok\n\
    2: debug verboso\n\
    3: errore\n
    4: progresso"""
    #TODO: aggiungere log fatto bene
    if livello == 0:
        print("[i] {}".format(stringa))
    elif livello == 1:
        print("[✓] {}".format(stringa))
    elif livello == 2 and debugLog == True:
        print("[] {}".format(stringa))
    elif livello == 3:
        print("[✕] {}".format(stringa))
    elif livello == 4:
        print("\n--##### {} #####--\n".format(stringa))




if __name__ == "__main__" and debug == False:
    kairosBot()
