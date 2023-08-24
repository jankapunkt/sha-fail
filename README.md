# Meteor SHA Failure

Reproduction repo to show where Meteor's SHA256 produces differant hashes than compared implementations.

## Comparison:

The Meteor SHA256 implementation is compared with

- node:crypto (server-only)
- web crypto api (browser-only)
- crypto-js (both)

## How it works

First, install the dependencies and then run the package:

```shell
$ meteor npm install
$ meteor
```

Then the following algorithm gets executed:


1. The [full unicode 15.1 blocks](./imports/api/blocks.js) list is parsed and used to generate words from the full range
of each block.

2. The full list of all blocks/words is then iterated on server and client

3. The word is then passed to all available implementations to generate a sha256 hash in hex format

4. An `equal` flag is added, to determine, whether all generated hashes are equal

5. Output:

- If there is full equality among the hashes the block **passes**
- Otherwise a `fail` is logged, for example

```shell
I20230824-11:07:46.919(2)? --------------------------------------------------
I20230824-11:07:46.919(2)? Supplementary Private Use Area-B 100000 .. 10FFFF
I20230824-11:07:46.919(2)? [fail!] {
I20230824-11:07:46.919(2)?   m: 'ba180a17807261f13ab0d7dbe9640bd2b67aa123547d03baff577452dcad1ca2',
I20230824-11:07:46.919(2)?   c: 'f97d1bd9373aa8b13963694ca8a04154425f03b1becb8a8d8d09daaaf1c169cf',
I20230824-11:07:46.919(2)?   n: 'f97d1bd9373aa8b13963694ca8a04154425f03b1becb8a8d8d09daaaf1c169cf'
I20230824-11:07:46.920(2)? }
```

### Legend:

- `m` - Meteor (SHA256)
- `n` - `node:crypto`
- `w` - web crypto api
- `c` - crypto-js

### Note:

The detailed outputs were also logged to  [server.log](./server.log) and [client-ff.log](./client-ff.log) (produced with Firefox).

## Findings

The Meteor implementation of SHA256 fails to produce the expected output in 121 out of 280 blocks and
minor languages.

The following blocks are affected:

