# Snusfri

En privat, offline stop-snus-app til iPhone. Ingen konto, ingen sky — alt gemmes kun på din telefon.

## Åbn på iPhone

Appen er en *Progressive Web App*. Den skal åbnes via **HTTPS** (eller localhost), så Safari kan tilbyde **Føj til hjemmeskærm**.

### Hvis du har et link (HTTPS)

1. Åbn linket i **Safari** (ikke Chrome eller inde i en anden app).
2. Tryk på **Del**-ikonet (firkanten med pilen opad).
3. Vælg **Føj til hjemmeskærm**, og tryk på Tilføj.
4. Åbn **Snusfri** fra hjemmeskærmen. Den kører fuld skærm og virker også uden net.

### Hvis du har zip-filen

Læg mappen på et simpelt HTTPS-hosting (fx GitHub Pages: opret et offentligt repo, upload mappen, slå Pages til på branch `main`). Åbn derefter adressen i Safari og følg trinnene ovenfor.

Du kan også prøve appen på en computer ved at åbne `index.html` via en lokal webserver:

```bash
cd snusfri
python3 -m http.server 8899
```

…og gå til `http://localhost:8899` i browseren.

## Hvad kan appen?

- **Tæller** for snusfri tid (dage, timer, minutter, sekunder)
- **Penge sparet**, live, med prognose pr. dag, uge, måned og år
- Poser, dåser, nikotin og anslået tid, du har undgået
- **Abstinens-kompas**: ærligt forløb med toppen på dag 2–3, dag-for-dag de første 14 dage, mund og tandkød, og at «hvornår føles jeg normal?» ikke har ét svar
- **Sundhedstidslinje** med forsigtigt formulerede milepæle, plus **mærker**
- **Sparemål** med fremgang, forventet dato, og valgfri tilknytning til én af dine grunde
- **Mine grunde**, skrevet med egne ord, ét swipe væk — også i SOS og «bare én»-værnet
- **Trang-SOS** med **trang-surfer** (3–4 minutters bølge: den stiger, topper og daler), 2 minutters åndedræt, distraktioner og log
- **«Bare én pose»-værn**: sidste-fase-påmindelse, konsekvenser, et roligt nej — uden skam
- **Fest-mode**: plan lavet ædru; under festen et stort, enkelt UI med SOS, værn og makker
- **Hvis-så-planer** til dine egne triggere — vises først, når trangen logger den trigger
- **Tilbagefald**: log et slip uden at miste historikken, med et eftersyn uden skam, og start igen nu
- **Daglig check-in** / humør-dagbog, med redigerbare og tidligere dage
- **Dine dage**: retbare dage, tom dag = nul poser (aldrig dit gamle forbrug)
- Valgfri **nedtrapning 2.0** med fast stopdato, og advarsel hvis antallet stiger ved lavere styrke
- Valgfri **nikotinfri pose-log** med udløbsdato og ærlig advarsel
- **Makker**: én livline, sms-skabelon og deling via telefonens dele-ark — intet offentligt feed
- **Stoplinien** i appen: 80 31 31 31, sms «Nikotinfri» til 1231 (stoplinien.dk, opdateret 19. marts 2026)
- **Beskeder** i appen: tættere de første 48–72 timer, derefter på dine egne tidspunkter, altid snus-sprog, uden skyld. Når tilladelse er givet, kan varsler vise dage og sparede kroner, mens appen er åben. På iPhone kan en web-app ikke sende pålidelige varsler, når den er lukket — de gemmes herinde
- **Data**: automatisk intern kopi, eksport/import af JSON, gendan. Historikken overlever opdateringer
- **Indstillinger** og nulstil

Ved første åbning bygger appen en plan med dig: stopdato, forbrug, 3–5 grunde, triggere og hvis-så-planer, rester i skuffen, alkohol den første tid, og et tilbud om makker. Du kan også vælge *Prøv med et eksempel* og nulstille senere under **Mere**.

Forsiden svarer først på «hvordan har jeg det nu, og hvad hjælper nu»: kompas i uge 1, tre klare handlinger, kompakte penge, og ét relevant kort. Penge-detaljer folder ud ved tryk.

Som web-app kan Snusfri ikke lægge en rigtig widget på iOS-hjemmeskærmen — det kræver en native skal. Du kan dele dage og sparede kroner som tekst. 28 dage vises som delmål med det forbehold, at evidensen er for røg, ikke snus. Valgfri, diskret vægtlog — ikke et slankeprogram.

Milepælene og kompasset er vejledende, ikke medicinsk rådgivning. Ved alvorlig nedtrykthed, tal med en læge.

Version 1.2 · november 2026 · service worker v9.
