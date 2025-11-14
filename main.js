// EventListener, der das Script erst lädt, sobald die html vollständig geladen wurde ( via DOM-Content )
document.addEventListener("DOMContentLoaded", function() {
    // Konfiguration des Brokers, sowie des Topics unter dem die Kommunikation stattfindet
    const brokerUrl="ws://broker.hivemq.com:8000/mqtt";
    const topic="automation/mqttjs";

    // Elemente aus dem HTML-Dokument abrufen
    const statusElement = document.getElementById("status");
    const temperatureCanvas = document.getElementById("temperatureChart");
    // Globale Chart-Variable
    let temperatureChart;
    // MQTT-Client erstellen
    console.log("Versuche mit dem MQTT-Broker zu verbinden...");
    statusElement.textContent = "Verbinde mit " + brokerUrl + "...";

    const client = mqtt.connect(brokerUrl);

    // Event-Handler definieren
    // Erfolgreicher Verbindungsaufbau
    client.on("connect", () => {
        console.log("Erfolgreich mit dem Broker verbunden.");
        statusElement.textContent="Verbunden!";
        statusElement.style.color = "green";
        // Chart wird initialisiert, sobald die Verbindung hergestellt ist
        initializeChart();
        // Anschließend wird das Test-Topic abboniert
        client.subscribe(topic, (err) => {
            if(!err) {
                console.log(`Topic "${topic}" abonniert.`);
            } else{
                console.error("Fehler beim Abonnieren des Topics:", err);
            }
         });
    });

    // Bei Empfang einer Nachricht das Diagramm aktualisieren
    client.on("message", (receivedTopic, message) => {
        console.log(`Nachricht empfangen auf Topic "${receivedTopic}":`, message.toString());
        updateChart(message.toString());
    });

    // Bei Verbindungsfehler
    client.on("error", (err) => {
        console.error("Verbindungsfehler:", err);
        statusElement.textContent = "Verbindungsfehler!";
        statusElement.style.color = "red"; // Statusfarbe auf rot setzen
        client.end(); // Verbindung schließen
    });

    // Chart Funtionen
    // Im Rahmen der Initialisierung wird ein eventuell bestehendes Chart gelöscht, anschließend der 2D-Zeichenkontext des Canvas-Objekts abgerufen,
    // sowie die Eigenschaften des Diagramms festgelegt
    function initializeChart() {
        if (temperatureChart) {
            temperatureChart.destroy(); 
        }
        const ctx = temperatureCanvas.getContext("2d"); 
        temperatureChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [], // X - Achse
                datasets: [{
                    label: "Temperatur (°C)",
                    data: [], // Y -Achse
                    borderColor: "rgba(255,99,132,1)", 
                    backgroundColor: "rgba(255,99,132,0.2)", 
                    borderWidth: 2, 
                    tension: 0.3 
                }]
            },
            // Einstellungen für die Beschriftung der Achsen
            options:{
                scales:{
                    x:{
                        ticks:{color:"#FFF"}, 
                    },
                    y:{
                        beginAtZero: false, 
                        ticks:{color:"#FFF"} 
                    }
                }
            },
            // Einstellungen für die Legende
            plugins: {
                legend: {
                    labels: {
                        color: "#FFF" 
                    }
                }
            }
        });
        console.log("Chart initialisiert.");
    }

    // Funktion zum Aktualisieren des Diagramms mit neuen Daten, JSON-Nachricht wird geparst und überprüft, ob Temperaturdaten enthalten sind
    function updateChart(message){
        try{
            const data = JSON.parse(message);
            if(data.temperature === undefined) {
                console.warn("Keine Temperaturdaten in der Nachricht gefunden:", data);
                return;
            }

            // Temperaturwert aus den Daten herausziehen, aktuelle Zeit für die Datenerhebung speichern und Zeitstempel formatieren
            const newValue = data.temperature; 
            const now = new Date();
            const timestamp = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

            // Daten zum Chart hinzufügen
            temperatureChart.data.labels.push(timestamp); // X - Achse
            temperatureChart.data.datasets[0].data.push(newValue); // Y - Achse
            // Maximale Anzahl an Datenpunkten begrenzen und festlegen, dass bei Überschreitung der Älteste Datenpunkt entfernt wird
            if (temperatureChart.data.labels.length > 20) {
                temperatureChart.data.labels.shift(); 
                temperatureChart.data.datasets[0].data.shift(); 
            }
            // Chart neu zeichnen um Daten anzuzeigen
            temperatureChart.update();
        } catch(e) {
            console.error("Fehler beim Verarbeiten der Nachricht:", e);
        }
    }
}); 
