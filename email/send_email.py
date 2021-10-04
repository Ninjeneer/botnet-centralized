from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

fromaddr = "ensicaen.securite.2021@gmail.com"
#TODO Antho : Faire la lecture fichier pour la liste des adresses mails
toaddr = "lemazier.elise@gmail.com"

html = open("../templates/page_mail.html")
msg = MIMEMultipart('alternative')
msg = MIMEText(html.read(), "html")
msg['From'] = fromaddr
msg['To'] = toaddr
msg['Subject'] = "Mise à jour sécurité Firefox"

debug = False
if debug:
    print(msg.as_string())
else:
    server = smtplib.SMTP('smtp.gmail.com',587)
    server.starttls()

    # Autoriser les applications moins sécurisées
    # url : https://support.google.com/accounts/answer/6010255#zippy=%2Csi-le-param%C3%A8tre-autoriser-les-applications-moins-s%C3%A9curis%C3%A9es-est-activ%C3%A9-pour-votre-compte
    server.login("ensicaen.securite.2021@gmail.com", "Ensicaen.2021@")
    text = msg.as_string()
    server.sendmail(fromaddr, toaddr, text)
    server.quit()