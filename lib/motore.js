'use strict';
/* Teoria delle Corde · motore dei consigli.
   Gira solo sul server (api/consiglio.js): contiene l'archivio delle racchette, il catalogo delle
   corde, i pesi e le regole. La pagina non lo riceve mai: riceve solo il consiglio già calcolato.
   © 2026 Gabriele Corrieri. Tutti i diritti riservati. */

/* ---------- Utilità di formato ---------- */
const fmt = n => n.toFixed(2).replace(".",",");
const half = n => Math.round(n*2)/2;
const kg = n => (Number.isInteger(n)?String(n):n.toFixed(1)).replace(".",",");
const eur = n => n.toFixed(2).replace(".",",")+" €";
const num1 = n => n.toFixed(1).replace(".",",");

const RACKETS = [
 {id:"pure-aero-26",b:"Babolat",n:"Pure Aero 2026",cm:645,p:"16x19",ra:66,r:[20,24],src:"https://www.tenniswarehouse-europe.com/Babolat_Pure_Aero_2026_Racket/descpage-BPAR26.html?img=5"},
 {id:"pure-drive-25",b:"Babolat",n:"Pure Drive 2025",cm:645,p:"16x19",ra:69,r:[20,24],src:"https://www.tenniswarehouse-europe.com/Babolat_Pure_Drive_2025_Racket_/descpage-BPD25R.html?img=1"},
 {id:"pure-strike-24",b:"Babolat",n:"Pure Strike 100 (2024)",cm:645,p:"16x19",ra:63,r:[21,25],src:"https://www.tenniswarehouse-europe.com/descpageRCQBA-STRPS.html"},
 {id:"boom-mp-24",b:"HEAD",n:"Boom MP 2024",cm:645,p:"16x19",ra:66,r:[21,25],src:"https://www.tenniswarehouse-europe.com/descpageRCHEAD-HBOOMM-IT.html"},
 {id:"extreme-mp-24",b:"HEAD",n:"Extreme MP 2024",cm:645,p:"16x19",ra:66,r:[23,28],src:"https://www.tenniswarehouse-europe.com/Racchetta_Head_Extreme_MP_2024/descpageRCHEAD-HREM24-IT.html"},
 {id:"gravity-mp-25",b:"HEAD",n:"Gravity MP 2025",cm:645,p:"16x20",ra:62,r:[22,26],src:"https://www.merchantoftennis.com/products/head-gravity-mp-2025"},
 {id:"prestige-mp-23",b:"HEAD",n:"Prestige MP 2023",cm:640,p:"18x19",ra:null,r:null,src:"https://www.head.com/en/prestige-mp-236121.html"},
 {id:"radical-mp-25",b:"HEAD",n:"Radical MP 2025",cm:632,p:"16x19",ra:66,r:[21,25],src:"https://www.tenniswarehouse-europe.com/Head_Radical_MP_2025_Racket/descpage-HRMP.html?img=1"},
 {id:"speed-mp-26",b:"HEAD",n:"Speed MP 2026",cm:645,p:"16x19",ra:null,r:[22,26],src:"https://www.head.com/it_IT/product/speed-mp-2026-232026"},
 {id:"speed-pro-26",b:"HEAD",n:"Speed Pro 2026",cm:645,p:"18x20",ra:null,r:null,src:"https://www.tenniswarehouse-europe.com/catpage-HEADSPE-IT.html"},
 {id:"speed-tour-26",b:"HEAD",n:"Speed Tour 2026",cm:626,p:"16x19",ra:null,r:null,src:"https://www.tenniswarehouse-europe.com/catpage-HEADSPE-IT.html"},
 {id:"speed-team-26",b:"HEAD",n:"Speed Team 2026",cm:677,p:"16x19",ra:null,r:null,src:"https://www.tenniswarehouse-europe.com/catpage-HEADSPE-IT.html"},
 {id:"pwr-115",b:"HEAD",n:"PWR 115",cm:740,p:"16x19",ra:null,r:null,src:"https://www.head.com/it_CH/product/pwr-115-232306"},
 {id:"tfight-305s",b:"Tecnifibre",n:"T-Fight 305S ID",cm:632,p:"18x19",ra:63,r:[23,25],src:"https://www.tenniswarehouse-europe.com/Racchetta_Tecnifibre_TFight_305S_ID/descpageRCTECNIH-TF3SID-IT.html"},
 {id:"blade-98-v10",b:"Wilson",n:"Blade 98 16×19 v10",cm:632,p:"16x19",ra:61,r:[21,26],src:"https://www.tenniswarehouse-europe.com/Raquette_Wilson_Blade_98_16x19_V910_US_Open_2026/descpage-WBUSO26.html?img=1"},
 {id:"clash-100-v3",b:"Wilson",n:"Clash 100 v3",cm:645,p:"16x19",ra:54,r:[22,27],src:"https://www.tenniswarehouse-europe.com/Racchetta_Wilson_Clash_100_V3_0/descpageRCWILSON-WC10V3-IT.html"},
 {id:"prostaff-97-v14",b:"Wilson",n:"Pro Staff 97 v14",cm:626,p:"16x19",ra:66,r:[22,27],src:"https://www.tenniswarehouse-europe.com/Wilson_Pro_Staff_97_V140_Racket/descpageRCWILSON-W97V14-EN.html"},
 {id:"ultra-100-v5",b:"Wilson",n:"Ultra 100 v5",cm:645,p:"16x19",ra:67,r:[22,27],src:"https://www.tenniswarehouse-europe.com/descpageRCWILSON-WU1005-IT.html"},
 {id:"ezone-100-25",b:"Yonex",n:"EZONE 100 (2025)",cm:645,p:"16x19",ra:68,r:[20,27],src:"https://www.tenniswarehouse-europe.com/Racchetta_Yonex_EZONE_100_300g_Blu_Blast/descpageRCYONEX-EZ10BB-IT.html"},
 {id:"percept-100",b:"Yonex",n:"Percept 100",cm:645,p:"16x19",ra:66,r:[20,27],src:"https://www.tenniswarehouse-europe.com/Racchetta_Yonex_Percept_100/descpageRCYONEX-PERC1-IT.html"},
 {id:"vcore-100-26",b:"Yonex",n:"VCORE 100 (2026)",cm:645,p:"16x19",ra:65,r:[20,27],src:"https://www.tenniswarehouse-europe.com/Racchetta_Yonex_VCORE_100_Ruby_Red_300g/descpageRCYONEX-YVC106-IT.html"},
 {id:"vcore-98-26",b:"Yonex",n:"VCORE 98 (2026)",cm:632,p:"16x19",ra:63,r:[20,27],src:"https://www.tenniswarehouse-europe.com/Racchetta_Yonex_VCORE_98_Ruby_Red_305g/descpageRCYONEX-YVC986-IT.html"}
];
/* Altre racchette: elenchi e schede di Tennis Warehouse Europe, ottobre 2026.
   ra e r (range di tensione) solo dove la scheda del modello li riporta. */
