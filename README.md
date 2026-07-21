# Cognio

Suomalainen YO-kertaussovellus: kääntökortit, kokeet, esseet, muistiinpanot,
opintosuunnitelma, tilastot ja Salamavisa-minipeli. Yksi itsenäinen HTML-tiedosto,
jonka data tallentuu selaimen localStorageen (ja halutessa pilveen, ks. alla).

## Rakenne

```
cognio/
├── index.html          Koko sovellus (HTML + CSS + JS yhdessä)
├── logo.svg            Logo
├── database/
│   └── schema.sql      Tietokannan rakenne (Supabase) pilvitallennusta varten
├── .gitignore
└── README.md
```

## Kehitys

Avaa `index.html` selaimessa. Ei asennuksia, ei build-vaihetta.

## Julkaisu (DigitalOcean App Platform)

1. Vie tämä kansio GitHubiin (ks. ohje alla).
2. DigitalOcean → Create → Apps → yhdistä GitHub-repo.
3. Tyyppi: **Static Site**, Build command tyhjä, Output directory `/`.
4. Deploy → saat osoitteen `https://<nimi>.ondigitalocean.app`.

## Pilvitallennus ja Google-kirjautuminen (valinnainen)

Data on oletuksena vain selaimessa (laitekohtainen). Jos haluat kirjautumisen ja
saman datan joka laitteella:

1. Luo projekti [Supabasessa](https://supabase.com).
2. Aja `database/schema.sql` Supabasen SQL Editorissa.
3. Ota Google-kirjautuminen käyttöön ja lisää synkkakoodi `index.html`:ään.

Tarkat vaiheet: ks. erillinen käyttöönotto-opas.

## Tietosuoja

Kaikki opiskeludata on käyttäjän omaa. Pilviversiossa Row Level Security takaa,
että jokainen näkee vain oman datansa.
