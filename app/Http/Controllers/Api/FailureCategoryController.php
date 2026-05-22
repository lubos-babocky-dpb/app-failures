<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class FailureCategoryController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $categories = [
            [
                "id" => "01",
                "name" => "Karoséria a interiér",
                "vehicleTypes" => ["A", "E", "T"],
                "subcategories" => [
                    [
                        "id" => "01_kabina",
                        "name" => "Kabína vodiča",
                        "failures" => [
                            [ "code" => "011001", "name" => "Dvere kabíny" ],
                            [ "code" => "011002", "name" => "Sedadlo vodiča" ],
                            [ "code" => "011003", "name" => "Slnečná roleta" ],
                            [ "code" => "011004", "name" => "Zámok dverí kabíny" ],
                            [ "code" => "011005", "name" => "Netesnosť okna" ]
                        ]
                    ],
                    [
                        "id" => "01_okna",
                        "name" => "Okná a zasklenie",
                        "failures" => [
                            [ "code" => "012001", "name" => "Prasknuté čelné sklo" ],
                            [ "code" => "012002", "name" => "Rozbité bočné sklo" ],
                            [ "code" => "012003", "name" => "Poškodené zadné sklo" ],
                            [ "code" => "012004", "name" => "Vypadnuté tesnenie okna" ],
                            [ "code" => "012005", "name" => "Zaseknuté posuvné okno" ]
                        ]
                    ],
                    [
                        "id" => "01_interier",
                        "name" => "Interiér pre cestujúcich",
                        "failures" => [
                            [ "code" => "013001", "name" => "Poškodené sedadlo" ],
                            [ "code" => "013002", "name" => "Utrhnuté madlo / tyč" ],
                            [ "code" => "013003", "name" => "Poškodená podlahová krytina" ],
                            [ "code" => "013004", "name" => "Odtrhnutý stropný panel" ],
                            [ "code" => "013005", "name" => "Znečistený interiér (zvratky/krv)" ]
                        ]
                    ],
                    [
                        "id" => "01_exterier",
                        "name" => "Exteriér a opláštenie",
                        "failures" => [
                            [ "code" => "014001", "name" => "Poškodený predný nárazník" ],
                            [ "code" => "014002", "name" => "Poškodený zadný nárazník" ],
                            [ "code" => "014003", "name" => "Odtrhnutý bočný kryt" ],
                            [ "code" => "014004", "name" => "Poškodený lak / škrabanec" ],
                            [ "code" => "014005", "name" => "Chýbajúce logo / označenie" ]
                        ]
                    ],
                    [
                        "id" => "01_klb",
                        "name" => "Kĺbové spojenie",
                        "failures" => [
                            [ "code" => "015001", "name" => "Roztrhnutý mech kĺbu" ],
                            [ "code" => "015002", "name" => "Vŕzganie v kĺbe" ],
                            [ "code" => "015003", "name" => "Poškodená točňa" ],
                            [ "code" => "015004", "name" => "Netesnosť v kĺbe (zateká)" ],
                            [ "code" => "015005", "name" => "Blokovanie natáčania kĺbu" ]
                        ]
                    ]
                ]
            ],
            [
                "id" => "06",
                "name" => "Spaľovací motor a palivová sústava",
                "vehicleTypes" => ["A"],
                "subcategories" => [
                    [
                        "id" => "06_chod",
                        "name" => "Chod motora",
                        "failures" => [
                            [ "code" => "061001", "name" => "Motor nemá výkon" ],
                            [ "code" => "061002", "name" => "Motor zhasína" ],
                            [ "code" => "061003", "name" => "Nepravidelný chod" ],
                            [ "code" => "061004", "name" => "Klepavý zvuk z motora" ],
                            [ "code" => "061005", "name" => "Strieľa do výfuku" ]
                        ]
                    ],
                    [
                        "id" => "06_olej",
                        "name" => "Olejový systém",
                        "failures" => [
                            [ "code" => "062001", "name" => "Nízky tlak oleja" ],
                            [ "code" => "062002", "name" => "Únik oleja z motora" ],
                            [ "code" => "062003", "name" => "Olej vo vode" ],
                            [ "code" => "062004", "name" => "Porucha olejového čerpadla" ],
                            [ "code" => "062005", "name" => "Vysoká spotreba oleja" ]
                        ]
                    ],
                    [
                        "id" => "06_palivo",
                        "name" => "Palivová sústava",
                        "failures" => [
                            [ "code" => "063001", "name" => "Únik paliva (nafta/plyn)" ],
                            [ "code" => "063002", "name" => "Zavzdušnený systém" ],
                            [ "code" => "063003", "name" => "Porucha palivového čerpadla" ],
                            [ "code" => "063004", "name" => "Deravá nádrž" ],
                            [ "code" => "063005", "name" => "Zanesený palivový filter" ]
                        ]
                    ],
                    [
                        "id" => "06_chladenie",
                        "name" => "Chladiaci systém",
                        "failures" => [
                            [ "code" => "064001", "name" => "Motor sa prehrieva" ],
                            [ "code" => "064002", "name" => "Únik chladiacej kvapaliny" ],
                            [ "code" => "064003", "name" => "Porucha vodnej pumpy" ],
                            [ "code" => "064004", "name" => "Chybný termostat" ],
                            [ "code" => "064005", "name" => "Prasknutý chladič" ]
                        ]
                    ],
                    [
                        "id" => "06_vyfuk",
                        "name" => "Výfukový systém a emisie",
                        "failures" => [
                            [ "code" => "065001", "name" => "Hlučný výfuk" ],
                            [ "code" => "065002", "name" => "Odtrhnutý tlmič výfuku" ],
                            [ "code" => "065003", "name" => "Porucha DPF filtra" ],
                            [ "code" => "065004", "name" => "Porucha systému AdBlue" ],
                            [ "code" => "065005", "name" => "Vysoká dymivosť" ]
                        ]
                    ]
                ]
            ],
            [
                "id" => "09",
                "name" => "Brzdový systém",
                "vehicleTypes" => ["A", "E", "T"],
                "subcategories" => [
                    [
                        "id" => "09_mechanika",
                        "name" => "Mechanika bŕzd",
                        "failures" => [
                            [ "code" => "091001", "name" => "Opotrebované brzdové obloženie" ],
                            [ "code" => "091002", "name" => "Poškodený brzdový kotúč" ],
                            [ "code" => "091003", "name" => "Prasknutý brzdový bubon" ],
                            [ "code" => "091004", "name" => "Zaseknutý brzdový strmeň" ],
                            [ "code" => "091005", "name" => "Prehriate brzdy" ]
                        ]
                    ],
                    [
                        "id" => "09_vzduch",
                        "name" => "Vzduchový systém bŕzd",
                        "failures" => [
                            [ "code" => "092001", "name" => "Únik vzduchu z bŕzd" ],
                            [ "code" => "092002", "name" => "Porucha hlavného brzdiča" ],
                            [ "code" => "092003", "name" => "Nízky tlak vzduchu v systéme" ],
                            [ "code" => "092004", "name" => "Zavzdušnené brzdy" ],
                            [ "code" => "092005", "name" => "Porucha kompresora" ]
                        ]
                    ],
                    [
                        "id" => "09_elektronika",
                        "name" => "Elektronika bŕzd (ABS/ASR)",
                        "failures" => [
                            [ "code" => "093001", "name" => "Svieti kontrolka ABS" ],
                            [ "code" => "093002", "name" => "Svieti kontrolka ASR" ],
                            [ "code" => "093003", "name" => "Porucha snímača ABS" ],
                            [ "code" => "093004", "name" => "Nefunkčný ventil ABS" ],
                            [ "code" => "093005", "name" => "Porucha riadiacej jednotky bŕzd" ]
                        ]
                    ],
                    [
                        "id" => "09_zastavkova",
                        "name" => "Zastávková a ručná brzda",
                        "failures" => [
                            [ "code" => "094001", "name" => "Nefunkčná zastávková brzda" ],
                            [ "code" => "094002", "name" => "Nefunkčná ručná brzda" ],
                            [ "code" => "094003", "name" => "Brzda sa neodbrzďuje" ],
                            [ "code" => "094004", "name" => "Únik vzduchu z ručnej brzdy" ],
                            [ "code" => "094005", "name" => "Vypínač zastávkovej brzdy nereaguje" ]
                        ]
                    ],
                    [
                        "id" => "09_kolejove",
                        "name" => "Koľajnicové brzdy",
                        "failures" => [
                            [ "code" => "095001", "name" => "Nefunkčná koľajnicová brzda" ],
                            [ "code" => "095002", "name" => "Koľajnicová brzda nezdvíha" ],
                            [ "code" => "095003", "name" => "Opotrebovaný trámec" ],
                            [ "code" => "095004", "name" => "Skrat na cievke brzdy" ],
                            [ "code" => "095005", "name" => "Mechanické poškodenie zavesenia" ]
                        ]
                    ]
                ]
            ],
            [
                "id" => "16",
                "name" => "Elektrická sústava a osvetlenie",
                "vehicleTypes" => ["A", "E", "T"],
                "subcategories" => [
                    [
                        "id" => "16_baterie",
                        "name" => "Batérie a dobíjanie",
                        "failures" => [
                            [ "code" => "161001", "name" => "Slabé batérie" ],
                            [ "code" => "161002", "name" => "Vozidlo nedobíja" ],
                            [ "code" => "161003", "name" => "Porucha alternátora" ],
                            [ "code" => "161004", "name" => "Poškodené kontakty batérie" ],
                            [ "code" => "161005", "name" => "Zničený odpojovač batérií" ]
                        ]
                    ],
                    [
                        "id" => "16_exterosvetlenie",
                        "name" => "Vonkajšie osvetlenie",
                        "failures" => [
                            [ "code" => "162001", "name" => "Nesvieti predný svetlomet" ],
                            [ "code" => "162002", "name" => "Nesvieti brzdové svetlo" ],
                            [ "code" => "162003", "name" => "Nefunguje smerovka" ],
                            [ "code" => "162004", "name" => "Nesvieti obrysové svetlo" ],
                            [ "code" => "162005", "name" => "Rozbitý kryt svetlometu" ]
                        ]
                    ],
                    [
                        "id" => "16_interosvetlenie",
                        "name" => "Vnútorné osvetlenie",
                        "failures" => [
                            [ "code" => "163001", "name" => "Nesvieti osvetlenie priestoru cestujúcich" ],
                            [ "code" => "163002", "name" => "Nesvieti osvetlenie kabíny" ],
                            [ "code" => "163003", "name" => "Nefunkčné osvetlenie dverí" ],
                            [ "code" => "163004", "name" => "Blikajú neóny v interiéri" ],
                            [ "code" => "163005", "name" => "Zhorený menič neónov" ]
                        ]
                    ],
                    [
                        "id" => "16_palubka",
                        "name" => "Prístrojová doska a ovládače",
                        "failures" => [
                            [ "code" => "164001", "name" => "Nefunkčný tachometer" ],
                            [ "code" => "164002", "name" => "Nesvieti podsvietenie budíkov" ],
                            [ "code" => "164003", "name" => "Pokazený prepínač stieračov" ],
                            [ "code" => "164004", "name" => "Nefunkčné ovládanie dverí" ],
                            [ "code" => "164005", "name" => "Chybný ukazovateľ stavu paliva/vzduchu" ]
                        ]
                    ],
                    [
                        "id" => "16_info",
                        "name" => "Informačný a tarifný systém",
                        "failures" => [
                            [ "code" => "165001", "name" => "Nefunkčný palubný počítač" ],
                            [ "code" => "165002", "name" => "Nefunguje vonkajšia tabuľa" ],
                            [ "code" => "165003", "name" => "Nefunguje vnútorný displej" ],
                            [ "code" => "165004", "name" => "Pokazený označovač lístkov (OCL)" ],
                            [ "code" => "165005", "name" => "Hlasič zastávok nevydáva zvuk" ]
                        ]
                    ]
                ]
            ],
            [
                "id" => "04",
                "name" => "Dvere a mechanizmy",
                "vehicleTypes" => ["A", "E", "T"],
                "subcategories" => [
                    [
                        "id" => "04_pohon",
                        "name" => "Pohon dverí",
                        "failures" => [
                            [ "code" => "041001", "name" => "Dvere sa neotvárajú" ],
                            [ "code" => "041002", "name" => "Dvere sa nezatvárajú" ],
                            [ "code" => "041003", "name" => "Pomalý chod dverí" ],
                            [ "code" => "041004", "name" => "Dvere búchajú pri zatváraní" ],
                            [ "code" => "041005", "name" => "Únik vzduchu z valca dverí" ]
                        ]
                    ],
                    [
                        "id" => "04_elektronika",
                        "name" => "Elektronika a snímače dverí",
                        "failures" => [
                            [ "code" => "042001", "name" => "Porucha dopytového tlačidla zvonku" ],
                            [ "code" => "042002", "name" => "Porucha dopytového tlačidla zvnútra" ],
                            [ "code" => "042003", "name" => "Nefunkčná fotobunka dverí" ],
                            [ "code" => "042004", "name" => "Svieti signalizácia otvorených dverí" ],
                            [ "code" => "042005", "name" => "Reverzáca dverí nefunguje" ]
                        ]
                    ],
                    [
                        "id" => "04_mechanika",
                        "name" => "Mechanické poškodenie",
                        "failures" => [
                            [ "code" => "043001", "name" => "Vypadnuté dvere z pántov" ],
                            [ "code" => "043002", "name" => "Zničené tesnenie dverí" ],
                            [ "code" => "043003", "name" => "Ohnuté krídlo dverí" ],
                            [ "code" => "043004", "name" => "Zaseknutý mechanizmus núdzového otvárania" ],
                            [ "code" => "043005", "name" => "Uvoľnené tiahlo dverí" ]
                        ]
                    ],
                    [
                        "id" => "04_plosina",
                        "name" => "Plošina pre invalidov",
                        "failures" => [
                            [ "code" => "044001", "name" => "Plošina sa nedá vyklopiť" ],
                            [ "code" => "044002", "name" => "Plošina sa nedá zaklopiť" ],
                            [ "code" => "044003", "name" => "Odlomené madlo plošiny" ],
                            [ "code" => "044004", "name" => "Porucha snímača plošiny" ],
                            [ "code" => "044005", "name" => "Chýbajúci hák na plošinu" ]
                        ]
                    ],
                    [
                        "id" => "04_zvoncek",
                        "name" => "Signalizácia dverí",
                        "failures" => [
                            [ "code" => "045001", "name" => "Nefunkčný zvonček výstrahy" ],
                            [ "code" => "045002", "name" => "Nefunkčná svetelná výstraha" ],
                            [ "code" => "045003", "name" => "Signalizácia STOP nereaguje" ],
                            [ "code" => "045004", "name" => "Signalizácia INVALID nereaguje" ],
                            [ "code" => "045005", "name" => "Falošná signalizácia znamenia" ]
                        ]
                    ]
                ]
            ],
            [
                "id" => "30",
                "name" => "Trakčný systém a zberače",
                "vehicleTypes" => ["E", "T"],
                "subcategories" => [
                    [
                        "id" => "30_zberac",
                        "name" => "Zberač prúdu / Palice",
                        "failures" => [
                            [ "code" => "301001", "name" => "Opotrebovaná uhlíková lišta (pantograf)" ],
                            [ "code" => "301002", "name" => "Zlomená palica" ],
                            [ "code" => "301003", "name" => "Poškodená botka zberača" ],
                            [ "code" => "301004", "name" => "Zberač sa nedá stiahnuť" ],
                            [ "code" => "301005", "name" => "Utrhnuté sťahovacie lano" ]
                        ]
                    ],
                    [
                        "id" => "30_motor",
                        "name" => "Trakčný motor",
                        "failures" => [
                            [ "code" => "302001", "name" => "Motor nemá ťah" ],
                            [ "code" => "302002", "name" => "Prehrievanie trakčného motora" ],
                            [ "code" => "302003", "name" => "Zvýšená hlučnosť / vibrácie motora" ],
                            [ "code" => "302004", "name" => "Zkrat na trakčnom motore" ],
                            [ "code" => "302005", "name" => "Poškodené chladenie motora" ]
                        ]
                    ],
                    [
                        "id" => "30_menice",
                        "name" => "Meniče a výzbroj",
                        "failures" => [
                            [ "code" => "303001", "name" => "Porucha statického meniča" ],
                            [ "code" => "303002", "name" => "Porucha trakčného meniča" ],
                            [ "code" => "303003", "name" => "Svieti porucha izolácie" ],
                            [ "code" => "303004", "name" => "Zhorená poistka trakčného obvodu" ],
                            [ "code" => "303005", "name" => "Výpadok vysokého napätia" ]
                        ]
                    ],
                    [
                        "id" => "30_stykace",
                        "name" => "Stýkače a relé",
                        "failures" => [
                            [ "code" => "304001", "name" => "Prilepený linkový stýkač" ],
                            [ "code" => "304002", "name" => "Nefunkčné relé" ],
                            [ "code" => "304003", "name" => "Opaľovanie kontaktov" ],
                            [ "code" => "304004", "name" => "Porucha brzdového stýkača" ],
                            [ "code" => "304005", "name" => "Skrat v rozvádzači" ]
                        ]
                    ],
                    [
                        "id" => "30_ovladanie",
                        "name" => "Ovládanie jazdy",
                        "failures" => [
                            [ "code" => "305001", "name" => "Porucha jazdného pedálu" ],
                            [ "code" => "305002", "name" => "Porucha zadnej riadiacej plošiny" ],
                            [ "code" => "305003", "name" => "Trhanie pri rozjazde" ],
                            [ "code" => "305004", "name" => "Vozidlo nereaguje na jazdu" ],
                            [ "code" => "305005", "name" => "Porucha rekuperácie" ]
                        ]
                    ]
                ]
            ]
        ];

        return response()->json($categories);
    }
}