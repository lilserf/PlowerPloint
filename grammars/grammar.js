
testGrammar = 
{
    origin: ["#title# #body# #footer#"],
    inningTitle: 
    [
        "#lastUpdate#",
        "#topOfInning.topBottom# the #inning.th#",
        "#topOfInning.topBottom# the #inning.th# Inning",
    ],
    elsewhereTitle: ["#lastUpdate#"],
    batterTitle: 
    [
        "#batterName# now up to bat",
        "Now batting: #batterName#",
        "Up next: #batterName#",
        "#batterName# steps to the plate",
        "#batterName# now batting",
        "#batterName# is up!",
    ],
    title: ["#batterName#"],
    body: ["#lastUpdate#"],
    footer: 
    [
        "#footerTeams# - #inningDesc#",
        "#inningDesc# - #footerTeams#",
        "#footerTeams#",
    ],
    footerTeams:
    [
        "#homeTeamNickname# vs #awayTeamNickname#",
        "#awayTeamNickname# @ #homeTeamNickname#",
        "#homeTeamName# vs #awayTeamName#",
        "#awayTeamName# @ #homeTeamName#",
        "#homeTeamNickname# #homeScore#, #awayTeamNickname# #awayScore#",
        "#homeTeamName# #homeScore#, #awayTeamName# #awayScore#",
    ],
    inningDesc: ["#inning.th# Inning"],
    null: ["Ooopsie", "Error", "undefined"]
}