- High Surrogates (D800 .. DB7F)
- High Private Use Surrogates (DB80 .. DBFF)
- Low Surrogates (DC00 .. DFFF)
- Linear B Syllabary (10000 .. 1007F)
- Linear B Ideograms (10080 .. 100FF)
- Aegean Numbers (10100 .. 1013F)
- Ancient Greek Numbers (10140 .. 1018F)
- Ancient Symbols (10190 .. 101CF)
- Phaistos Disc (101D0 .. 101FF)
- Lycian (10280 .. 1029F)
- Carian (102A0 .. 102DF)
- Coptic Epact Numbers (102E0 .. 102FF)
- Old Italic (10300 .. 1032F)
- Gothic (10330 .. 1034F)
- Old Permic (10350 .. 1037F)
- Ugaritic (10380 .. 1039F)
- Old Persian (103A0 .. 103DF)
- Deseret (10400 .. 1044F)
- Shavian (10450 .. 1047F)
- Osmanya (10480 .. 104AF)
- Osage (104B0 .. 104FF)
- Elbasan (10500 .. 1052F)
- Caucasian Albanian (10530 .. 1056F)
- Linear A (10600 .. 1077F)
- Cypriot Syllabary (10800 .. 1083F)
- Imperial Aramaic (10840 .. 1085F)
- Palmyrene (10860 .. 1087F)
- Nabataean (10880 .. 108AF)
- Hatran (108E0 .. 108FF)
- Phoenician (10900 .. 1091F)
- Lydian (10920 .. 1093F)
- Meroitic Hieroglyphs (10980 .. 1099F)
- Meroitic Cursive (109A0 .. 109FF)
- Kharoshthi (10A00 .. 10A5F)
- Old South Arabian (10A60 .. 10A7F)
- Old North Arabian (10A80 .. 10A9F)
- Manichaean (10AC0 .. 10AFF)
- Avestan (10B00 .. 10B3F)
- Inscriptional Parthian (10B40 .. 10B5F)
- Inscriptional Pahlavi (10B60 .. 10B7F)
- Psalter Pahlavi (10B80 .. 10BAF)
- Old Turkic (10C00 .. 10C4F)
- Old Hungarian (10C80 .. 10CFF)
- Rumi Numeral Symbols (10E60 .. 10E7F)
- Brahmi (11000 .. 1107F)
- Kaithi (11080 .. 110CF)
- Sora Sompeng (110D0 .. 110FF)
- Chakma (11100 .. 1114F)
- Mahajani (11150 .. 1117F)
- Sharada (11180 .. 111DF)
- Sinhala Archaic Numbers (111E0 .. 111FF)
- Khojki (11200 .. 1124F)
- Multani (11280 .. 112AF)
- Khudawadi (112B0 .. 112FF)
- Grantha (11300 .. 1137F)
- Newa (11400 .. 1147F)
- Tirhuta (11480 .. 114DF)
- Siddham (11580 .. 115FF)
- Modi (11600 .. 1165F)
- Mongolian Supplement (11660 .. 1167F)
- Takri (11680 .. 116CF)
- Ahom (11700 .. 1173F)
- Warang Citi (118A0 .. 118FF)
- Zanabazar Square (11A00 .. 11A4F)
- Soyombo (11A50 .. 11AAF)
- Pau Cin Hau (11AC0 .. 11AFF)
- Bhaiksuki (11C00 .. 11C6F)
- Marchen (11C70 .. 11CBF)
- Masaram Gondi (11D00 .. 11D5F)
- Cuneiform (12000 .. 123FF)
- Cuneiform Numbers and Punctuation (12400 .. 1247F)
- Early Dynastic Cuneiform (12480 .. 1254F)
- Egyptian Hieroglyphs (13000 .. 1342F)
- Anatolian Hieroglyphs (14400 .. 1467F)
- Bamum Supplement (16800 .. 16A3F)
- Mro (16A40 .. 16A6F)
- Bassa Vah (16AD0 .. 16AFF)
- Pahawh Hmong (16B00 .. 16B8F)
- Miao (16F00 .. 16F9F)
- Ideographic Symbols and Punctuation (16FE0 .. 16FFF)
- Tangut (17000 .. 187FF)
- Tangut Components (18800 .. 18AFF)
- Kana Supplement (1B000 .. 1B0FF)
- Kana Extended-A (1B100 .. 1B12F)
- Nushu (1B170 .. 1B2FF)
- Duployan (1BC00 .. 1BC9F)
- Shorthand Format Controls (1BCA0 .. 1BCAF)
- Byzantine Musical Symbols (1D000 .. 1D0FF)
- Musical Symbols (1D100 .. 1D1FF)
- Ancient Greek Musical Notation (1D200 .. 1D24F)
- Tai Xuan Jing Symbols (1D300 .. 1D35F)
- Counting Rod Numerals (1D360 .. 1D37F)
- Mathematical Alphanumeric Symbols (1D400 .. 1D7FF)
- Sutton SignWriting (1D800 .. 1DAAF)
- Glagolitic Supplement (1E000 .. 1E02F)
- Mende Kikakui (1E800 .. 1E8DF)
- Adlam (1E900 .. 1E95F)
- Arabic Mathematical Alphabetic Symbols (1EE00 .. 1EEFF)
- Mahjong Tiles (1F000 .. 1F02F)
- Domino Tiles (1F030 .. 1F09F)
- Playing Cards (1F0A0 .. 1F0FF)
- Enclosed Alphanumeric Supplement (1F100 .. 1F1FF)
- Enclosed Ideographic Supplement (1F200 .. 1F2FF)
- Miscellaneous Symbols and Pictographs (1F300 .. 1F5FF)
- Emoticons (1F600 .. 1F64F)
- Ornamental Dingbats (1F650 .. 1F67F)
- Transport and Map Symbols (1F680 .. 1F6FF)
- Alchemical Symbols (1F700 .. 1F77F)
- Geometric Shapes Extended (1F780 .. 1F7FF)
- Supplemental Arrows-C (1F800 .. 1F8FF)
- Supplemental Symbols and Pictographs (1F900 .. 1F9FF)
- CJK Unified Ideographs Extension B (20000 .. 2A6DF)
- CJK Unified Ideographs Extension C (2A700 .. 2B73F)
- CJK Unified Ideographs Extension D (2B740 .. 2B81F)
- CJK Unified Ideographs Extension E (2B820 .. 2CEAF)
- CJK Unified Ideographs Extension F (2CEB0 .. 2EBEF)
- CJK Compatibility Ideographs Supplement (2F800 .. 2FA1F)
- Tags (E0000 .. E007F)
- Variation Selectors Supplement (E0100 .. E01EF)
- Supplementary Private Use Area-A (F0000 .. FFFFF)
- Supplementary Private Use Area-B (100000 .. 10FFFF)


## Affected packages

Mostly `accounts-password` and `accounts-passwordless` but I'm not sure, where this is used internally in core 
/ core packages.


## Suggested fix

- use `node:crypto` on the server
- use web crypto api on the web
- use crypto-js as fallback (cordova, browser.legacy)?
