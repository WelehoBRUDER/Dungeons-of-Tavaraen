"use strict";
const dialogLang = {
    finnish: {
        masculine_heShe: "Hän",
        feminine_heShe: "Hän",
        neutral_heShe: "Hän",
        masculine_hisHer: "Hänen",
        feminine_hisHer: "Hänen",
        neutral_hisHer: "Hänen",
        leaveDialog: "Näkemisiin!",
        generic_hail_friend: `<css>font-style: italic;<css><c>silver<c>"Tervehdys kamu! On hyvä nähdä etteivät kaikki ole menettäneet järkeään. \nJos olet kiinnostunut tarjoamastani asioista, niin totta ihmeessä mainitse siitä!"\n\n§/heShe/ huokaisee ja nojaa taaksepäin.`,
        testMerchant_store: "Näytä tuotteesi",
        testMerchant_business: "Kuinka hyvin kauppa käy?",
        testMerchant_defeated_the_slimes: "Päihitin ryöväri limat",
        testMerchant_business_dialog_1: `Karl hengittää syvään ja katsoo sinua epävarmasti. \n\n§<css>font-style: italic;<css><c>silver<c>"Jos olisit kysynyt pari päivää sitten, olisin sanonut 'ihan hyvin', mutta tilanne on toinen nyt."\n\n§Hän katselee ympärilleen, etsien jotain.\nHetken kuluttua hän rauhottuu ja jatkaa tarinansa kertomista.\n\n§<css>font-style: italic;<css><c>silver<c>"Tämä on noloa myöntää, mutta kun tarvitsen apuasi niin en voi sitä piilotella. Kaksi päivää sitten tuotteeni ryöstettiin nenäni edestä. Nämä rosvot olivat...limoja."\n"Voin jo aavistaa mitä ajattelet; 'Millä ilveellä limat RYÖSTÄVÄT aikuiselta?' Se on hyvä kysymys johon aion kyllä vastata.\nMutta kerron lisää vain jos suostut auttamaan, en kuitenkaa halua nolata itseäni turhaan. Jos onnistut löytämään tuotteeni ja tuomaan ne takaisin, saat minulta loistavan palkkion!"\n\n§Hän odottaa vastaustasi ahdistuneella ilmeellä. Koet että hänen 'tuotteensa' saatta olla jotain salattavaa, mutta ilman lisätietoja salaisuus jää selvittämättä.`,
        accept_slime_quest: `Karl piristyy hetkellisesti, mutta päätyy takaisin hänen ahdistuneeseen ilmeeseensä. \n\n§<css>font-style: italic;<css><c>silver<c>"Kiitos, luotan lupaukseesi. Haluat varmaan kuulla koko tarinan. No tässä se on:\nKaksi päivää sitten olin käymässä tuotteitani läpi, kun yhtäkkiä kolme limaa pomppasi metsästä, saartaen minut. Yritin taistella vastaan, mutta voimani eivät riittäneet alkuunkaan ja ne pedot kaatoivat minut maahan.\nOlin niin peloissani että lähes kusin housuihini." \n\n§Näet hänen kasvoiltaan että hän kusi housuihinsa. Arvioit että hän myös itki ja kiljui.\n\n§<css>font-style: italic;<css><c>silver<c>"Kun istuin siinä maassa, odottaen varmasti lähestyvää kuolemaa, ne limat yhtäkkiä kääntyivät pois minusta. Ne alkoivat viemään tuotteitani yksi kerrallaan.\nTuijotin niitä ainakin tunnin, kun ne veivät tuotteitani laatikko kerrallaan ties minne metsässä."\n\n§Karl näyttää oikeasti kauhistuneelta muistellessaan tätä tapahtumaa. Joko hän törmäsi maailman vahvimpiin limoihin, tai hänellä on valtava sisun puute. Epäilet jälkimmäistä. \n\n§<css>font-style: italic;<css><c>silver<c>"Nyt kun olet nauranut kärsimykselleni tarpeeksi, voisitko lähteä pelastamaan rakkaat tuotteeni?\nJos tarvitset varusteita retkeä varten niin voit katsoa mitä ne hirviöt jättivät kauppaani."`,
        testMerchant_agree_to_quest: "'Pelastan' tuotteesi",
        testMerchant_decline_quest: "Ei aikaa tälläiseen",
        completed_slime_quest: "test",
        testMerchant_more_slime_trouble: "Jatkuvatko lima ongelmasi?",
        testMerchant_agree_to_quest_2: "Hävitän niin monta kuin pyydät.",
        testMerchant_decline_quest_2: "En kerkeä juuri nyt.",
        testMerchant_defeated_the_slimes_2: "Mukiloin muutaman liman."
    },
    english: {
        masculine_heShe: "He",
        feminine_heShe: "She",
        neutral_heShe: "They",
        masculine_hisHer: "His",
        feminine_hisHer: "Her",
        neutral_hisHer: "Their",
        leaveDialog: "Goodbye!",
        generic_hail_friend: `<css>font-style: italic;<css><c>silver<c>"Hail friend! It's good to see someone who can think for themself, I've seen far too many of the corrupted for my own good. \nAnyway, if you're interested in what I've got, just say the word."\n\n§/heShe/ sighs and leans back.`,
        testMerchant_store: "Show me your wares",
        testMerchant_business: "How's business?",
        testMerchant_defeated_the_slimes: "I defeated the slimes",
        testMerchant_business_dialog_1: `He takes a long breath before facing you with a pained look. \n\n§<css>font-style: italic;<css><c>silver<c>"Well, if you had asked a few days ago, I would have said 'well', but that isn't the case anymore."\n\n§He looks around, as if he was looking for something in the distance. \nAfter a while of glancing around, he stops, seemingly satisfied. \n\n§<css>font-style: italic;<css><c>silver<c>"It's embarassing to admit, but you look like you can help, so here goes; Two days ago, I was robbed...by slimes." \n"I know what you're thinking, 'How would slimes ROB you?'. It's a valid question and I do owe you an explanation." \n"However, this is an embarassing story for myself so I will only tell it if you agree to help me get my stolen merchandise back. If you manage to get it, I'll give you a reward far greater than what it takes to beat a couple of slimes." \n\n§He anxiously awaits your answer. You get the feeling he's hiding something about this "merchandise", but you'd need more information to be sure.`,
        accept_slime_quest: `His face lights up slightly for a second, before going back to his anxiously embarassed expression. \n\n§<css>font-style: italic;<css><c>silver<c>"Thank you, I believe you'll get my stuff back. Now then, I suppose I should elaborate on how this all went down."\n"Two days ago, I was minding my own business, going through my merchandise when suddenly 3 slimes bursted from the forest, surrounding me. I tried fighting them off, but they overpowered me effortlessly."\n"I was so terrified I nearly peed my pants."\n\n§You can tell he did pee his pants. He probably cried too, looks like the sort. \n\n§<css>font-style: italic<css><c>silver<c>"So as I sat on the ground, certain that I was going to die, the slimes turned towards my merchandise and began taking the crates. I sat there for an hour as they kept going back and forth between whatever hole they crawled from and my spot here."\n\n§He really seems terrified as he talks about this encounter. Either he ran into the world's strongest slime posse, or more likely he's missing his spine. \n\n§<css>font-style: italic<css><c>silver<c>"So, now that you've laughed at my misery, could you please go find what they took from me? If you need gear for the journey, I'm still selling. For some reason they didn't take any weapons or armor from me."`,
        testMerchant_agree_to_quest: "I'll get your merchandise back",
        testMerchant_decline_quest: "I don't have time for that",
        completed_slime_quest: "test",
        testMerchant_more_slime_trouble: "More slime trouble?",
        testMerchant_agree_to_quest_2: "Sure, I'll exterminate some.",
        testMerchant_decline_quest_2: "No time for this now.",
        testMerchant_defeated_the_slimes_2: "I've beaten a few slimes."
    }
};
//# sourceMappingURL=dialogLocalisation.js.map