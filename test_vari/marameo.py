import json
import requests

sasso = [{"data":"08\/03\/2021","sede":"C.Didat.Morgagni (Piano Terra)","ora_inizio":"08:00","ora_fine":"14:00","qr":"","prenotazioni":[{"nome":"CALCOLO NUMERICO","ora_inizio":"08:30","ora_fine":"10:30","aula":"Aula 014","entry_id":130324,"last_minute":False,"capacita":47,"presenti":37,"prenotabile":True,"note":"","prenotata":True,"posto":0,"PresenzaAula":"","PostoOccupato":""},{"nome":"FISICA II","ora_inizio":"10:50","ora_fine":"12:50","aula":"Aula 014","entry_id":130295,"last_minute":False,"capacita":47,"presenti":34,"prenotabile":True,"note":"","prenotata":True,"posto":0,"PresenzaAula":"","PostoOccupato":""}],"timestamp":1615186800},{"data":"08\/03\/2021","sede":"C.Didat.Morgagni (1\u00b0 Piano)","ora_inizio":"14:00","ora_fine":"20:00","qr":"","prenotazioni":[{"nome":"ANALISI MATEMATICA II","ora_inizio":"14:20","ora_fine":"16:20","aula":"Auditorium B","entry_id":129942,"last_minute":False,"capacita":84,"presenti":83,"prenotabile":True,"note":"","prenotata":True,"posto":0,"PresenzaAula":"","PostoOccupato":""}],"timestamp":1615208400},{"data":"09\/03\/2021","sede":"C.Didat.Morgagni (Piano Terra)","ora_inizio":"08:00","ora_fine":"14:00","qr":"","prenotazioni":[{"nome":"FISICA II","ora_inizio":"08:30","ora_fine":"10:30","aula":"Aula 014","entry_id":130309,"last_minute":False,"capacita":47,"presenti":36,"prenotabile":True,"note":"","prenotata":True,"posto":0,"PresenzaAula":"","PostoOccupato":""},{"nome":"CALCOLO NUMERICO","ora_inizio":"10:50","ora_fine":"12:50","aula":"Aula 014","entry_id":130338,"last_minute":False,"capacita":47,"presenti":36,"prenotabile":True,"note":"","prenotata":True,"posto":0,"PresenzaAula":"","PostoOccupato":""}],"timestamp":1615273200},{"data":"09\/03\/2021","sede":"C.Didat.Morgagni (Piano Terra)","ora_inizio":"14:00","ora_fine":"20:00","qr":"","prenotazioni":[{"nome":"FONDAMENTI DI INFORMATICA","ora_inizio":"14:10","ora_fine":"16:10","aula":"Auditorium A","entry_id":129970,"last_minute":False,"capacita":84,"presenti":84,"prenotabile":False,"note":"","prenotata":True,"posto":0,"PresenzaAula":"","PostoOccupato":""}],"timestamp":1615294800},{"data":"11\/03\/2021","sede":"C.Didat.Morgagni (1\u00b0 Piano)","ora_inizio":"08:00","ora_fine":"14:00","qr":"","prenotazioni":[{"nome":"LABORATORIO DI INFORMATICA","ora_inizio":"10:40","ora_fine":"12:40","aula":"Aula Informatica 112 (la lezione si svolge anche nelle aule: Aula Informatica 113)","entry_id":133789,"last_minute":False,"capacita":20,"presenti":16,"prenotabile":True,"note":"","prenotata":False,"posto":0,"PresenzaAula":"","PostoOccupato":""},{"nome":"LABORATORIO DI INFORMATICA","ora_inizio":"10:40","ora_fine":"12:40","aula":"Aula Informatica 113 (la lezione si svolge anche nelle aule: Aula Informatica 112)","entry_id":133790,"last_minute":False,"capacita":20,"presenti":20,"prenotabile":False,"note":"","prenotata":True,"posto":0,"PresenzaAula":"","PostoOccupato":""}],"timestamp":1615446000},{"data":"11\/03\/2021","sede":"C.Didat.Morgagni (Piano Terra)","ora_inizio":"14:00","ora_fine":"20:00","qr":"","prenotazioni":[{"nome":"FONDAMENTI DI INFORMATICA","ora_inizio":"14:10","ora_fine":"16:10","aula":"Auditorium A","entry_id":129985,"last_minute":False,"capacita":84,"presenti":83,"prenotabile":True,"note":"","prenotata":True,"posto":0,"PresenzaAula":"","PostoOccupato":""}],"timestamp":1615467600}]
CODICE_FISCALE = 'cccncl01m29a564i'

#cacca = json.loads(sasso)
#print(sasso[0])

url_api_prenotazione = 'https://kairos.unifi.it/agendaweb//call_ajax.php?mode=salva_prenotazioni'

caio = str(sasso[0])
#print(caio)

print("asdasasdasdasdasdasdadasdasdasdasd")

marcello = json.dumps(sasso, indent=4)
#print(marcello)
#print(marcello[4])

carmelo = json.loads(marcello)

#print(carmelo[0]['data'])

fuck = [1]


headers = {
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'DNT': '1',
    'Accept-Language': 'it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate, br'
}
 
#creo i cookies
tutti_i_cookie = {'_shibsession_6b6169726f732e756e6966692e697468747470733a2f2f6b6169726f732e756e6966692e69742f73686962626f6c657468': '_fd6ea9982b617b42685a2ab31430c8b0', 'PHPSESSID': 'h9mt45qqtk6i7u90a5p6fu1ds3'}

#Funzione che fa l'auto-prenotazione
for numero_elementi in range(len(carmelo)):
    for numero_lezione in range(len(carmelo[numero_elementi]['prenotazioni'])):
        #print(carmelo[numero_elementi]['prenotazioni'][numero_lezione]['entry_id'])
        parametri = {'codice_fiscale': '', 'id_entries': ''}

        # e.g. 129984
        id_lezione = carmelo[numero_elementi]['prenotazioni'][numero_lezione]['entry_id']
        id_entries_bello = '[' + str(id_lezione) + ']'
        #print("##########" + id_entries_bello)
        parametri['codice_fiscale'] = CODICE_FISCALE
        parametri['id_entries'] = str(id_entries_bello)
        #print(parametri)
        print("faccio")
        risposta_prenotazione_ti_prego = requests.get(url=url_api_prenotazione, params=parametri, cookies=tutti_i_cookie, headers=headers,timeout=90)
        print(risposta_prenotazione_ti_prego.reason)
        print(risposta_prenotazione_ti_prego.headers)
        print(risposta_prenotazione_ti_prego.content)
        print(risposta_prenotazione_ti_prego.url)
        print("merda")


        if "Prenotazione efettuata" in str(risposta_prenotazione_ti_prego.content):
            print("OK FATTO")
        else:
            print("prenotazione non efettuata\nil motivo è: " + str(risposta_prenotazione_ti_prego.content))
        quit

    print(carmelo[numero_elementi]['prenotazioni'][0]['nome'])
print(range(len(carmelo)))