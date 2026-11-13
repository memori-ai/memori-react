# Convert API — batteria QA

Widget con `showUpload`. DevTools → Network: `/api/convert/` e upload asset.  
Limiti: **10** allegati, **25MB**/file, **300k** caratteri inline.

Liste in `src/helpers/constants.ts`. Il routing è in `processDocumentFile` (`UploadDocuments.tsx`): locale UTF-8, altrimenti `POST /api/convert/{sessionID}`, altrimenti rifiuto. `officeNativeExtensions` è vuoto: nessun formato viene più caricato come binario originale.

**Routing**

| Tipo        | Estensioni                                                                                         | Network                                                |
| ----------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Convert (C) | `.pdf` `.docx` `.docm` `.dotx` `.xlsx` `.xlsm` `.xls` `.xltx` `.ods` `.pptx` `.pptm` `.potx`       | `POST /api/convert/{sessionID}` poi asset `{name}.txt` |
| Testo locale (T) | `.txt` `.csv` `.tsv` `.html` `.htm` `.xhtml` `.xml` `.json` `.md` `.log` `.yml` `.yaml`       | **nessuna** `/api/convert/` (`FileReader` UTF-8)       |
| Native (N)  | — (lista vuota)                                                                                    | percorso ancora nel codice, nessun file lo prende      |
| Rifiutato   | `.doc` `.markdown` `.exe` `.zip` `.pages` `.ppt` `.odt` e tutto il resto                           | warning, stop                                          |

---

### Flussi

- [ ] Picker / drag & drop / paste (`Cmd/Ctrl+V`) / stesso file di nuovo
- [ ] PDF, xlsx, pptx, **docx** → convert + preview testo (card col **nome originale**, non `.txt`)
- [ ] `.xls` `.xlsm` `.xltx` `.ods` `.docm` `.dotx` `.pptm` `.potx` → come xlsx (convert, non native)
- [ ] `.txt` `.csv` `.tsv` `.md` `.html` `.htm` `.xhtml` `.xml` `.json` `.log` `.yml` `.yaml` → preview testo, **no** `/api/convert/`
- [ ] `.doc` e `.markdown` → warning, file non aggiunto (non sono in nessuna lista)
- [ ] Mix PDF + docx nello stesso batch: entrambi in convert, entrambi con testo
- [ ] Loggato → `uploadAsset` · anonimo → `uploadAssetUnlogged` + notice 24h
- [ ] Senza `sessionID` → errore, file non aggiunto
- [ ] `.exe` / file >25MB → warning, no convert · 20MB PDF ok
- [ ] 10/10 disabilita upload · 9+3 → 1 aggiunto + warning
- [ ] Convert 422/`error` → card non aggiunta · convert ok + upload txt ko → card comunque
- [ ] Un `.potx` senza diapositive (`pptx_modello_senza_diapositive`) → warning, no card
- [ ] Spinner + skeleton; send disabilitato durante upload e se textarea vuota
- [ ] Send: preview vuota, bolla con attachment; l’agente legge il testo (PDF, docx, xlsx, …)
- [ ] Rimuovi card → quel file non parte; history ok; HTML in preview non eseguito
- [ ] `showUpload={false}`: no upload · niente convert

---

**Bloccanti:** convert assente su PDF o `.docx`; `.txt`/`.csv`/`.md`/`.html` mandati a convert; `.doc` accettato; >25MB accettato; send durante upload.

**Nota:** l’asset uploadato è sempre `.txt` per i convertiti e per il testo locale; la card deve mostrare l’estensione originale.