const TW = "https://www.tenniswarehouse-europe.com/";
const SRC = {
 bab:TW+"catpage-BABOLATRAC-EN.html?from=tti", bst:TW+"catpage-BST25-EN.html", babo:"https://www.babolat.com/it/evo-drive-incordata/136-102431.html",
 hrad:TW+"catpage-HEADRAD-IT.html", hbs:TW+"catpage-HEADBS-IT.html", hspe:TW+"catpage-HEADSPE-IT.html", hrac:TW+"catpage-HEADRAC-IT.html", hgrav:TW+"catpage-HGRAR-IT.html",
 wbla:TW+"catpage-WBLA-IT.html", wcla:TW+"catpage-WCLASH-IT.html", wpro:TW+"catpage-WPROS-IT.html", wbs:TW+"catpage-WILBS-IT.html", wil:TW+"catpage-SCASAWH-IT.html",
 yvc:TW+"catpage-YVSV-IT.html", yper:TW+"catpage-YPERRAC-IT.html", tec:TW+"catpage-TECNITOP-IT.html", dun:TW+"catpage-DUNLOPRAC-EN.html"
};
RACKETS.push(
 {id:"pure-drive-team-25",b:"Babolat",n:"Pure Drive Team 2025",cm:645,p:"16x19",ra:69,r:[19,24],src:TW+"descpageRCQBA-BRPTR.html"},
 {id:"pure-drive-lite-25",b:"Babolat",n:"Pure Drive Lite 2025",cm:645,p:"16x19",ra:null,r:null,src:SRC.bab},
 {id:"pure-drive-plus-25",b:"Babolat",n:"Pure Drive Plus 2025",cm:645,p:"16x19",ra:null,r:null,src:SRC.bab},
 {id:"pure-drive-98-25",b:"Babolat",n:"Pure Drive 98 2025",cm:632,p:"16x20",ra:null,r:null,src:SRC.bab},
 {id:"pure-drive-107-25",b:"Babolat",n:"Pure Drive 107 2025",cm:690,p:"16x19",ra:null,r:null,src:SRC.bab},
 {id:"pure-aero-98-26",b:"Babolat",n:"Pure Aero 98 2026",cm:632,p:"16x20",ra:66,r:[20,24],src:TW+"Racchetta_Babolat_Pure_Aero_98_SINGLE/descpageRCQBA-BPA98R-IT.html"},
 {id:"pure-aero-team-26",b:"Babolat",n:"Pure Aero Team 2026",cm:645,p:"16x19",ra:null,r:null,src:SRC.bab},
 {id:"pure-aero-lite-26",b:"Babolat",n:"Pure Aero Lite 2026",cm:645,p:"16x19",ra:null,r:null,src:SRC.bab},
 {id:"pure-aero-plus-26",b:"Babolat",n:"Pure Aero Plus 2026",cm:645,p:"16x19",ra:null,r:null,src:SRC.bab},
 {id:"pure-strike-1619-25",b:"Babolat",n:"Pure Strike 16×19 (2025)",cm:632,p:"16x19",ra:null,r:null,src:SRC.bst},
 {id:"pure-strike-1820-25",b:"Babolat",n:"Pure Strike 18×20 (2025)",cm:632,p:"18x20",ra:null,r:null,src:SRC.bst},
 {id:"pure-strike-100-25",b:"Babolat",n:"Pure Strike 100 (2025)",cm:645,p:"16x19",ra:null,r:null,src:SRC.bst},
 {id:"pure-strike-97-24",b:"Babolat",n:"Pure Strike 97 (2024)",cm:626,p:"16x20",ra:null,r:null,src:SRC.bab},
 {id:"pure-strike-team-25",b:"Babolat",n:"Pure Strike Team (2025)",cm:645,p:"16x19",ra:null,r:null,src:SRC.bst},
 {id:"evo-drive-tour-25",b:"Babolat",n:"Evo Drive Tour 2025",cm:660,p:"16x19",ra:null,r:null,src:SRC.bab},
 {id:"evo-drive-lite-25",b:"Babolat",n:"Evo Drive Lite 2025",cm:670,p:"16x17",ra:null,r:null,src:SRC.bab},
 {id:"evo-aero-26",b:"Babolat",n:"Evo Aero 2026",cm:658,p:"16x19",ra:null,r:null,src:SRC.bab},
 {id:"boost-drive",b:"Babolat",n:"Boost Drive",cm:680,p:"16x19",ra:null,r:null,src:SRC.babo},
 {id:"radical-mp-23",b:"HEAD",n:"Radical MP 2023",cm:632,p:"16x19",ra:65,r:[21,25],src:TW+"Racchetta_Head_Radical_MP_2023/descpageRCHEAD-HMPR-IT.html"},
 {id:"radical-pro-25",b:"HEAD",n:"Radical Pro 2025",cm:632,p:"16x19",ra:null,r:null,src:SRC.hrad},
 {id:"radical-team-25",b:"HEAD",n:"Radical Team 2025",cm:658,p:"16x19",ra:null,r:null,src:SRC.hrad},
 {id:"radical-pro-23",b:"HEAD",n:"Radical Pro 2023",cm:632,p:"16x19",ra:null,r:null,src:SRC.hrad},
 {id:"speed-mp-24",b:"HEAD",n:"Speed MP 2024",cm:645,p:"16x19",ra:60,r:[21,25],src:TW+"Racchetta_Head_Speed_MP_2024/descpageRCHEAD-HSPDM-IT.html"},
 {id:"speed-mp-22",b:"HEAD",n:"Speed MP 2022",cm:645,p:"16x19",ra:null,r:null,src:SRC.hbs},
 {id:"speed-pro-24",b:"HEAD",n:"Speed Pro 2024",cm:645,p:"18x20",ra:null,r:null,src:SRC.hspe},
 {id:"speed-mp-l-26",b:"HEAD",n:"Speed MP L 2026",cm:645,p:"16x19",ra:null,r:null,src:SRC.hspe},
 {id:"speed-power-24",b:"HEAD",n:"Speed Power 2024",cm:740,p:"16x19",ra:null,r:null,src:SRC.hspe},
 {id:"boom-pro-24",b:"HEAD",n:"Boom Pro 2024",cm:632,p:"16x19",ra:64,r:[21,25],src:TW+"Racchetta_Head_Boom_Pro_2024/descpageRCHEAD-HBOOMP-IT.html"},
 {id:"boom-mp-26",b:"HEAD",n:"Boom MP 2026",cm:645,p:"16x19",ra:null,r:null,src:SRC.hrac},
 {id:"boom-pro-26",b:"HEAD",n:"Boom Pro 2026",cm:632,p:"16x19",ra:null,r:null,src:SRC.hrac},
 {id:"boom-team-26",b:"HEAD",n:"Boom Team 2026",cm:690,p:"16x19",ra:null,r:null,src:SRC.hrac},
 {id:"boom-mp-l-26",b:"HEAD",n:"Boom MP L 2026",cm:645,p:"16x19",ra:null,r:null,src:SRC.hrac},
 {id:"extreme-pro-24",b:"HEAD",n:"Extreme Pro 2024",cm:632,p:"16x19",ra:64,r:[21,25],src:TW+"descpageRCHEAD-HREP24-EN.html"},
 {id:"gravity-tour-25",b:"HEAD",n:"Gravity Tour 2025",cm:632,p:"16x19",ra:null,r:null,src:SRC.hgrav},
 {id:"gravity-pro-25",b:"HEAD",n:"Gravity Pro 2025",cm:645,p:"18x20",ra:null,r:null,src:SRC.hgrav},
 {id:"gravity-team-25",b:"HEAD",n:"Gravity Team 2025",cm:671,p:"16x20",ra:null,r:null,src:SRC.hgrav},
 {id:"gravity-mp-23",b:"HEAD",n:"Gravity MP 2023",cm:645,p:"16x20",ra:null,r:null,src:SRC.hgrav},
 {id:"gravity-mp-l-25",b:"HEAD",n:"Gravity MP L 2025",cm:645,p:"16x20",ra:null,r:null,src:SRC.hgrav},
 {id:"prestige-pro-23",b:"HEAD",n:"Prestige Pro 2023",cm:630,p:"18x20",ra:null,r:null,src:SRC.hrac},
 {id:"prestige-tour-23",b:"HEAD",n:"Prestige Tour 2023",cm:613,p:"16x19",ra:null,r:null,src:SRC.hrac},
 {id:"prestige-mp-l-23",b:"HEAD",n:"Prestige MP L 2023",cm:639,p:"16x19",ra:null,r:null,src:SRC.hrac},
 {id:"instinct-mp-25",b:"HEAD",n:"Instinct MP 2025",cm:645,p:"16x19",ra:null,r:null,src:SRC.hbs},
 {id:"instinct-team-25",b:"HEAD",n:"Instinct Team 2025",cm:645,p:"16x19",ra:null,r:[21,25],src:TW+"descpageRCHEAD-HINT25-IT.html"},
 {id:"blade-100-v10",b:"Wilson",n:"Blade 100 v10",cm:645,p:"16x19",ra:61,r:[22,26],src:TW+"Racchetta_Wilson_Blade_100_v10/descpageRCWILSON-WB1001-IT.html"},
 {id:"blade-98-1820-v10",b:"Wilson",n:"Blade 98 18×20 v10",cm:632,p:"18x20",ra:null,r:null,src:SRC.wbla},
 {id:"blade-100l-v10",b:"Wilson",n:"Blade 100L v10",cm:645,p:"16x19",ra:null,r:null,src:SRC.wbla},
 {id:"blade-98s-v10",b:"Wilson",n:"Blade 98S v10",cm:632,p:"18x16",ra:null,r:null,src:SRC.wbla},
 {id:"blade-104-v1",b:"Wilson",n:"Blade 104 v1",cm:670,p:"16x19",ra:null,r:null,src:SRC.wbla},
 {id:"blade-100-pro-v10",b:"Wilson",n:"Blade 100 Pro v10",cm:645,p:"16x20",ra:null,r:null,src:SRC.wbla},
 {id:"blade-feel-103-26",b:"Wilson",n:"Blade Feel 103 2026",cm:665,p:"16x20",ra:null,r:null,src:SRC.wbla},
 {id:"clash-100l-v3",b:"Wilson",n:"Clash 100L v3",cm:645,p:"16x19",ra:null,r:null,src:SRC.wcla},
 {id:"clash-100-pro-v3",b:"Wilson",n:"Clash 100 Pro v3",cm:645,p:"16x20",ra:null,r:null,src:SRC.wcla},
 {id:"clash-100ul-v3",b:"Wilson",n:"Clash 100 UL v3",cm:645,p:"16x19",ra:null,r:null,src:SRC.wcla},
 {id:"prostaff-97l-v14",b:"Wilson",n:"Pro Staff 97L v14",cm:626,p:"16x19",ra:null,r:null,src:SRC.wpro},
 {id:"prostaff-97-classic",b:"Wilson",n:"Pro Staff 97 Classic",cm:626,p:"16x19",ra:null,r:null,src:SRC.wpro},
 {id:"ultra-100l-v5",b:"Wilson",n:"Ultra 100L v5",cm:645,p:"16x19",ra:null,r:null,src:SRC.wbs},
 {id:"defyer-100",b:"Wilson",n:"Defyer 100",cm:645,p:"16x19",ra:null,r:null,src:SRC.wbs},
 {id:"defyer-98",b:"Wilson",n:"Defyer 98",cm:632,p:"16x20",ra:null,r:null,src:SRC.wbs},
 {id:"rf-01",b:"Wilson",n:"RF 01",cm:632,p:"16x19",ra:null,r:null,src:SRC.wbs},
 {id:"burn-100ls-v6",b:"Wilson",n:"Burn 100 LS v6",cm:645,p:"18x16",ra:null,r:null,src:SRC.wil},
 {id:"ezone-98-25",b:"Yonex",n:"EZONE 98 (2025)",cm:632,p:"16x19",ra:63,r:[20,27],src:TW+"Racchetta_Yonex_EZONE_98_305g_Espresso/descpageRCYONEX-EZ98EB-IT.html"},
 {id:"vcore-100l-26",b:"Yonex",n:"VCORE 100L (2026)",cm:645,p:"16x19",ra:null,r:null,src:SRC.yvc},
 {id:"vcore-98l-26",b:"Yonex",n:"VCORE 98L (2026)",cm:630,p:"16x19",ra:null,r:null,src:SRC.yvc},
 {id:"percept-97",b:"Yonex",n:"Percept 97",cm:626,p:"16x19",ra:60,r:[20,27],src:TW+"descpageRCYONEX-YPER97-IT.html"},
 {id:"percept-97l",b:"Yonex",n:"Percept 97L",cm:626,p:"16x19",ra:null,r:null,src:SRC.yper},
 {id:"percept-100d",b:"Yonex",n:"Percept 100D",cm:645,p:"18x19",ra:null,r:null,src:SRC.yper},
 {id:"percept-100l",b:"Yonex",n:"Percept 100L",cm:645,p:"16x19",ra:null,r:null,src:SRC.yper},
 {id:"tf40-305-1619",b:"Tecnifibre",n:"TF40 305 16×19",cm:632,p:"16x19",ra:64,r:[22,24],src:TW+"Racchetta_Tecnifibre_TF40_305g_16x19/descpageRCTECNIH-TF40R1-IT.html"},
 {id:"tf40-305-1820",b:"Tecnifibre",n:"TF40 305 18×20",cm:630,p:"18x20",ra:null,r:null,src:SRC.tec},
 {id:"tfight-300s",b:"Tecnifibre",n:"T-Fight 300S",cm:630,p:"16x19",ra:null,r:null,src:SRC.tec},
 {id:"tfight-315s",b:"Tecnifibre",n:"T-Fight 315S",cm:630,p:"16x19",ra:null,r:null,src:SRC.tec},
 {id:"tfight-iso-305",b:"Tecnifibre",n:"T-Fight ISO 305",cm:630,p:"18x19",ra:null,r:null,src:SRC.tec},
 {id:"tfight-blu-300",b:"Tecnifibre",n:"T-Fight Blu 300",cm:645,p:"16x19",ra:null,r:null,src:SRC.tec},
 {id:"cx-200",b:"Dunlop",n:"CX 200 (2024)",cm:632,p:"16x19",ra:64,r:[20,29],src:TW+"descpageRCDUNHGER-DCX2S-IT.html"},
 {id:"cx-200-tour",b:"Dunlop",n:"CX 200 Tour",cm:615,p:"18x20",ra:null,r:null,src:SRC.dun},
 {id:"cx-400",b:"Dunlop",n:"CX 400",cm:645,p:"16x19",ra:null,r:null,src:SRC.dun},
 {id:"sx-300-25",b:"Dunlop",n:"SX 300 (2025)",cm:645,p:"16x19",ra:null,r:null,src:SRC.dun},
 {id:"sx-300-tour-25",b:"Dunlop",n:"SX 300 Tour (2025)",cm:630,p:"16x19",ra:null,r:null,src:SRC.dun},
 {id:"sx-300-ls-25",b:"Dunlop",n:"SX 300 LS (2025)",cm:645,p:"16x19",ra:null,r:null,src:SRC.dun},
 {id:"fx-500-25",b:"Dunlop",n:"FX 500 (2025)",cm:645,p:"16x19",ra:null,r:null,src:SRC.dun},
 {id:"fx-500-tour",b:"Dunlop",n:"FX 500 Tour",cm:632,p:"16x19",ra:null,r:null,src:SRC.dun},
 {id:"fx-500-ls-25",b:"Dunlop",n:"FX 500 LS (2025)",cm:645,p:"16x19",ra:null,r:null,src:SRC.dun},
 {id:"lx-1000-24",b:"Dunlop",n:"LX 1000 (2024)",cm:742,p:"16x18",ra:null,r:null,src:SRC.dun}
);
RACKETS.sort((a,b)=>a.b.localeCompare(b.b)||a.n.localeCompare(b.n,"it",{numeric:true}));
const RACKET_BRANDS = [...new Set(RACKETS.map(r=>r.b))];
const PAT = {"16x19":"16×19","18x20":"18×20","18x19":"18×19","16x20":"16×20","16x18":"16×18","18x16":"18×16","16x17":"16×17","open":"16×15 / 16×16"};
const OPEN_PATS = ["16x18","18x16","16x17","open"], DENSE_PATS = ["18x20","18x19"];
const HEADS = {"93":600,"95":613,"97":626,"98":632,"99":639,"100":645,"102":658,"105":677,"107":690,"110":710,"115":740};

