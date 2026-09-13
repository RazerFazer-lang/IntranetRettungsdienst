# 🚑 Rettungsdienst Intranet

Modernes, lokal nutzbares Web-Intranet als digitale **Abfrage-, Lern- und Strukturierungshilfe** für den Rettungsdienst.

## Enthalten

- Dashboard mit Schnellzugriffen
- Interaktive symptomorientierte Abfragebäume
- Häufige Einsatzsituationen
- Notfallbilder
- Checklisten-Bereich
- Wissensbereich
- Globale Suche
- Kritischer Schnellzugriff
- Responsive Design für Desktop, Tablet und Smartphone
- Keine Datenbank und kein Backend notwendig
- Kernfunktionen vollständig lokal nutzbar

## Starten

Einfach `index.html` lokal im Browser öffnen.

Alternativ kann das Repository direkt über **GitHub Pages** bereitgestellt werden.

## Struktur

```text
index.html    → Oberfläche und App-Shell
styles.css    → komplettes UI/Responsive Design
data.js       → Inhalte und Abfragebäume
app.js        → Navigation, Suche und Interaktionen
```

## Inhalte erweitern

Die fachlichen Inhalte befinden sich in `data.js`. Neue Abfragen werden über `RD_DATA.guides` ergänzt. Die Oberfläche ist bewusst datengetrieben aufgebaut, damit später sehr viele Abfragebäume, SOP-Verweise, Wissensartikel und Checklisten ergänzt werden können.

## Fachlicher Hinweis

Dieses Projekt ist als Software-, Ausbildungs- und Strukturierungshilfe gedacht. Die enthaltenen Beispielinhalte sind **keine verbindlichen medizinischen Handlungsanweisungen** und ersetzen keine lokalen SOPs, Algorithmen, Leitlinien, ärztlichen Anordnungen oder qualifizierte klinische Beurteilung. Vor einem produktiven Einsatz müssen alle Inhalte fachlich geprüft, freigegeben und regelmäßig versioniert werden.
