# Convert API — batteria QA (PR #100)

Widget con `showUpload`. DevTools → Network: `/api/convert/` e upload asset.  
Limiti: **10** allegati, **25MB**/file, **300k** caratteri inline.

**Routing**

| Tipo             | Estensioni                                                   | Network                                                |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| Convert (C)      | `.pdf` `.xlsx` `.xls` `.xlsm` `.ods` `.pptx` `.pptm` `.docm` | `POST /api/convert/{sessionID}` poi asset `{name}.txt` |
| Testo locale (T) | `.md` `.txt` `.html` `.csv` `.json` `.yml` …                 | **nessuna** `/api/convert/` (UTF-8 in browser)         |
| Native (N)       | `.doc` `.docx` `.dotx` `.xltx` `.potx`                       | nessuna convert; upload del binario                    |
| Rifiutato        | `.exe` `.zip` `.pages` `.ppt` `.odt`                         | warning, stop                                          |

---

### Flussi

- [x] Picker / drag & drop / paste (`Cmd/Ctrl+V`) / stesso file di nuovo
- [x] PDF, xlsx, pptx → convert + preview testo (card col **nome originale**, non `.txt`)
- [ ] `.xls` `.xlsm` `.ods` `.docm` → come xlsx (non native)
- [ ] `.md` `.csv` `.html` → preview testo, **no** `/api/convert/`, no errore encoding Ruby
- [ ] `.docx` → no convert; click apre l’asset in nuova tab; messaggio = attachment vuoto + link
- [x] Mix PDF + docx nello stesso batch
- [x] Loggato → `uploadAsset` · anonimo → `uploadAssetUnlogged` + notice 24h
- [ ] Senza `sessionID` → errore, file non aggiunto
- [x] `.exe` / file >25MB → warning, no convert · 20MB PDF ok
- [x] 10/10 disabilita upload · 9+3 → 1 aggiunto + warning
- [x] Convert 422/`error` → card non aggiunta · convert ok + upload txt ko → card comunque · native upload ko → no card
- [x] Spinner + skeleton; send disabilitato durante upload e se textarea vuota
- [x] Send: preview vuota, bolla con attachment; agente legge il testo (PDF) / solo link (docx)
- [x] Rimuovi card → quel file non parte; history ok; HTML in preview non eseguito
- [x] `showUpload={false}`: no upload · niente ConvertAPI

---

**Bloccanti:** convert assente su PDF; `.xls` native; `.docx` in convert; `.md`/`.csv` in convert (422 encoding); >25MB accettato; send durante upload.

**Nota:** l’asset uploadato è sempre `.txt` per i convertiti; la card deve mostrare l’estensione originale (open: va tenuto il formato in UI?).
