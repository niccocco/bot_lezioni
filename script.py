import json
import requests
import string
from secrets import MATRICOLA, PASSWORD, CODICE_FISCALE

from lxml import html
from bs4 import BeautifulSoup
import pandas as pd
from requests.api import head
from selenium import webdriver
from selenium.webdriver.common.by import By
import sys
import os
import time
import random


#FIX TEMPORANEO PER FARLO ANDARE BISOGNA INSERIRE IL NUMERO DI GIORNI
# IN CUI CI SI VUOLE PRENOTARE. Default = 6 (non so perchè)

giorni = range(6)

tempo_refresh_stallo = 60
tentativi_acquisizione_lista = 0




url_api_prenotazione = 'https://kairos.unifi.it/agendaweb//call_ajax.php?mode=salva_prenotazioni'
url_redirect = "https://kairos.unifi.it/auth/auth_app_test.php?response_type=token&client_id=client&redirect_uri=https://kairos.unifi.it/agendaweb/index.php%3Fview=login&scope=openid+profile"


headers = {
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'DNT': '1',
    'Accept-Language': 'it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate, br'
    }



print("Programma fatto male da Niccolo cocchi. Non ho nessuna responsabilità per usi del software")


def AcquisizioneBrowser(url_browser):
    ########################################################
    #                     FASE 1                           #
    ##              LOGIN CON SHIBBOLETH                  ##
    ###   IMPORTANTE: SELEZIONARE IL BROWSER UTILIZZATO  ###
    ##      E CONTROLLARE DI AVERLO AGGIUNTO AL PATH      ##
    #     opzioni possono essere "Chrome" o "Firefox"      #
    ########################################################
  
    with webdriver.Firefox() as driver: #qua è necessario impostare il tipo di driver
        global Cookie1_Name
        global Cookie1_Value
        global Cookie2_Name
        global Cookie2_Value
        
       # driver.error_handler()
        
        
        driver.implicitly_wait(120)

        print("Apro il browser")
        # Step # | name | target | value
    # 1 | open | https://kairos.unifi.it/auth/auth_app_test.php?response_type=token&client_id=client&redirect_uri=https://kairos.unifi.it/agendaweb/index.php%3Fview=login&scope=openid+profile | 
        driver.get(url_browser)
        print("ok.")

    # 2 | type | id=password | Passw0rD!1
        print("Inserisco la password " + PASSWORD)
        driver.find_element(By.ID, "password").send_keys(PASSWORD)
        print("ok.")

    # 3 | type | id=username | 7012345
        print("Inserisco la matricola " + MATRICOLA)
        driver.find_element(By.ID, "username").send_keys(MATRICOLA)
        print("ok.")

    # 4 | click | name=_eventId_proceed |
        print("Torno nella home di kairos")
        driver.find_element(By.NAME, "_eventId_proceed").click()
        print("ok.")

        # 6 click nella sezione lista lezioni
        print("Ora apro la lista delle lezioni")
        driver.find_element_by_xpath("/html/body/div[4]/div[4]/div[3]/div/div[2]/div[1]/div/div[6]/div/div[2]/div[2]/ul/li[1]/a").click()
        print("ok.")

        print("Prendo i cookie")
        cookies_raw = driver.get_cookies()
        #   I cookies potrebbero essere invertiti perciò si chiamano cookie1 e cookie2
        #SALVO LE CREDENZIALI DI SHIBBOLETH
        cookie1 = cookies_raw[0]
        Cookie1_Name = cookie1["name"]
        Cookie1_Value = cookie1["value"]
        #SALVO L'ID SESSIONE "PHPSESSID"
        cookie2 = cookies_raw[1]
        Cookie2_Name = cookie2["name"]
        Cookie2_Value = cookie2["value"]

        #questo è un metodo alternativo e molto probabilemente più veloce per fare quello che viene fatto dopo
        #
        #id_sessione = driver.get_cookie("JSESSIONID")
        #auth_shibboleth = driver.get_cookie("shib_idp_session")


        print("Le credenziali del login sono: " + Cookie1_Name + " : " + Cookie1_Value)
        print("L'id sessione è: " + Cookie2_Name + " : " + Cookie2_Value)


        print("prendo tutta la pagina in html")
        pagina_raw = driver.page_source
        print("pagina acquisita")

        return pagina_raw




