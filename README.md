Tadashi-SRS: An SRS Library for JavaScript
==========================================

What is it?
-----------

> Spaced repetition is a learning technique that incorporates increasing intervals of
> time between subsequent review of previously learned material in order to exploit the
> psychological spacing effect.
> - Wikipedia

Or to put simply, a system that tells you when you should be reviewing flashcards for
the most optimum learning experience. This is particularly suited to learning a foreign
language, where you have to learn tens of thousands of vocabulary words.

Usage
-----
    
```javascript
import Drill from 'tadashisrs/drill';
import Item from 'tadashisrs/question';

import EnhancedPickStrategy from 'tadashisrs/strategies/enhanced';

const items = [
    new Item({...}),
    new Item({...}),
    new Item({...})
];
    
const drill = new Drill(
    new EnhancedPickStrategy(queue)
);

while( ! drill.isFinished() ){

    // get the next card from the srs drill
    const card = drill.next();

    // assume we got it right...
    if(card.checkAnswer("African or European Swallow")){
        drill.right(card);  
    } else {
        drill.wrong(card);
    }

}

```

Core Concepts
-------------

An Item is a abstract 'thing' that we want to learn. An item can have multiple
cards. Each card has a question and an answer

A Strategy is an algorithm for picking the next item from a list of items to
present to the user. This is the SRS part of the system. The strategy will look
at things like how long it's been since we last reviewed an item, how recently
we started learning this item, how frequently we get the item wrong, etc.

The Drill keeps track of the current state of the quiz we are running and physical
cards we need to show to the user.

Each Item has a bucket. The bucket determines how long to wait until the card becomes
ready for review again. An Item starts off with a bucket value of 0. Answer
it correctly and it gets moved into bucket 1. Answer it correctly again (after
an amount of time configured for that bucket) and it gets moved into bucket 2,
and so on. Higher buckets have longer times between review.

Supported Strategies
--------------------

The EnhancedPickStrategy shows items that are ready to review based on their
bucket. It will priorise showing items you learnt recently or items in your very
lowest bucket. If you get a card wrong, it will show that item again immediately.
The EnhancedPickStrategy is intended to be the default SRS experience.

The SingleLevelPickStrategy shows all items in the given list, irrespective of
bucket or anything else. The SingleLevelPickStrategy is indended to be used if
you want to do a quick manual review of a set of items outside of the normal
SRS experience.

The Item Class
--------------

Lets say you want to learn about the countries of the world. For each
country, you may have several cards associated with it (what is it's name,
what is it's main export, what is it's population, etc). You can model
this as below:
    
```
const item = new Item({
    character = "England",
    questions = [
        new Card({
            useIme = false,
            question = "What is the capital of England?",
            answers = ["London", "E"]
        }),
        new Card({
            useIme = false,
            question = "What is the main export of England?",
            answers = ["Tea", "Mad Bantz"]
        });    
    ]
});
```

There are several 'fluff' fields that are optional (unused in this core library)
but may be useful to clients:

* category
* description
* background
* mnemonic
* level
