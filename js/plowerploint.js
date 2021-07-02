

function updateGrammar(grammar, gameUpdate)
{
    for(let key in gameUpdate)
    {
        if(!Array.isArray(gameUpdate[key]))
        {
            if(gameUpdate[key] == null)
            {
                grammar[key] = "#null#";
            }
            else
            {
                grammar[key] = gameUpdate[key].toString();
            }
        }
    }
}

function updateGame(gameUpdate)
{
    // Resolve the most recent batter name
    gameUpdate.batterName = gameUpdate.topOfInning ? gameUpdate.awayBatterName : gameUpdate.homeBatterName;
    if(gameUpdate.batterName)
    {
        lastBatter = gameUpdate.batterName;
    }
    gameUpdate.batterName = lastBatter;

    gameUpdate.inning++;

    //console.log(gameUpdate);
    $("#game").text(gameUpdate.lastUpdate)

    // Set up the grammar for this run
    updateGrammar(testGrammar, gameUpdate);
    //console.log(testGrammar);

    var grammar = tracery.createGrammar(testGrammar);
    grammar.addModifiers(baseEngModifiers);
    
    var result = grammar.expand("#origin#");
    //console.log(result);
    var mainDiv = $("#output");
  
    mainDiv.html(result.finishedText);
}


const evtSource = new EventSource("https://api.sibr.dev/replay/v1/replay?from=2021-07-01T01:00:08.17Z");

var lastBatter;

evtSource.onmessage = function(event)
{
    update = JSON.parse(event.data);
    games = update.value.games.schedule;
    // TODO: pick what game to care about
    oneGame = games[0];
    updateGame(oneGame);
}