# MQTT Echtzeit-Temperatur Dashboard

![MQTT.js](https://img.shields.io/badge/library-MQTT.js-orange)
![Chart.js](https://img.shields.io/badge/library-Chart.js-red)

Ein einfaches Web-Dashboard zur Visualisierung von Echtzeit-Temperaturdaten, die über das MQTT-Protokoll empfangen werden. Dieses Projekt dient als grundlegendes Beispiel für die (I)IoT-Datenvisualisierung im Web.

<img width="1438" height="815" alt="realtime-dashboard-mit-werten" src="https://github.com/user-attachments/assets/e6f1796f-cda3-4c54-865f-03cca8a629fb" />

## Inhaltsverzeichnis

- [Features](#features)
- [Verwendete Technologien](#verwendete-technologien)
- [Installation & Einrichtung](#installation--einrichtung)
- [Anwendung](#anwendung)
- [Projektstruktur](#projektstruktur)


## Features

* **Echtzeit-Verbindung:** Stellt eine WebSocket-Verbindung zu einem MQTT-Broker her.
* **Live-Daten-Abonnement:** Abonniert ein MQTT-Topic, um Daten zu empfangen.
* **Dynamische Visualisierung:** Stellt eingehende Temperaturwerte in einem Liniendiagramm dar (mithilfe von Chart.js).
* **Visuelles Feedback:** Zeigt den aktuellen Verbindungsstatus zum Broker an.
* **Skalierbar:** Einfach anpassbar für andere Broker, Topics und Datenformate.


## Verwendete Technologien

* **Frontend:** HTML5, CSS3, JavaScript
* **MQTT-Kommunikation:** [MQTT.js](https://github.com/mqttjs/MQTT.js) - Client-Bibliothek für MQTT über WebSockets.
* **Datenvisualisierung:** [Chart.js](https://www.chartjs.org/) - Bibliothek zur Erstellung von interaktiven Diagrammen.


## Installation & Einrichtung

Um dieses Projekt lokal auszuführen, benötigen Sie einen lokalen Webserver, da der Browser die MQTT-Verbindung über `file://` blockieren kann.

1.  **Repository klonen:**
    ```bash
    git clone [https://github.com/mstandfest/dashboardmqtt.git](https://github.com/mstandfest/dashboardmqtt.git)
    cd realtime-dashboard
    ```

2.  **Lokalen Webserver starten:**
    Der einfachste Weg ist die Verwendung der "Live Server"-Erweiterung für Visual Studio Code.
    * Installieren Sie die [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
    * Klicken Sie mit der rechten Maustaste auf die `index.html`-Datei und wählen Sie "Open with Live Server".

3.  **Konfiguration (optional):**
    Wenn Sie einen anderen MQTT-Broker oder ein anderes Topic verwenden möchten, passen Sie die folgenden Konstanten in der Datei `main.js` an:
    ```javascript
    // Konfiguration des Brokers in main.js
    const brokerUrl = "ws://[broker.hivemq.com:8000/mqtt](https://broker.hivemq.com:8000/mqtt)";
    const topic = "automation/mqttjs"; // Passe dieses Topic nach Bedarf an
    ```


## Anwendung

Um Daten im Dashboard zu sehen, müssen Sie Nachrichten an den konfigurierten MQTT-Broker und das entsprechende Topic senden.

**Beispielkonfiguration für die App "EasyMQTT":**

| Einstellung       | Wert                                  | Anmerkung                                    |
| ----------------- | ------------------------------------- | -------------------------------------------- |
| **Broker-Host** | `broker.hivemq.com`                   | Der Server, mit dem sich verbunden wird.       |
| **Broker-Port** | `8000`                                | Der Port für WebSocket-Verbindungen.         |
| **Verbindung** | Websocket aktivieren                  | Wichtig für die Browser-Kommunikation.       |
| **Topic (Senden)**| `automation/mqttjs`                   | Muss exakt dem Topic im JS-Code entsprechen. |
| **Payload** | `{"temperature": 23.5}`               | **Wichtig:** Muss valides JSON-Format sein!  |


Sobald eine Nachricht mit diesem Format gesendet wird, erscheint der Wert `23.5` als neuer Punkt im Diagramm des Web-Dashboards.


## Projektstruktur

```
.
├── index.html       # Die Haupt-HTML-Datei
├── style.css        # CSS-Stile für das Dashboard
├── main.js          # Der gesamte JavaScript-Code (Verbindung, Chart, Logik)
└── README.md        # Diese Datei
```