/* ---------- Dati: corde in commercio ----------
   Prezzi: set da 12 m su Tennis Warehouse Europe, ottobre 2026 (il più basso tra i calibri).
   twu: misure del database TWU a circa 23 kg (51 libbre), swing veloce: g calibro misurato,
   s rigidità (lb/in), l perdita di tensione nel test (%), sp potenziale di spin. */
const TWEU = {
 lux:"https://www.tenniswarehouse-europe.com/catpage-LUXILON-IT.html",
 sol:"https://www.tenniswarehouse-europe.com/catpage-SOLINCOPLYS-EN.html",
 rpm:"https://www.tenniswarehouse-europe.com/descpageACQBA-BRPMB17-IT.html",
 spin:"https://www.tenniswarehouse-europe.com/catpage-SPINSTR.html",
 lynxt:"https://www.tenniswarehouse-europe.com/Set_de_cordaje_HEAD_Lynx_Tour_1_25_17_Negro/descpageACHEAD-HLTSBK-ES.html",
 lynx:"https://www.tenniswarehouse-europe.com/descpageACHEAD-LYNX18-IT.html",
 ptp:"https://www.tenniswarehouse-europe.com/catpage-YPTPS-FR.html",
 razor:"https://www.tenniswarehouse-europe.com/catpage-TECRAZCO-DE.html",
 tecni:"https://www.tenniswarehouse-europe.com/catpage-TECNIFAM1-IT.html",
 kir:"https://www.tenniswarehouse-europe.com/catpage-KIRSCH-EN.html",
 sig:"https://www.tenniswarehouse-europe.com/catpage-SIGNUMPRO-EN.html",
 multi:"https://www.tenniswarehouse-europe.com/catpage-MULTIFILSTR-DE.html",
 syn:"https://www.tenniswarehouse-europe.com/catpage-SYNGUTS-EN.html",
 gut:"https://www.tenniswarehouse-europe.com/catpage-NATURALGUT-IT.html"
};
const TWU_DB = "https://twu.tennis-warehouse.com/learning_center/reporter2.php";
const STRINGS = [
 {b:"Luxilon",n:"ALU Power",t:"poly",g:[1.20,1.25,1.30],p:17.90,twu:{g:1.25,s:209.2,l:46.6,sp:5.8},src:TWEU.lux},
 {b:"Luxilon",n:"ALU Power Soft",t:"poly",g:[1.25],p:21.90,twu:{g:1.25,s:197.7,l:36.6,sp:6.9},src:TWEU.lux},
 {b:"Luxilon",n:"4G",t:"poly",g:[1.25,1.30],p:18.90,twu:{g:1.25,s:258.9,l:21.3,sp:3.9},src:TWEU.lux},
 {b:"Luxilon",n:"4G Soft",t:"poly",g:[1.25],p:21.90,twu:{g:1.25,s:217.2,l:25.4,sp:6.7},src:TWEU.lux},
 {b:"Luxilon",n:"Element",t:"poly",g:[1.25,1.30],p:14.90,twu:{g:1.25,s:208.0,l:33.6,sp:5.5},src:TWEU.lux},
 {b:"Babolat",n:"RPM Blast",t:"poly",g:[1.20,1.25,1.30,1.35],p:12.90,twu:{g:1.25,s:233.7,l:33.3,sp:4.6},src:TWEU.rpm},
 {b:"Babolat",n:"RPM Rough",t:"poly",g:[1.25,1.30],p:12.90,twu:null,src:TWEU.spin},
 {b:"Solinco",n:"Hyper-G",t:"poly",g:[1.10,1.15,1.20,1.25,1.30],p:9.90,twu:{g:1.25,s:218.3,l:24.7,sp:6.1},src:TWEU.sol},
 {b:"Solinco",n:"Hyper-G Soft",t:"poly",g:[1.15,1.20,1.25,1.30],p:10.90,twu:{g:1.25,s:172.0,l:28.7,sp:5.2},src:TWEU.sol},
 {b:"Solinco",n:"Confidential",t:"poly",g:[1.15,1.20,1.25,1.30],p:10.90,twu:{g:1.30,s:222.3,l:22.2,sp:6.4},src:TWEU.sol},
 {b:"Solinco",n:"Confidential Soft",t:"poly",g:[1.20,1.25,1.30],p:11.90,twu:{g:1.25,s:194.3,l:27.7,sp:6.5},src:TWEU.sol},
 {b:"Solinco",n:"Tour Bite",t:"poly",g:[1.05,1.10,1.15,1.20,1.25,1.30,1.35],p:9.90,twu:{g:1.25,s:237.7,l:25.2,sp:5.9},src:TWEU.sol},
 {b:"Solinco",n:"Tour Bite Soft",t:"poly",g:[1.15,1.20,1.25,1.30],p:10.90,twu:{g:1.25,s:192.0,l:29.3,sp:5.8},src:TWEU.sol},
 {b:"Solinco",n:"Revolution",t:"poly",g:[1.15,1.20,1.25,1.30],p:7.50,twu:{g:1.25,s:212.6,l:28.4,sp:8.0},src:TWEU.sol},
 {b:"HEAD",n:"Lynx Tour",t:"poly",g:[1.25,1.30],p:8.90,twu:{g:1.25,s:217.7,l:24.6,sp:7.1},src:TWEU.lynxt},
 {b:"HEAD",n:"Lynx",t:"poly",g:[1.20,1.25,1.30],p:7.90,twu:{g:1.25,s:179.5,l:47.0,sp:5.7},src:TWEU.lynx},
 {b:"Yonex",n:"Poly Tour Pro",t:"poly",g:[1.15,1.20,1.25],p:10.90,twu:{g:1.20,s:188.6,l:33.3,sp:5.2},src:TWEU.ptp},
 {b:"Tecnifibre",n:"Razor Code",t:"poly",g:[1.20,1.25,1.30],p:13.90,twu:{g:1.25,s:229.2,l:29.6,sp:5.6},src:TWEU.razor},
 {b:"Tecnifibre",n:"Tecni Spin",t:"poly",g:[1.24,1.28],p:9.90,twu:{g:1.28,s:207.5,l:27.0,sp:6.5},src:TWEU.tecni},
 {b:"Kirschbaum",n:"Pro Line II",t:"poly",g:[1.15,1.20,1.25,1.30],p:7.90,twu:{g:1.25,s:201.2,l:44.9,sp:4.7},src:TWEU.kir},
 {b:"Signum Pro",n:"Poly Plasma",t:"poly",g:[1.18,1.23,1.28],p:4.90,twu:{g:1.23,s:198.3,l:26.0,sp:5.4},src:TWEU.sig},
 {b:"Tecnifibre",n:"X-One Biphase",t:"multi",g:[1.18,1.24,1.30],p:22.50,src:TWEU.multi},
 {b:"Tecnifibre",n:"NRG2",t:"multi",g:[1.24,1.32],p:18.69,src:TWEU.multi},
 {b:"Tecnifibre",n:"Triax",t:"multi",g:[1.28,1.33],p:17.24,src:TWEU.multi},
 {b:"Wilson",n:"NXT",t:"multi",g:[1.24],p:22.90,src:TWEU.multi},
 {b:"Wilson",n:"Sensation",t:"multi",g:[1.25,1.30],p:11.90,src:TWEU.multi},
 {b:"Babolat",n:"Xalt",t:"multi",g:[1.25,1.30],p:15.90,src:TWEU.multi},
 {b:"Babolat",n:"Xcel",t:"multi",g:[1.25,1.30],p:13.90,src:TWEU.multi},
 {b:"Babolat",n:"Addixion+",t:"multi",g:[1.25,1.30],p:11.90,src:TWEU.multi},
 {b:"Babolat",n:"XPlore",t:"multi",g:[1.25,1.30,1.35],p:7.90,src:TWEU.multi},
 {b:"HEAD",n:"Velocity MLT",t:"multi",g:[1.25,1.30],p:7.90,src:TWEU.multi},
 {b:"Prince",n:"Premier Control",t:"multi",g:[1.40],p:10.90,src:TWEU.multi},
 {b:"Babolat",n:"Syn Gut",t:"syn",g:[1.25,1.30],p:5.20,src:TWEU.syn},
 {b:"Prince",n:"Synthetic Gut Original",t:"syn",g:[1.30],p:6.90,src:TWEU.syn},
 {b:"Wilson",n:"Synthetic Gut Power",t:"syn",g:[1.30],p:7.90,src:TWEU.syn},
 {b:"Völkl",n:"Classic Synthetic Gut",t:"syn",g:[1.25,1.30],p:4.90,src:TWEU.syn},
 {b:"KLIP",n:"Legend Natural Gut",t:"gut",g:[1.25,1.30],p:39.90,src:TWEU.gut},
 {b:"Babolat",n:"Touch VS",t:"gut",g:[1.25,1.30],p:48.90,src:TWEU.gut},
 {b:"Luxilon",n:"Natural",t:"gut",g:[1.25,1.30],p:51.90,src:TWEU.gut},
 {b:"Wilson",n:"Natural Gut",t:"gut",g:[],gl:"17",p:57.90,src:TWEU.gut}
];
const BRANDS = [...new Set(STRINGS.map(s=>s.b))];