def SpezzaEOttieniLaStringa(pagina_in_html):
    ########################################################
    #                    PARTE 2                           #
    ##             MANIPOLAZIONE DEL DUMP                 ##
    ###      DELLA PAGINA IN HTML PER OTTENERE           ###
    ##      LA LISTA DELLE LEZIONI PER LA SETTIMANA       ##
    #                                                      #
    ########################################################
        
    ###################################################
    #   SO CHE ESISTONO MODI PROBABILMENTE PIù VELOCI E CHE USANO MENO RISORSE PER FARE LA STESSA COSA.. MA NON AVEVO TEMPO DI SPERIMENTARE TROPPO OKKK?!
    ###################################################

    #tutto questo si basa sul fatto che nella pagina deve esserci solo un "JSON.parse"

    # partition("JSON.parse") divide la stringa pagina_in_html in una lista di 3 elementi
    # con @ primo elemento che è la pagina html PRIMA DI 'JSON.parse'
    #     @ secondo elemento che è proprio 'JSON.parse'
    #     @ terzo elemento che è il RESTO DELLA PAGINA ma contiene come primi elementi la lista delle lezioni a cui mi devo iscrivere
    print("Divido la pagina in corrispondenza di 'JSON.parse'")
    stringa_non_buona_tagliata = pagina_in_html.partition("JSON.parse")

    #qua faccio lo stesso procedimento della riga precedente MA la lista ha come divisore "') ;"
    # con @ primo elemento che è la stringa CHE MI INTERESSA
    #     @ secondo elemento che è proprio "') ;"
    #     @ terzo elemento che è il RESTO DELLA PAGINA che non mi interessa minimamente
    print("taglio la parte post-lista delle lezioni")
    lista_non_perfetta = stringa_non_buona_tagliata[2].partition("') ;")

    #prendo il primo elemento della lista creata
    lista_bella_delle_lezioni = lista_non_perfetta[0].strip("('")
    #print(lista_lezioni)
    print("la lista delle lezioni è lunga: " + str(len(lista_bella_delle_lezioni)))

    #print("""%%%%%%%%%%%%%%%%%%%%%%%%%""")
    #print(lista_bella_delle_lezioni)
    #print("""%%%%%%%%%%%%%%%%%%%%%%%%%""")
    while len(lista_bella_delle_lezioni) <= 5:
        print("ATTENZIONE!!!")
        print("la lista della prenotazione delle lezioni è vuota")
        print("è stato bello provarci ma è un po' inutile")
        print("mi metterò a ricaricare la pagina ogni " + str(tempo_refresh_stallo) + "s")
        print("MA SPOILER ALERT: non l'ho ancora implementato.. quindi ciao :)")
        AcquisizioneBrowser(url_redirect)
        tentativi_acquisizione_lista = tentativi_acquisizione_lista + 1
        if tentativi_acquisizione_lista > 100:
            print("il numero di tentativi è: " + str(tentativi_acquisizione_lista) + "\n mi ammazzo")
            exit()
            
        else:
            pass
    else: 
        print("\n\n\nok la lista è abbastanza lunga")
        print("continuiamo") 

    
    return lista_bella_delle_lezioni



print("INIZIO\nchiamo la funzione di acquisizione dei dati dal browser")
pagina_da_lavorare =  AcquisizioneBrowser(url_redirect)



##########################################################
#                    PARTE 3                             #
##        PRATICAMENTE INTERPRETO LA LISTA CHE HO       ##
###       PRESO NELLA FASE 2 PER POTERLA DARE IN       ###
##        PASTO A REQUESTS CHE PUò FARE LA PRENOTAZIONE ##
#                                                        #
##########################################################





#indent=4 CREDO CHE PERMETTA LO SGAMO CHE FARò DOPO
print("Trasformo la stringa di lezioni in un oggetto JSON")

print("ok.")
print("Siccome l'interpretazione fa altamente schifo..\nOra devo riscrivere alcuni parametri in modo che siano\nlavorabili correttamente")





