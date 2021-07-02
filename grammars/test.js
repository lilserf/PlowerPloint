
testGrammar = 
{
    origin: ["#title# #body# #footer#"],
    title: "<div class='title'>#titleContent#</div>",
    titleContent: [
        "#batterName# - #atBatBalls#-#atBatStrikes#",
        "#atBatBalls#-#atBatStrikes# / #batterName#",
    ],
    body: ["#lastUpdate#"],
    footer: "<div class='footer'>#footerContent#</div>",
    footerContent: 
    [
        "#inningDesc#",
        "#homeTeamNickname# vs #awayTeamNickname#"
    ],
    inningDesc: ["#inning.th# Inning"],
    null: ["Ooopsie", "Error", "undefined"]
}