/* ---------- Tipi di corda, pesi e regole ---------- */
const KEYS = ["poly","shaped","multi","gut","syn","hybrid","rhybrid"];
const TYPES = {
 poly:{n:"Monofilamento poliestere",s:"Poliestere",mode:"poly",d:"Corda rigida che dà molto controllo anche colpendo forte e resiste alla rottura. È poco elastica e va cambiata con regolarità: le guide indicano ogni 15–20 ore di gioco.",
   alt:"Se vuoi più controllo e durata e non hai fastidi al braccio."},
 shaped:{n:"Poliestere da spin",s:"Poliestere da spin",mode:"poly",d:"Poliestere scelto perché le corde scorrono bene l'una sull'altra: le verticali si spostano di lato sulla palla e tornano in posizione (snapback), e questo ritorno aumenta la rotazione. Conta lo scorrimento, non gli spigoli.",
   alt:"Se vuoi più rotazione e accetti una corda più rigida."},
 multi:{n:"Multifilamento",s:"Multifilamento",mode:"soft",d:"Migliaia di microfibre intrecciate: morbida, elastica e potente. Protegge il braccio, ma si consuma prima del poliestere.",
   alt:"Se vuoi più comfort e potenza, accettando che duri meno."},
 gut:{n:"Budello naturale",s:"Budello naturale",mode:"soft",d:"La corda più elastica e confortevole, con potenza e sensibilità al massimo livello. Costa di più e teme l'umidità.",
   alt:"Se vuoi il massimo di comfort e sensibilità e il budget lo permette."},
 syn:{n:"Nylon (synthetic gut)",s:"Nylon",mode:"soft",d:"Corda in nylon a filamento centrale: economica, equilibrata e adatta a chi gioca poco o sta imparando.",
   alt:"Se vuoi spendere poco e giochi poche volte a settimana."},
 hybrid:{n:"Ibrido classico: poliestere in verticale",s:"Ibrido classico",mode:"hybrid",d:"Poliestere sulle verticali per controllo e durata, corda morbida sulle orizzontali per comfort. È l'ibrido di chi rompe spesso o cerca controllo; per lo spin è meno adatto, perché le corde scorrono meno.",
   alt:"Se rompi spesso le corde ma vuoi più comfort del poliestere pieno."},
 rhybrid:{n:"Ibrido invertito: corda morbida in verticale",s:"Ibrido invertito",mode:"rhybrid",d:"Budello o multifilamento sulle verticali e poliestere liscio sulle orizzontali. Con il budello in verticale è la combinazione con meno attrito tra le corde nei test della TWU: unisce comfort e rotazione, ma dura meno dell'ibrido classico.",
   alt:"Se cerchi rotazione senza rinunciare al comfort."}
};