#ecco lo sgamo noto come il codice più stupido e ridondante che potessi creare
#carmelo = json.loads(json.dumps(SpezzaEOttieniLaStringa(pagina_da_lavorare), indent=4))
print("ok.")
print("################################################################")
print(SpezzaEOttieniLaStringa(pagina_da_lavorare))
print("################################################################")
#lista_buona = lista_buona.replace("\\n", "")
#lista_buona = lista_buona.replace("\\r", "")
#lista_bellissimissma = lista_buona.strip('\\r\\n')


print("\n\n\n\n\n\nOttimo!\nadesso passo all'autoprenotazione delle lezioni")





#print(lista_buona)


###########################################
##                PARTE 4                ##
##         AUTOPRENOTAZIONAMENTO         ##
###########################################

#creo i cookies
tutti_i_cookie = {}
tutti_i_cookie[Cookie1_Name] = Cookie1_Value
tutti_i_cookie[Cookie2_Name] = Cookie2_Value
#print(tutti_i_cookie)

#Funzione che fa l'auto-prenotazione


h = json.loads(SpezzaEOttieniLaStringa(pagina_da_lavorare))


#print(h[4]["prenotazioni"][1])

errore = ""



#range(len(h))
for i in range(len(h)):
    #print("###################\nSono al giorno della settimana numero: " + str(h[i]["data"] + "\n"))
    #print("#########")
    #print(h[0]["prenotazioni"])
    for j in range(len(h[i]["prenotazioni"])):
        #print(h[i]["prenotazioni"][j])
        #print("AAAAAAA#######AAAAAAA\n")
        if (h[i]["prenotazioni"][j]["prenotabile"]) and (h[i]["prenotazioni"][j]["prenotata"] is False) and (h[i]["prenotazioni"][j]["aula"]): # cioè se è prenotabile e non prenotata
            print(h[i]["prenotazioni"][j]["nome"] + " è prenotabile")
            print(h[i]["prenotazioni"][j]["nome"] + "nell'" + h[i]["prenotazioni"][j]["aula"])


            #FACCIO EFFETTIVAMENTE LA PRENOTAZIONE
            parametri = {'codice_fiscale': '', 'id_entries': ''}
            id_lezione = h[i]['prenotazioni'][j]['entry_id']
            id_entries_assemblato = '[' + str(id_lezione) + ']'
            #print("##########" + id_entries_bello)
            parametri['codice_fiscale'] = CODICE_FISCALE
            parametri['id_entries'] = str(id_entries_assemblato)

            print("Mi prenoto..")
            risposta_prenotazione = requests.get(url=url_api_prenotazione, params=parametri, cookies=tutti_i_cookie, headers=headers,timeout=90)
            
            #print(risposta_prenotazione.reason)
            #print(risposta_prenotazione.headers)
            #print(risposta_prenotazione.content)
            #print(risposta_prenotazione.url)

                       
            if "Prenotazione efettuata" in str(risposta_prenotazione.content): 
                print("OK FATTO, prenotazione effettuata")
            else: # per avere un messaggio di risposta più carino andrebbe deserializzato il json di risposta dell'API e non ho voglia 
                print("Attenzione :renotazione non efettuata\nil motivo è: " + str(risposta_prenotazione.content))
            

            print("\n-----------------------\n")

        elif (h[i]["prenotazioni"][j]["prenotabile"]) and (h[i]["prenotazioni"][j]["prenotata"]):
            print("Attenzione: Hai già prenotato la lezione : " + h[i]["prenotazioni"][j]["nome"])
            print("non posso farci nulla.\n-----------------------\n")

        elif h[i]["prenotazioni"][j]["prenotabile"] is False:
            print("ATTENZIONE: La lezione " + h[i]["prenotazioni"][j]["nome"] + "\ndel giorno " + h[i]["data"] + ", non è prenotabile")
            print("molto probabilemnte i posti sono tutti finiti")
            print("non posso farci nulla.\n\n-----------------------\n")
        else:
            print(h[i]["prenotazioni"][j]["nome"] + " è LA LEZIONE NON BUONA")
            print(h[i]["prenotazioni"][j]["aula"])
        #print("SONO FUORI DALL'IF")
print("Bella ho finito. Il risultato è stato: " + errore)