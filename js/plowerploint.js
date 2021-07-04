
// Mash all the fields on the game update into the Tracery grammar so they can be referenced directly in the grammar
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

const Images = 
{
    HIT: "https://www.pinclipart.com/picdir/big/123-1234276_hitting-a-baseball-clipart-amp-hitting-a-baseball.png",
    WALK: "https://www.pinclipart.com/picdir/big/564-5646339_walking-clipart.png",
}

const UpdateType = 
{
    BATTER: "new_batter",
    INNING: "inning",
    ELSEWHERE: "elsewhere",
    NONE: "none",
}

const PlayType =
{
    HIT: "hit",
    UNKNOWN: "unknown",
}

const regexBatter = /batting for the/g;
const regexInning = /(Top of \d)|(Bottom of \d)/g;
const regexElsewhere = /is Elsewhere/g;
const regexHit = /hits a /g;
const regexWalk = /draws a walk/g;

function getUpdateInfo(gameUpdate)
{
    var info = {};

    info.type = UpdateType.NONE;
    info.playType = PlayType.UNKNOWN;

    if(gameUpdate.lastUpdate.match(regexBatter))
        info.type = UpdateType.BATTER;
    if(gameUpdate.lastUpdate.match(regexInning))
        info.type = UpdateType.INNING;
    if(gameUpdate.lastUpdate.match(regexElsewhere))
        info.type = UpdateType.ELSEWHERE;

    if(gameUpdate.lastUpdate.match(regexHit))
        info.playType = PlayType.HIT;
    if(gameUpdate.lastUpdate.match(regexWalk))
        info.playType = PlayType.WALk;

    return info;
}

function setTitle(text)
{
    $("#title").html(text);
}

function setTitleFromInfo(grammar, info)
{
    if(info.type == UpdateType.INNING)
    {
        setTitle(grammar.expand("#inningTitle#").finishedText);
    }
    else if(info.type == UpdateType.BATTER)
    {
        setTitle(grammar.expand("#batterTitle#").finishedText);
    }
    else if(info.type == UpdateType.ELSEWHERE)
    {
        setTitle(grammar.expand("#elsewhereTitle#").finishedText);
    }
    else
    {
        setTitle(grammar.expand("#title#").finishedText);
    }
}

function clearSlideType()
{
    $("#slide").removeClass("titleSlide");
    $("#slide").removeClass("subtitleSlide");
    $("#slide").removeClass("contentSlide");
}

function setSlideTypeFromInfo(info)
{
    clearSlideType();

    switch(info.type)
    {
        case UpdateType.INNING:
        case UpdateType.ELSEWHERE:
            $("#slide").addClass("titleSlide");
            break;
        case UpdateType.BATTER:
            $("#slide").addClass("subtitleSlide");
            break;
        default:
            $("#slide").addClass("contentSlide");
    }
}

function newSlide(grammar, info)
{
    setSlideTypeFromInfo(info);
    setTitleFromInfo(grammar, info);
    $("#footer").html(grammar.expand("#footer#").finishedText);
    $("#body").html("<ul></ul>");
}

function addUpdateAsBodyBullet(grammar, gameUpdate, info)
{
    latest = grammar.expand("#body#").finishedText;
    var body = $("#body");
    body.append("<li>"+latest+"</li>");

    if(gameUpdate.scoreLedger != "" || gameUpdate.scoreUpdate != "")
    {
        newItem = $("#body :last-child")
        newItem.append("<ul>");
        sublist = $("#body :last-child > ul");
        if(gameUpdate.scoreLedger != "")
        {
            items = gameUpdate.scoreLedger.split("\n");
            items.forEach(x => {
                sublist.append("<li>" + x + "</li>");               
            });
        }
        if(gameUpdate.scoreUpdate != "")
            sublist.append("<li>" + gameUpdate.scoreUpdate + "</li>");
    }

    if(info.playType == PlayType.HIT)
    {
        $("#clipart").html("<img src='"+Images.HIT+"'/>");
    }
    else if(info.playType == PlayType.WALK)
    {
        $("#clipart").html("<img src='"+Images.WALK+"'/>");
    }
    else
    {
        $("#clipart").html("");
    }


}

function updateGame(gameUpdate)
{
    if(lastUpdate != undefined 
        && lastUpdate.lastUpdate === gameUpdate.lastUpdate 
        && lastUpdate.eventIndex === gameUpdate.eventIndex)
    {
        return;
    }

    $("#debugOutput").text(gameUpdate.lastUpdate);
    var info = getUpdateInfo(gameUpdate);

    // Resolve the most recent batter name
    gameUpdate.batterName = gameUpdate.topOfInning ? gameUpdate.awayBatterName : gameUpdate.homeBatterName;
    if(gameUpdate.batterName)
    {
        lastBatter = gameUpdate.batterName;
    }
    gameUpdate.batterName = lastBatter;

    // Make innings 1-indexed
    gameUpdate.inning++;

    // Set up the grammar for this run
    updateGrammar(testGrammar, gameUpdate);
    //console.log(testGrammar);

    var grammar = tracery.createGrammar(testGrammar);
    grammar.addModifiers(baseEngModifiers);
    
    if(info.type == UpdateType.BATTER || info.type == UpdateType.INNING || info.type == UpdateType.ELSEWHERE)
    {
        newSlide(grammar, info);
    }
    else
    {
        if(lastInfo.type == UpdateType.BATTER)
            newSlide(grammar, info);
        addUpdateAsBodyBullet(grammar, gameUpdate, info);
    }

    lastInfo = info;
    lastUpdate = gameUpdate;
}


const evtSource = new EventSource("https://api.sibr.dev/replay/v1/replay?from=2021-07-01T01:00:08.17Z");

var lastBatter;
var gameId = undefined;
var lastInfo;
var lastUpdate;
var play = true;
const GAME_INDEX = 2;

$("#stopStart").click(function() { play = !play; });

evtSource.onmessage = function(event)
{
    try
    {
        update = JSON.parse(event.data);
        games = update.value.games.schedule;

        if(gameId === undefined)
        {
            gameId = games[GAME_INDEX].id;
        }
        // TODO: pick what game to care about
        oneGame = games.filter(function(x) { return x.id === gameId; })[0];
        console.log(oneGame);
        if(play)
            updateGame(oneGame);
    }
    catch(err)
    {
        console.log(err.message);
        //console.log(event.data);
    }

}