const W = { // pesi: [poly, shaped, multi, gut, syn, hybrid, rhybrid]
 level:{beg:[-3,-3,2,0,3,-1,0],int:[1,0,2,0,1,2,1],adv:[2,2,0,1,-1,2,2],pro:[3,2,-1,1,-2,2,2]},
 age:{u14:[0,0,2,0,2,0,0],teen:[-1,-1,1,0,1,0,0],adult:[0,0,0,0,0,0,0],o55:[-2,-2,2,2,0,0,1]},
 freq:{f1:[-1,-1,1,0,1,0,0],f2:[0,0,0,0,0,0,0],f3:[1,0,0,0,0,1,1],f5:[2,1,-1,0,-1,1,1]},
 style:{base:[1,2,0,0,0,1,1],atk:[2,0,0,0,0,1,0],sv:[-1,-1,2,2,0,0,2],all:[1,0,1,0,0,2,2]},
 swing:{short:[-2,-2,2,1,1,0,0],mid:[0,0,0,0,0,1,1],long:[2,2,-1,0,-1,0,1]},
 spin:{low:[0,-1,1,1,0,0,0],mid:[1,0,0,0,0,1,1],high:[2,3,-1,0,-1,-1,2]},
 brk:{never:[0,0,1,1,1,0,0],months:[0,0,0,0,0,0,0],month:[2,1,-2,-1,-1,2,1],weeks:[3,2,-3,-3,-2,1,-1],nd:[0,0,0,0,0,0,0]},
 pain:{no:[0,0,0,0,0,0,0],some:[-2,-2,2,2,0,1,1],yes:[-6,-6,3,4,1,-2,0]},
 prio:{power:[-1,-1,2,3,0,0,1],control:[3,1,0,0,0,1,0],spin:[1,4,-1,0,-1,-1,3],comfort:[-2,-2,3,3,0,1,2],dur:[3,1,-2,-3,1,1,-1],keep:[0,0,0,0,0,0,0]},
 pattern:{"16x19":[0,1,0,0,0,0,0],"18x20":[1,0,0,0,0,0,0],"18x19":[1,0,0,0,0,0,0],"16x20":[0,1,0,0,0,0,0],"16x18":[0,1,0,0,0,0,0],"18x16":[0,1,0,0,0,0,1],"16x17":[1,1,-1,-1,0,0,0],open:[1,1,-1,-1,0,0,0],nd:[0,0,0,0,0,0,0]},
 head:{small:[1,0,0,0,0,0,0],mid:[0,0,0,0,0,0,0],large:[0,0,1,0,1,0,0],xl:[-1,-1,1,0,2,0,0],nd:[0,0,0,0,0,0,0]},
 stiff:{soft:[0,0,0,0,0,0,0],medium:[0,0,0,0,0,0,0],stiff:[-1,-1,1,1,0,0,1],nd:[0,0,0,0,0,0,0]},
 budget:{low:[1,0,-1,-5,3,-1,-2],mid:[1,1,1,-3,0,0,-1],high:[0,0,1,-1,-1,1,0],top:[0,0,0,3,-1,1,2],reel:[1,1,0,-2,1,1,0]}
};
const CAP = {low:10,mid:20,high:40,top:Infinity,reel:Infinity};
const INERTIA = {poly:[3,1,0,0,0,0,0],multi:[0,0,3,0,0,0,0],gut:[0,0,0,3,0,0,0],syn:[0,0,0,0,3,0,0],hybrid:[0,0,0,0,0,2,2]};
const FAM = {poly:["poly","shaped"],multi:["multi"],gut:["gut"],syn:["syn"],hybrid:["hybrid","rhybrid"]};
const CURN = {poly:"poliestere",multi:"multifilamento",gut:"budello naturale",syn:"nylon (synthetic gut)",hybrid:"un ibrido"};
const CUR_C = {t21:21,t22:22.5,t24:24.5,t26:26.5};
const CURT_L = {t21:"fino a 21 kg",t22:"22–23 kg",t24:"24–25 kg",t26:"26 kg o più"};
const SURF_L = {clay:"terra rossa",hard:"cemento",synth:"sintetico o erba sintetica",indoor:"indoor"};
const SEASON_L = {summer:"soprattutto d'estate all'aperto",winter:"soprattutto d'inverno all'aperto",year:"tutto l'anno all'aperto",indoor:"soprattutto al coperto"};

/* ---------- Risposte ammesse ---------- */
const VALORI = {
 level:["beg","int","adv","pro"], age:["u14","teen","adult","o55"], freq:["f1","f2","f3","f5"],
 pattern:["16x19","18x20","18x19","16x20","16x18","18x16","open","nd"],
 head:[...Object.keys(HEADS),"nd"], stiff:["soft","medium","stiff","nd"],
 current:["poly","multi","gut","syn","hybrid","nd"], curT:["t21","t22","t24","t26","nd"],
 style:["base","atk","sv","all"], swing:["short","mid","long"], spin:["low","mid","high"],
 brk:["never","months","month","weeks","nd"], prio:["power","control","spin","comfort","dur","keep"],
 surface:["clay","hard","synth","indoor"], season:["summer","winter","year","indoor"],
 budget:["low","mid","high","top","reel"]
};
const OBBLIGATORIE = ["level","age","freq","racket","current","style","swing","spin","brk","prio","surface","season","budget"];
/* La domanda sui fastidi non arriva al server: il browser la trasforma in un livello di protezione del braccio. */
const BRACCIO = {nessuna:"no", media:"some", alta:"yes"};
const ESITI = ["dura","giusta","morbida"];
// Stesse condizioni della pagina: alcune domande compaiono solo in certi casi
function mostrata(id, a){
  if(id==="pattern"||id==="head"||id==="stiff") return a.racket==="altro";
  if(id==="curT") return !!a.current&&a.current!=="nd";
  return true;
}

/* ---------- Funzioni del motore ---------- */
const headCatOf = cm => cm==null?"nd":cm<630?"small":cm<=655?"mid":cm<=700?"large":"xl";
function stiffCatOf(info){
  if(info.known) return info.ra==null?"nd":info.ra<=63?"soft":info.ra<=67?"medium":"stiff";
  return info.stiffAns&&info.stiffAns!=="nd"?info.stiffAns:"nd";
}

