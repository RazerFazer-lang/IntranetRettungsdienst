# 🔒 Verbindliche Entwicklungs- und Qualitätssicherungsanweisung

Diese Regeln sind für **jede neue Funktion, Änderung, Erweiterung, Designanpassung oder Fehlerbehebung** im Projekt `IntranetRettungsdienst` verbindlich.

## Grundregel

Nach **jeder Änderung** muss das gesamte Projekt auf mögliche Nebenwirkungen geprüft werden. Neue Funktionen dürfen niemals isoliert betrachtet werden.

**Jede Änderung ist automatisch ein Auftrag zur Fehlersuche, Regressionprüfung, Geräteprüfung und Browserprüfung.**

---

## 1. Bestehenden Code zuerst analysieren

Vor jeder Änderung prüfen:

- bestehende Architektur
- Abhängigkeiten zwischen JavaScript, CSS und HTML
- globale Funktionen und Event-Handler
- Navigation und Routing
- LocalStorage-/State-Systeme
- Service Worker und Cache
- dynamisch erzeugte Elemente
- responsive Layouts
- bestehende Tests und Workflows

Keine bestehende Funktion darf ohne Prüfung überschrieben oder unbeabsichtigt deaktiviert werden.

## 2. Nach jeder Änderung aktiv nach Bugs suchen

Mindestens prüfen:

- JavaScript-Fehler und Syntaxfehler
- Console-Errors und Page-Errors
- fehlende Dateien und falsche Pfade
- doppelte Event-Listener
- konkurrierende Renderer
- fehlerhafte Zustände
- Navigation und Routing
- Buttons und Interaktionen
- CSS-/Layout-Konflikte
- dynamische Komponenten
- LocalStorage-/State-Probleme
- Service-Worker-/Cache-Probleme
- Fehler nach Reload
- Fehler nach Navigation zwischen Modulen

## 3. Regressionstests

Nach jeder relevanten Änderung muss geprüft werden, dass bestehende Funktionen weiterhin funktionieren.

Mindestens diese Kette:

**Startseite → Abfragehilfe → Notfallbilder → Lagebilder/Einsatzlagen → Checklisten → Medikamente → MANV → Rechner → Wissen → Krankheitsbilder → alle Ausbildungsmodule**

Zusätzlich prüfen:

- Rückkehr zur Startseite
- Hamburger-/mobile Navigation, sofern vorhanden
- Sidebar-Scroll
- aktiver Navigationszustand
- Startseiten-Kacheln
- Suche und Filter
- Formulare
- Lernfortschritt
- Prüfungen
- Dokumentation
- Offline-Modus

## 4. Geräte / Viewports

Responsive Änderungen müssen mindestens auf diesen Viewports geprüft werden:

### Desktop
- 1920×1080
- 2560×1440

### Tablet
- 1024×768
- 820×1180

### Smartphone
- 390×844
- 412×915

Prüfen:

- Navigation
- Textumbrüche
- Buttons
- Karten
- Formulare
- Tabellen
- Scrollbereiche
- Modalfenster
- Touch-Ziele
- abgeschnittene Inhalte
- horizontales Overflow
- sticky/fixed Elemente und Layering

## 5. Browser

Mindestens prüfen:

- **Chromium / Google Chrome**
- **Microsoft Edge**, soweit automatisiert verfügbar
- **Firefox**
- **Safari / WebKit**, soweit automatisiert verfügbar

Besonders prüfen:

- JavaScript
- CSS
- LocalStorage
- Service Worker
- Navigation
- Formulare
- responsive Darstellung

## 6. Offline- und Cache-Prüfung

Das Projekt ist lokal/offline nutzbar. Nach Änderungen daher:

- Service Worker prüfen
- Cache-Version aktualisieren
- neue Assets in den Cache aufnehmen
- veraltete Cache-Versionen sauber entfernen
- Offline-Laden testen
- sicherstellen, dass neue Kernfunktionen keine unerwartete Internetverbindung benötigen

## 7. Automatisierte Tests

Für jede größere neue Funktion muss ein Browser-Regressionstest entstehen.

Tests sollen reale Nutzerabläufe nachbilden, zum Beispiel:

**Seite öffnen → klicken → Eingabe machen → Ergebnis prüfen → nächste Seite öffnen → zurück → erneut prüfen.**

Nicht nur statische Existenz prüfen, sondern echte Interaktionen und Zustände testen.

## 8. Fehler im Test selbst prüfen

Bei einem fehlgeschlagenen Test wird zuerst festgestellt:

> Ist die Anwendung fehlerhaft oder ist der Test fehlerhaft?

Ein Test darf **nicht künstlich angepasst** werden, nur damit er grün wird. Teständerungen müssen den tatsächlich erwarteten Benutzerfluss korrekt abbilden.

## 9. Keine unfertigen Änderungen als fertig melden

Eine Änderung gilt erst als abgeschlossen, wenn grundsätzlich durchgeführt wurde:

**Code geändert → Fehleranalyse → Regressionstest → Browser-/Responsive-Test → Cache geprüft → CI geprüft.**

Ein Test mit `queued` oder `in_progress` darf **nicht** als bestanden bezeichnet werden.

## 10. Qualität vor Geschwindigkeit

Bei Zielkonflikten gilt:

**Stabilität > bestehende Funktionen > neue Funktion > Geschwindigkeit**

Keine schnelle Lösung verwenden, die andere Module oder vorhandene Benutzerabläufe beschädigt.

## 11. Gesamtprüfung nach jeder Erweiterung

Auch eine kleine Änderung, z. B. an einem Medikamentenmodul, muss auf Auswirkungen auf mindestens diese Bereiche geprüft werden:

- Startseite
- Navigation
- Suche
- Ausbildungsfortschritt
- mobile Darstellung
- Service Worker / Cache
- bestehende Module

## 12. Abschlussbericht

Nach jeder größeren Änderung muss kurz dokumentiert werden:

### Geändert
Was wurde eingebaut oder geändert?

### Gefunden
Welche Fehler oder Risiken wurden entdeckt?

### Behoben
Welche Korrekturen wurden vorgenommen?

### Getestet
Welche Browser, Viewports und Funktionen wurden geprüft?

### CI
Welche Workflows sind **bestanden**, welche **fehlgeschlagen** und welche noch **queued/in_progress**?

### Commit
Welcher Commit enthält die Änderung?

---

## 🚨 Wichtigste Regel

> **Jede neue Änderung ist automatisch ein Auftrag zur Fehlersuche, Regressionprüfung, Geräteprüfung und Browserprüfung.**
>
> **Nicht nur die neue Funktion testen, sondern prüfen, ob das gesamte System nach der Änderung weiterhin funktioniert.**
