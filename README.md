# raspi-robot-2

Enthält Code für Broadcaster, Client und Server

Um den RaspberryPi mit der Software zu betreiben, gehe bitte wie folgt vor.

### 1. SD-Karte beschreiben ###

Die SD-Karte für den Raspberry PI kann mit dem Tool Raspberry Pi Imager beschrieben werden.

Das Tool kannst du hier herunterladen:
https://downloads.raspberrypi.org/imager/imager_latest.exe

Zum Beschreiben wähle bitte folgende Distribution aus:
Raspberry Pi OS (other) > Raspberry Pi OS Lite (32-bit)

Klicke danach auf das Zahnradsymbol unten rechts, und aktiviere folgende Einstellungen:
- SSH aktivieren
  - Passwort zur Authentifizierung verwenden
- Benutzername und Passwort setzen
  - Benutzername: pi
  - Passwort: [BELIEBIGES PASSWORT]
- Wifi einrichten
  - SSID: ...
  - Passwort: ...
  - Wifi-Land: DE
- Spracheinstellungen festlegen
  - Zeitzone: Europe/Berlin
  - Tastaturlayout: de

Klicke danach auf "SPEICHERN", wähle die SD-Karte aus und klicke dann auf "SCHREIBEN".

### 2. Raspberry Pi konfigurieren ###

Nachdem der RaspberryPi mit der neuen SD-Karte das erste Mal gestartet wurde, solltest du mit Putty per SSH auf den RaspberryPi zugreifen können.

Du kannst Putty hier herunter laden:
https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html

Im Idealfall kannst du bei Putty als Adresse auch "raspberrypi" anstelle der IP-Adresse eingeben.

Wenn du dich erfolgreich verbunden hast, muss der PI für die Kamera und den Build-HAT konfiguriert werden. Dazu wird über folgenden Befehl das Konfigurationstool aufgerufen.

```
sudo raspi-config
```

Daraufhin nimmt man folgende Einstellungen vor:
- I6 Serial Port
  - Would you like a login shell to be accessible over serial?
    - Nein
  - Would you like the serial port hardware to be enabled?
    - Ja

Wähle danach "Finish" und starte den Raspberry Pi neu.

### 3. Software für RaspberryPi über das offizielle Repo installieren ###

Folgende Software muss installiert werden.

- Python3
- Git
- Node.js

Dies ist über folgenden Befehl möglich.

```
sudo apt-get install -y python3 python3-pip git
```

### 4. Node.js installieren ###

Da Node.js, über das das Script ausgeführt wird, nicht in der aktuellen Version im Repo vorhanden ist, muss es über ein anderes Repo installiert werden. Gib dazu die folgenden Befehle ein.

```
curl -sSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt install -y nodejs
```

### 5. Script für Roboter Klonen und Abhängigkeiten installieren ###

Daraufhin wechselst du ins Homeverzeichnis und klonst das Repository für den Roboter.

```
cd ~
git clone https://github.com/dennisbohn/raspi-robot-2.git
```

Daraufhin wird der Unterordner "raspi-robot-2" erzeugt, in den du wechselst.

```
cd raspi-robot-2
```

Installiere nun die benötigten Pakete für das Roboter-Script.

```
npm update
```

### 6. Buildhat-Package für Python installieren ###

Installiere jetzt das Buildhat-Package über das das Script später mit den Motoren kommuniziert.

```
pip3 install buildhat
```

Unglücklicherweise beinhaltet die aktuelle Version des Buildhat-Packages (0.5.8) einen Bug, der dafür sorgt, dass der Roboter nach ca. einer Minute nicht mehr gesteuert werden kann. Um den Bug zu beheben, muss eine Datei ersetzt werden. Gib dazu folgende Befehle ein.

```
wget https://raw.githubusercontent.com/RaspberryPiFoundation/python-build-hat/a4edde74e051aa03fe4e91122000115cb6b36919/buildhat/motors.py -O ~/.local/lib/python3.9/site-packages/buildhat/motors.py
```

### 7. AuthToken hinterlegen ###

Damit sich der Roboter korrekt am Server authentifizieren kann, packe die Datei ".authToken" in den Ordner "raspi-robot-2". Andernfalls wird der Server kein Bild vom Raspberry Pi annehmen.

### 8. Script testen ###

Um das Script zu testen, wechsle in den Ordner des Scripts und starte es über Node.js.

```
cd ~/raspi-robot-2
node robot.js
```

Nun solltest du den Roboter über die folgende Adresse steuern können.

https://robot.bohn.media/

### 9. Script automatisch über PM2 starten ###

Zurzeit läuft das Script nur nach einem manuellen Start und auch nur solange, wie das Putty-Fenster geöffnet ist. Um das Script automatisch beim Start des Raspberry Pi auszuführen, musst du PM2 installieren. Das Programm startet das Script nicht nur automatisch beim Start des Raspberry Pi, sondern startet es auch automatisch neu, falls es zu einem Absturz des Scripts kommt.

PM2 wird folgendermaßen installiert.

```
cd ~/raspi-robot-2
sudo npm install pm2 -g
```

Nun solltest du das Script mit folgendem Befehl starten können.

```
pm2 start robot.js
```

Über den folgenden Befehl kannst du das Script stoppen.

```
pm2 stop robot
```

Um zu schauen, welche Prozesse aktuell laufen, verwendest du folgenden Befehl.

```
pm2 list
```

Damit PM2 automatisch beim Hochfahren des PI gestartet wird, gibst du folgenden Befehl ein.

```
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
```

Falls der Benutzer nicht "pi" heißt, müsstest du "pi" an den zwei Stellen des Befehls entsprechend ändern.

Falls das Roboterscript noch nicht läuft, starte es erneut.

```
pm2 start robot.js
```

Speichere danach den Ist-Zustand, damit das Script nach dem Neustart des Pi gestartet wird.

```
pm2 save
```

Zum Testen kannst du den PI über folgenden Befehl neu starten. Danach sollte der Roboter sich automatisch mit dem Server verbinden.

```
sudo reboot
```