/* Selezione dei modelli di corda */
function closestG(list,target){
  if(!list.length) return null;
  return list.reduce((a,b)=>{const da=Math.abs(a-target),db=Math.abs(b-target);return (db<da-1e-9||(Math.abs(db-da)<1e-9&&b>a))?b:a;});
}
function gaugeBonus(s,target){const c=closestG(s.g,target);if(c==null)return -0.5;const d=Math.abs(c-target);return d<0.005?1:d<=0.03?0.5:-0.5;}
function polyScore(s,ctx,focus){
  const T=s.twu; let sc=T?0:-1.5;
  const stiff=T?T.s:210, loss=T?T.l:35, spin=T?T.sp:null;
  if(focus==="spin"||ctx.spinWanted) sc+=spin==null?-1.5:(spin-6)*1.5;
  if(focus==="cross") sc+=(spin==null?-1:(spin-6))+(215-stiff)/15;
  if(ctx.comfort) sc+=(205-stiff)/8;
  if(ctx.control) sc+=(stiff-205)/20;
  sc+=(35-loss)/8;
  if(ctx.durable&&loss<=30) sc+=1;
  return sc;
}
function softScore(s,ctx){
  const tier=s.p>=18?3:s.p>=11?2:1; let sc=0;
  if(ctx.cap>=40) sc+=tier; else if(ctx.cap>=20) sc+=tier===2?2:tier===1?1:0; else sc+=tier===1?2:0;
  if(ctx.durable&&s.g.length&&Math.max(...s.g)>=1.32) sc+=1.5;
  if(ctx.comfort&&tier>=2) sc+=0.5;
  return sc;
}
/* Varietà di marche: prima la migliore di ogni marca, purché non troppo lontana dalla prima scelta */
function pickDiverse(scored,n,margin){
  if(!scored.length) return [];
  const topSc=scored[0].sc, out=[], cnt={};
  for(const x of scored){ if(out.length>=n||x.sc<topSc-margin) break; if(cnt[x.s.b]) continue; out.push(x); cnt[x.s.b]=1; }
  for(const x of scored){ if(out.length>=n) break; if(out.includes(x)||(cnt[x.s.b]||0)>=2) continue; out.push(x); cnt[x.s.b]=(cnt[x.s.b]||0)+1; }
  return out.concat(scored.filter(x=>!out.includes(x))).map(x=>x.s);
}
function pickModels(best,gM,gC,ctx){
  const pool=t=>STRINGS.filter(s=>s.t===t);
  if(best==="hybrid"||best==="rhybrid"){
    let mains, crosses;
    if(best==="hybrid"){
      mains=pool("poly").map(s=>({s,sc:polyScore(s,{...ctx,control:true},"control")+gaugeBonus(s,gM)}));
      crosses=pool("multi").map(s=>({s,sc:softScore(s,{...ctx,comfort:true})+gaugeBonus(s,gC)}));
    } else {
      const soft=ctx.cap>=40?pool("gut").concat(pool("multi")):pool("multi");
      mains=soft.map(s=>({s,sc:softScore(s,{...ctx,comfort:true})+(s.t==="gut"?1.5:0)+gaugeBonus(s,gM)}));
      crosses=pool("poly").filter(s=>s.twu).map(s=>({s,sc:polyScore(s,{...ctx,comfort:false,control:false},"cross")+gaugeBonus(s,gC)}));
    }
    mains.sort((a,b)=>b.sc-a.sc); crosses.sort((a,b)=>b.sc-a.sc);
    const combos=[], seen=new Set();
    const push=(m,c,force)=>{const key=m.s.n+"|"+c.s.n, cost=(m.s.p+c.s.p)/2;
      if(seen.has(key)||(!force&&cost>ctx.cap)) return; seen.add(key); combos.push({m:m.s,c:c.s,cost,sc:m.sc+c.sc});};
    // abbinamenti "in diagonale": i migliori di ogni lista tra loro, per avere varietà
    for(let i=0;i<Math.max(mains.length,crosses.length)&&combos.length<6;i++) push(mains[i%mains.length],crosses[i%crosses.length]);
    const all=[]; mains.slice(0,8).forEach(m=>crosses.slice(0,8).forEach(c=>all.push([m,c])));
    all.sort((a,b)=>(b[0].sc+b[1].sc)-(a[0].sc+a[1].sc)).forEach(([m,c])=>{if(combos.length<10) push(m,c);});
    let overBudget=false;
    if(!combos.length){overBudget=true;
      all.sort((a,b)=>(a[0].s.p+a[1].s.p)-(b[0].s.p+b[1].s.p)).slice(0,6).forEach(([m,c])=>push(m,c,true));}
    return {kind:"hybrid",items:combos,overBudget};
  }
  const t=best==="shaped"?"poly":best;
  const focus=best==="shaped"?"spin":"control";
  let base=pool(t);
  if(focus==="spin"){ // per il poliestere da spin: solo corde con potenziale di spin misurato almeno medio
    const hi=base.filter(s=>s.twu&&s.twu.sp>=6), mid=base.filter(s=>s.twu&&s.twu.sp>=5.5);
    base=hi.filter(s=>s.p<=ctx.cap).length>=4?hi:mid.filter(s=>s.p<=ctx.cap).length>=3?mid:base;
  }
  const items=base.map(s=>({s,sc:(t==="poly"?polyScore(s,ctx,focus):softScore(s,ctx))+gaugeBonus(s,gM)}));
  const capped=items.filter(x=>x.s.p<=ctx.cap);
  const overBudget=!capped.length;
  const scored=(capped.length?capped:items).sort((a,b)=>b.sc-a.sc);
  return {kind:"single",items:pickDiverse(scored,6,2),overBudget};
}
const gaugeLabel=(s,target)=>{
  if(!s.g.length) return s.gl?`Calibro ${s.gl}`:"Calibro: verifica in negozio";
  const c=closestG(s.g,target);
  return Math.abs(c-target)<0.005?`Calibro ${fmt(c)} mm`:`Calibro più vicino: ${fmt(c)} mm (consigliato ${fmt(target)})`;
};
function twuTags(s){
  const T=s.twu; if(!T) return {tags:[],line:"Nessuna misura TWU disponibile per questo modello."};
  const tags=[T.s<=195?"Morbida":T.s<=220?"Rigidità media":"Rigida",
    T.l<=28?"Tiene bene la tensione":T.l<=38?"Tenuta media":"Perde più tensione"];
  if(T.sp!=null) tags.push(T.sp>=7?"Spin alto":T.sp>=5.5?"Spin medio":"Spin basso");
  return {tags,line:`Misure TWU a circa 23 kg, calibro ${fmt(T.g)}: rigidità ${Math.round(T.s)} lb/in · perdita di tensione ${num1(T.l)}%${T.sp!=null?` · spin ${num1(T.sp)}`:""}`};
}
function softTags(s){
  const tags=[s.p>=18?"Fascia alta":s.p>=11?"Fascia media":"Economica"];
  if(s.g.length&&Math.max(...s.g)>=1.32) tags.push("Calibro spesso, dura di più");
  return tags;
}

