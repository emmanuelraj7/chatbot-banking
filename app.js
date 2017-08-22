// This loads the environment variables from the .env file


var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

// Bot setup
    var bot = new builder.UniversalBot(connector, function (session) {
    var cards = getCardsAttachments();
    var intents = new builder.IntentDialog();
    var connector = new builder.ConsoleConnector().listen();
    
    
//=========================================================
// Bots Dialogs
//=========================================================

//---------------Greetings---------------------------------

bot.dialog('/', new builder.IntentDialog()
    .matches(/^hi/i, '/stepone')
    .matches(/^Hello/i, '/stepone')
    .matches(/^moi/i, '/stepone')
    .matches(/^moika/i, '/stepone')
    .matches(/^hallo/i, '/stepone')
    .onDefault(builder.DialogAction.send("I'm sorry. Can you say that again"))
);


//------------After greetings------------------------------

bot.dialog('/stepone', [
   function(session){
   session.send('Hiiii, I am bankiton. Im all yours!');
   builder.Prompts.choice(session, "How can I help you?", ["Loans","Credit card","Savings account"]);

},      function (session, results) {
        session.userData.service = results.response.entity;
        if(session.userData.service == "Loans"){
        session.beginDialog('/loaner');
    }
    if(session.userData.service == "Savings account"){
        session.beginDialog('/saccount');
    }
    if (session.userData.service == "Credit card") {
        session.beginDialog('/ccard')
    }
    else {
          next();  
    }

    }
    ]);

bot.dialog('/loaner', [ function(session) {

   builder.Prompts.choice(session, "How much?", ["Below €200","€200-€1000","Above €1000"]);

}, function (session, results) {
        session.userData.amount = results.response.entity;
        if(session.userData.amount == "Below €200"){
        session.send("So here are some options for Below €1000: ");
    }
    if(session.userData.service == "€200-€1000"){
        session.send("So here are some options for €1000 to €5000: ");
    }
    if (session.userData.service == "Above €5000") {
        session.send("So here are some options for above €1000: ");
    }
    else {
          session.send("You're very naughty");   
    }

    }
    ]);


bot.dialog('/saccount', [ function(session) {
    
    session.send("Yhankyou");

}]);


bot.dialog('/ccard', [ function(session) {
    
    session.send("Dhankyou");

}]);


    // create reply with Carousel AttachmentLayout
    var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

    session.send(reply);
});

function getCardsAttachments(session) {
    return [
        new builder.HeroCard(session)
            .title('Finnair Plus')
            .subtitle('Luottokortti')
            .text('Customers top choice')
            .images([
                builder.CardImage.create(session, 'http://www.bankiton.com/sites/default/files/finnair_plus_diners_club.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.bankiton.com', 'More info')
            ]),

        new builder.ThumbnailCard(session)
            .title('S-Etukortti Visa Credit')
            .subtitle('S-Market')
            .text('Customers top choice')
            .images([
                builder.CardImage.create(session, 'http://www.bankiton.com/sites/default/files/S-Pankki%20S-Etukortti%20VISA.gif')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.bankiton.com', 'More info')
            ]),

        new builder.HeroCard(session)
            .title('SAS EuroBonus Diners Club')
            .subtitle('Luottokortti')
            .text('Customers top choice')
            .images([
                builder.CardImage.create(session, 'http://www.bankiton.com/sites/default/files/SAS%20EuroBonus%20Dines%20Club.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.bankiton.com', 'More info')
            ]),

        new builder.ThumbnailCard(session)
            .title('Diners Club Premium')
            .subtitle('Luottokortti')
            .text('Customers top choice')
            .images([
                builder.CardImage.create(session, 'http://www.bankiton.com/sites/default/files/Diners%20Club%20Premium_0.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.bankiton.com', 'More info')
            ])
    ];
}