/* ---------- Calcolo ---------- */
function calcolaGrezzo(ans, sessionFb){
  const A = id => (mostrata(id, ans) ? ans[id] : undefined);
  function racketInfo(){
    const id = A("racket");
    if(id && id!=="altro"){
      const r = RACKETS.find(x=>x.id===id);
      if(r) return {known:true,name:`${r.b} ${r.n}`,cm:r.cm,p:r.p,ra:r.ra,range:r.r,src:r.src};
    }
    const h=A("head"), p=A("pattern");
    return {known:false,name:null,cm:h&&h!=="nd"?HEADS[h]:null,p:p&&p!=="nd"?p:null,ra:null,range:null,src:null,stiffAns:A("stiff")};
  }
  function compute(){
    const info=racketInfo(), hc=headCatOf(info.cm), stc=stiffCatOf(info), pat=info.p||"nd";
    const pain=A("pain"), cur=A("current"), curT=A("curT"), prio=A("prio"), brk=A("brk"), age=A("age"), budget=A("budget");
    const sc=KEYS.map(()=>0);
    const add=arr=>{if(arr) arr.forEach((v,i)=>sc[i]+=v);};
    add(W.level[A("level")]); add(W.age[age]); add(W.freq[A("freq")]); add(W.style[A("style")]);
    add(W.swing[A("swing")]); add(W.spin[A("spin")]); add(W.brk[brk]); add(W.pain[pain]); add(W.prio[prio]);
    add(W.pattern[pat]); add(W.head[hc]); add(W.stiff[stc]); add(W.budget[budget]);
    if(pain!=="no"&&stc==="stiff") add([-2,-2,0,0,0,-1,0]);
    if(prio==="keep"&&cur&&cur!=="nd") add(INERTIA[cur]);
    if(sessionFb){
      if(sessionFb.fb==="dura") add([-1,-1,1,1,0,0,0]);
      if(sessionFb.fb==="morbida") add([1,0,-1,-1,0,0,0]);
      if(sessionFb.fb==="giusta"){const i=KEYS.indexOf(sessionFb.type); if(i>=0) sc[i]+=2;}
    }

    // vincoli
    const excl={};
    if(age==="u14") ["poly","shaped","hybrid","rhybrid"].forEach(k=>excl[k]="Sotto i 14 anni niente poliestere");
    if(pain==="yes") ["poly","shaped"].forEach(k=>excl[k]=excl[k]||"Con fastidi frequenti niente poliestere pieno");
    if(budget==="low"||budget==="mid") excl.gut="Il budello naturale costa da 39,90 € a set";
    const ranked=KEYS.map((k,i)=>({k,s:sc[i],out:excl[k]||null})).sort((a,b)=>((a.out?1:0)-(b.out?1:0))||(b.s-a.s));
    const ok=ranked.filter(x=>!x.out);
    const best=ok[0].k, second=ok[1]?ok[1].k:null;

    // calibro
    const G=[1.18,1.2,1.23,1.25,1.28,1.3,1.35];
    const snap=g=>G.reduce((a,b)=>Math.abs(b-g)<Math.abs(a-g)?b:a);
    const dense=DENSE_PATS.includes(pat), open=OPEN_PATS.includes(pat);
    const polyG=()=>{let g=1.25;if(brk==="weeks")g=1.30;else if(brk==="month")g=1.28;else if(prio==="comfort"||prio==="power")g=1.23;if(dense)g-=0.02;if(open)g+=0.03;return snap(Math.min(1.30,Math.max(1.20,g)));};
    const softG=()=>brk==="weeks"||brk==="month"?1.35:(brk==="never"&&(prio==="power"||prio==="comfort"))?1.25:1.30;
    let gM,gC;
    if(best==="poly"||best==="shaped"){gM=gC=polyG();}
    else if(best==="hybrid"){gM=polyG();gC=1.30;}
    else if(best==="rhybrid"){gM=softG();gC=1.25;}
    else {gM=gC=softG();}

    // tensione
    const BASE={poly:22,shaped:22,hybrid:23,rhybrid:24,multi:24.5,gut:25,syn:24};
    const sameFam=!!(cur&&cur!=="nd"&&(FAM[cur]||[]).includes(best));
    let t=BASE[best], fromCurrent=false;
    if(sameFam&&curT&&curT!=="nd"){
      t=CUR_C[curT]+({control:1,power:-1,comfort:-1}[prio]||0)+(pain==="yes"?-1:pain==="some"?-0.5:0);
      fromCurrent=true;
    } else {
      if(pain==="some")t-=1; if(pain==="yes")t-=2;
      if(prio==="control")t+=1; if(prio==="power")t-=1.5; if(prio==="comfort")t-=1;
      if(hc==="small")t-=1; if(hc==="large")t+=1; if(hc==="xl")t+=1.5;
      if(dense)t-=0.5; if(open)t+=0.5;
      if(A("level")==="beg")t-=0.5;
      if(age==="u14")t-=1; if(age==="o55")t-=0.5;
      if(pain!=="no"&&stc==="stiff")t-=0.5;
    }
    const fbAdj=sessionFb?({dura:-1,morbida:1}[sessionFb.fb]||0):0;
    t=half(Math.min(28,Math.max(18,t+fbAdj)));
    let lo=t-1, hi=t+1, clamped=null;
    if(info.range){
      const [a,b]=info.range;
      if(t+1>b){t=b-1;clamped="down";}
      if(t-1<a){ if(a-(t-1)<=1){t=a+1;clamped="up";} else clamped="below"; }
      if(clamped!=="below"){t=Math.min(b,Math.max(a,t)); lo=Math.max(a,t-1); hi=Math.min(b,t+1);}
      else {lo=t-1; hi=t+1;}
    }
    const clampR=v=>info.range?Math.min(info.range[1],Math.max(info.range[0],v)):v;
    const rng=(a,b)=>a===b?`${kg(a)} kg`:`${kg(a)}–${kg(b)} kg`;
    let lines, lineNote;
    if(best==="hybrid"){
      lines=[["Verticali",`Poliestere ${fmt(gM)} mm`,rng(lo,hi)],["Orizzontali",`Multifilamento ${fmt(gC)} mm`,rng(clampR(lo+1),clampR(hi+1))]];
      lineNote="Orizzontali circa 1 kg più alte: la corda morbida tiene meglio una tensione un po' superiore. È una convenzione comune, l'incordatore può adattarla.";
    } else if(best==="rhybrid"){
      lines=[["Verticali",`Budello o multifilamento ${fmt(gM)} mm`,rng(lo,hi)],["Orizzontali",`Poliestere scivoloso ${fmt(gC)} mm`,rng(clampR(lo-1),clampR(hi-1))]];
      lineNote="Orizzontali circa 1 kg più basse, come si fa di solito con il poliestere in un ibrido. L'incordatore può adattarla.";
    } else {
      lines=[["Verticali e orizzontali",`${TYPES[best].s} ${fmt(gM)} mm`,rng(lo,hi)]];
      lineNote="Stessa tensione nelle due direzioni, oppure 0,5–1 kg in meno sulle orizzontali se l'incordatore lo preferisce.";
    }
    const gaugeTxt=gM===gC?fmt(gM):`${fmt(gM)} / ${fmt(gC)}`;
    const gaugeSub=gM===gC?"millimetri":"verticali / orizzontali, mm";

    // modelli di corda
    const ctx={cap:CAP[budget]??Infinity,spinWanted:A("spin")==="high"||prio==="spin",
      comfort:prio==="comfort"||pain==="some"||age==="o55"||age==="teen",
      control:prio==="control"||A("swing")==="long"||A("style")==="atk",
      durable:brk==="month"||brk==="weeks"||prio==="dur"};
    const models=pickModels(best,gM,gC,ctx);

    // affidabilità
    let unk=0;
    if(!info.known){ if(!info.cm)unk++; if(!info.p)unk++; if(stc==="nd")unk++; } else if(!info.range) unk++;
    if(!cur||cur==="nd") unk++; else if(!curT||curT==="nd") unk++;
    if(brk==="nd") unk++;
    const conf=unk<=1?"alta":unk<=3?"media":"bassa";
    const confTxt={alta:"Le risposte coprono i dati principali: è un buon punto di partenza.",
      media:"Alcune risposte erano «Non lo so»: fai verificare il consiglio dall'incordatore.",
      bassa:"Mancano diversi dati: usa il consiglio come orientamento e controlla la scheda della tua racchetta."}[conf];

    // confronto con la corda attuale
    let compare=null;
    if(cur&&cur!=="nd"){
      let tline=null;
      if(curT&&curT!=="nd"){const d=half(t-CUR_C[curT]); tline=d===0?"Stessa tensione di adesso":`Circa ${kg(Math.abs(d))} kg ${d>0?"in più":"in meno"} di adesso`;}
      compare={now:`${CURN[cur].charAt(0).toUpperCase()+CURN[cur].slice(1)}${curT&&curT!=="nd"?`, ${CURT_L[curT]}`:""}`,
        change:sameFam?`Resti su ${TYPES[best].s.toLowerCase()}`:`Passi a ${TYPES[best].s.toLowerCase()}`, tline};
    }

    // motivazioni
    const why=[];
    const L={beg:"sei agli inizi",int:"hai un livello intermedio",adv:"hai un livello avanzato",pro:"giochi a livello agonistico"};
    const F={f1:"una volta",f2:"due volte",f3:"3–4 volte",f5:"5 o più volte"};
    why.push(`Hai indicato che ${L[A("level")]} e giochi ${F[A("freq")]} a settimana.`);
    if(info.known) why.push(`La tua ${info.name} ha piatto da ${info.cm} cm², schema ${PAT[info.p]}${info.ra?` e rigidità RA ${info.ra}`:""}${info.range?`; il produttore indica ${info.range[0]}–${info.range[1]} kg`:""}.`);
    if(age==="u14") why.push("Sotto i 14 anni escludiamo il poliestere: servono corde elastiche che aiutino a spingere la palla, come indica Wilson.");
    if(age==="o55") why.push("Sopra i 55 anni conviene privilegiare il comfort, come indica Wilson.");
    if(pain==="yes") why.push("Con fastidi frequenti al braccio escludiamo il poliestere pieno e abbassiamo la tensione: con tensione più alta arrivano più sollecitazioni al gomito.");
    else if(pain==="some") why.push("I fastidi occasionali spingono verso una corda più morbida e una tensione un po' più bassa.");
    if(pain!=="no"&&stc==="stiff") why.push("Il telaio è rigido (RA 68 o più): con i fastidi al braccio conviene stare ancora più sul morbido.");
    if(A("spin")==="high"||prio==="spin") why.push("Cerchi rotazione: lo spin nasce soprattutto dallo snapback, cioè le corde verticali che scivolano di lato sulla palla e tornano in posizione. Contano corde che scorrono bene tra loro, non una superficie ruvida.");
    if(best==="hybrid") why.push("L'ibrido classico, con il poliestere in verticale, è pensato per durata e controllo. Per lo spin è meno adatto, perché le corde scorrono meno.");
    if(best==="rhybrid") why.push("Nell'ibrido invertito la corda morbida in verticale e il poliestere liscio in orizzontale scorrono bene tra loro: è la soluzione per unire rotazione e comfort.");
    if(brk==="weeks") why.push("Rompi le corde molto spesso: servono un materiale resistente e un calibro più spesso.");
    else if(brk==="month") why.push("Rompi le corde abbastanza spesso: meglio un calibro un po' più spesso della media.");
    if(A("swing")==="long") why.push("Uno swing lungo e veloce genera già molta potenza: una corda da controllo evita che la palla voli lunga.");
    if(A("swing")==="short") why.push("Uno swing compatto trae vantaggio da una corda elastica, che restituisce potenza con meno sforzo.");
    if(prio==="control") why.push("Cerchi controllo: la tensione sale di circa 1 kg. Con tensione più alta gli errori finiscono più spesso in rete che lunghi (Bower e Cross, 2005).");
    if(prio==="power") why.push("Cerchi potenza: la tensione scende. L'effetto esiste ma è piccolo: in uno studio circa 10 kg in meno davano circa 3 km/h in più alla palla (Bower e Cross, 2005).");
    if(prio==="keep"&&cur&&cur!=="nd") why.push("Ti trovi bene con la corda attuale: il consiglio resta il più vicino possibile alla tua impostazione.");
    if(!info.known&&(hc==="large"||hc==="xl")) why.push("Un piatto grande ha corde più lunghe ed elastiche: si compensa con una tensione un po' più alta.");
    if(!info.known&&hc==="small") why.push("Un piatto piccolo è già più rigido e controllato: si compensa con una tensione un po' più bassa.");
    if(dense) why.push("Uno schema fitto è più rigido: calibro un po' più sottile e tensione leggermente più bassa.");
    if(open) why.push("Uno schema aperto dà più spin ma consuma prima le corde: calibro un po' più spesso.");
    if(budget==="low"||budget==="mid") why.push("Con il budget scelto escludiamo il budello naturale, che costa da 39,90 € a set.");
    if(fromCurrent) why.push("Resti sullo stesso tipo di corda: partiamo dalla tua tensione attuale e la spostiamo nella direzione che cerchi.");
    if(fbAdj) why.push(fbAdj<0?"La volta scorsa la corda era troppo dura: abbiamo tolto circa 1 kg.":"La volta scorsa la corda era troppo morbida: abbiamo aggiunto circa 1 kg.");
    if(sessionFb&&sessionFb.fb==="giusta") why.push("La volta scorsa ti sei trovato bene: il consiglio resta vicino al precedente.");
    if(clamped==="down") why.push(`Abbiamo abbassato la tensione per non superare il massimo indicato dal produttore della tua racchetta (${info.range[1]} kg).`);
    if(clamped==="up") why.push(`Abbiamo alzato leggermente la tensione per restare nel range del produttore (${info.range[0]}–${info.range[1]} kg).`);
    if(clamped==="below") why.push(`La tensione consigliata è sotto il range del produttore (${info.range[0]}–${info.range[1]} kg). ${["poly","shaped","hybrid","rhybrid"].includes(best)?"Con il poliestere è comune incordare più basso del range: ":""}parlane con l'incordatore prima di montarla.`);
    why.push("Ti diamo un range e non un numero secco: anche i giocatori d'élite faticano a sentire differenze di 2–3 kg (Bower e Cross, 2008). Conta di più tenerla costante.");

    // cambio corde
    const sess={f1:1,f2:2,f3:3.5,f5:5}[A("freq")]||2;
    const polyish=["poly","shaped","hybrid","rhybrid"].includes(best);
    let weeks, freqTxt;
    if(polyish){weeks=Math.max(1,Math.round(17.5/(sess*1.5)));
      freqTxt=`Il poliestere va cambiato ogni 15–20 ore di gioco anche se non si rompe: con il tuo ritmo circa ogni ${weeks} ${weeks===1?"settimana":"settimane"}.`;}
    else {weeks=Math.min(52,Math.max(4,Math.round(52/sess)));
      freqTxt=`Regola pratica: tanti cambi all'anno quante volte giochi a settimana. Con il tuo ritmo circa ogni ${weeks} settimane, o prima se si rompono.`;}
    const next=new Date(); next.setDate(next.getDate()+weeks*7);
    const nextTxt=next.toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"});

    // consigli stagionali
    const seasonTip={summer:"Giochi soprattutto d'estate all'aperto: il caldo ammorbidisce le corde. Se incordi poco prima di un periodo caldo, resta nella parte alta del range.",
      winter:"Giochi soprattutto d'inverno all'aperto: il freddo irrigidisce le corde. Resta nella parte bassa del range.",
      year:"La stessa tensione si sente diversa tra estate e inverno: d'estate puoi salire di circa 1 kg, d'inverno scendere di circa 1 kg.",
      indoor:"Al coperto la temperatura è più stabile: la sensazione delle corde resta costante più a lungo."}[A("season")];

    // riepilogo per l'incordatore
    const racketLine=info.known?`${info.name} (${info.cm} cm², ${PAT[info.p]})`:`${info.cm?info.cm+" cm²":"piatto non indicato"}, schema ${info.p?PAT[info.p]:"non indicato"}`;
    const topModels=models.kind==="hybrid"
      ? models.items.slice(0,3).map(x=>`${x.m.b} ${x.m.n} + ${x.c.b} ${x.c.n}`)
      : models.items.slice(0,3).map(s=>`${s.b} ${s.n}`);
    const summary=[
      "SCHEDA INCORDATURA · TEORIA DELLE CORDE",
      `Racchetta: ${racketLine}`,
      `Corda: ${TYPES[best].n}`,
      ...lines.map(l=>`${l[0]}: ${l[1]}, ${l[2]}`),
      `Punto di partenza: ${kg(t)} kg`,
      `Modelli da valutare: ${topModels.join("; ")}`,
      compare?`Corda attuale: ${compare.now}`:null,
      `Gioco: ${SURF_L[A("surface")]}, ${SEASON_L[A("season")]}`,
      `Prossimo cambio: ${nextTxt} (circa)`,
      "Nota: consiglio teorico, non una ricetta. Da adattare dopo la prova in campo."
    ].filter(Boolean).join("\n");

    return {info,best,second,ranked,lines,lineNote,gaugeTxt,gaugeSub,gM,gC,t,lo,hi,clamped,conf,confTxt,compare,why,freqTxt,nextTxt,seasonTip,summary,pat,models,ctx};
  }
  return compute();
}

/* ---------- Risposta per la pagina ----------
   Solo ciò che serve a disegnare il risultato: niente pesi, punteggi grezzi o catalogo completo. */
const breve = g => g.replace("Calibro ","").replace("Calibro più vicino: ","più vicino ");
function perLaPagina(r){
  const T=TYPES[r.best], S2=r.second?TYPES[r.second]:null;
  const ok=r.ranked.filter(x=>!x.out).map(x=>x.s);
  const max=Math.max(...ok), min=Math.min(...ok);
  const pct=s=>Math.round(15+85*(s-min)/Math.max(1,max-min));
  const M=r.models;
  const items=M.kind==="hybrid"
    ? M.items.map(x=>({mb:x.m.b,mn:x.m.n,cb:x.c.b,cn:x.c.n,cost:x.cost,mg:breve(gaugeLabel(x.m,r.gM)),cg:breve(gaugeLabel(x.c,r.gC)),
        tags:x.c.twu?twuTags(x.c).tags:softTags(x.c)}))
    : M.items.map(s=>{const poly=s.t==="poly", tw=poly?twuTags(s):null;
        return {b:s.b,n:s.n,p:s.p,many:s.g.length>1,gauge:gaugeLabel(s,r.gM),tags:poly?tw.tags:softTags(s),line:poly?tw.line:null,src:s.src};});
  return {
    best:r.best, type:{n:T.n,d:T.d,mode:T.mode}, second:S2?{n:S2.n,alt:S2.alt}:null,
    bars:r.ranked.map((x,i)=>x.out?{label:TYPES[x.k].s,out:x.out}:{label:TYPES[x.k].s,pct:pct(x.s),top:i===0}),
    info:{known:r.info.known,name:r.info.name,cm:r.info.cm,p:r.info.p,range:r.info.range,src:r.info.src},
    conf:r.conf, confTxt:r.confTxt, t:r.t, lo:r.lo, hi:r.hi, gaugeTxt:r.gaugeTxt, gaugeSub:r.gaugeSub, pat:r.pat,
    lines:r.lines, lineNote:r.lineNote, models:{kind:M.kind,overBudget:M.overBudget,items},
    compare:r.compare, why:r.why, freqTxt:r.freqTxt, nextTxt:r.nextTxt, seasonTip:r.seasonTip||null, summary:r.summary
  };
}

/* ---------- Lettura della richiesta ---------- */
function nonValida(msg){ const e=new Error(msg); e.richiesta=true; return e; }
function leggiRichiesta(body){
  if(!body||typeof body!=="object") throw nonValida("Richiesta vuota");
  const r=body.risposte;
  if(!r||typeof r!=="object") throw nonValida("Mancano le risposte");
  const ans={};
  if(r.racket==="altro"||RACKETS.some(x=>x.id===r.racket)) ans.racket=r.racket;
  else throw nonValida("Racchetta non riconosciuta");
  for(const id of Object.keys(VALORI)){
    const v=r[id];
    if(v===undefined||v===null) continue;
    if(typeof v!=="string"||!VALORI[id].includes(v)) throw nonValida(`Risposta non valida: ${id}`);
    ans[id]=v;
  }
  ans.pain=BRACCIO[body.braccio];
  if(!ans.pain) throw nonValida("Manca il livello di protezione del braccio");
  for(const id of OBBLIGATORIE) if(!ans[id]) throw nonValida(`Manca la risposta: ${id}`);
  for(const id of Object.keys(ans)) if(!mostrata(id,ans)) delete ans[id];
  let fb=null;
  const u=body.ultimo;
  if(u&&typeof u==="object"&&ESITI.includes(u.esito)&&KEYS.includes(u.tipo)) fb={fb:u.esito,type:u.tipo};
  return {ans,fb};
}

function consiglio(body){
  const {ans,fb}=leggiRichiesta(body);
  return perLaPagina(calcolaGrezzo(ans,fb));
}

/* Prova di funzionamento con risposte fisse (nessun dato personale) */
function prova(){
  const r=consiglio({risposte:{level:"int",age:"adult",freq:"f2",racket:"pure-aero-26",current:"poly",curT:"t24",style:"base",
    swing:"mid",spin:"high",brk:"months",prio:"spin",surface:"clay",season:"year",budget:"mid"},braccio:"nessuna",ultimo:null});
  return {corda:r.type.n, tensione:`${kg(r.lo)}–${kg(r.hi)} kg`, modelli:r.models.items.length};
}

/* Per la build: elenco ridotto delle racchette (senza range e schede) e conteggi per la pagina */
const RACCHETTE_PUBBLICHE = RACKETS.map(({id,b,n,cm,p,ra})=>({id,b,n,cm,p,ra}));
const CONTEGGI = {corde:STRINGS.length, marche:BRANDS.length, racchette:RACKETS.length};

module.exports = {consiglio, prova, calcolaGrezzo, leggiRichiesta, RACCHETTE_PUBBLICHE, CONTEGGI};
