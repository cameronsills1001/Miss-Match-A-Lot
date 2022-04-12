

const masterList = ["ashe", "blaze","bulbasaur","charmander","darrington", "gary", "krabs", "patrick", "pikachu", "sandy", "spongebob", "squidward", "squirtle"];
var doubleList = makeDoubleList();
var cardList = makeCards();
var clickedCards = [];
var statusList = [];
var clickCount = 0;
var globalClick = true;
var winSound = new Audio("sounds/win.wav");
var clickSound = new Audio("sounds/click.wav");
var correctSound = new Audio("sounds/correct.wav");



//disable context menu
document.addEventListener("contextmenu", function(event){
event.preventDefault();
}, false);

//making a list of 2 of each of randomly selected characters
function makeDoubleList() {
  var selectList = masterList;
  var retList = [];
  for(var i = 0; i < 12; i++) {
    var index = Math.floor(Math.random() * selectList.length);
    for(var x = 0; x < 2; x++) {
      retList.push(selectList[index]);
    }
    selectList.splice(index, 1);
  }
  return retList;
}

//making the cards from the doubleList
function makeCards() {
  var cardList = [];
  for(var i = 0; i < 24; i++ ) {
    var index = Math.floor(Math.random() * doubleList.length);
    cardList.push({cardName: doubleList[index], image: doubleList[index] +".png", clickable: true});
    doubleList.splice(index, 1);
  }
  return cardList;
}

function clearMatchParamters(){
  clickCount = 0;
  clickedCards = [];
  globalClick = true;
}

function flipCards(){
  for(var i = 0; i < 2; i++) {
    var index = clickedCards[i].slice(3);
    cardList[index].clickable = true;
    $("#"+clickedCards[i]).attr("src", "images/cardBack.png");
    $("#card"+index).removeClass("no-match");
  }
  clearMatchParamters();
}

function checkMatch() {
  if(clickCount === 2){
    globalClick = false;
    var index1 = clickedCards[0].slice(3);
    var index2 = clickedCards[1].slice(3);
    //if there is a match
    if(cardList[index1].cardName === cardList[index2].cardName){
      correctSound.play();
      var statusIndex = statusList.length;
      $("#status" + statusIndex + "> img").attr("src", "images/" + cardList[index1].image)
      statusList.push(cardList[index1].cardName);
      $("#card"+index1).addClass("match");
      $("#card"+index2).addClass("match");
      $("#card"+index1).animate({opacity: 0},2000);
      $("#card"+index2).animate({opacity: 0},2000);
      setTimeout(function() {
        $("#card"+index1).removeClass("match");
        $("#card"+index2).removeClass("match");
      }, 2000);
      if(statusList.length === 12) {
        //this means the game is 'won' and all available cards are matched
        setTimeout(function() {
          winSound.play();
        $("#end-overlay").css({"display":"inline"});
        },2200);

      };
      clearMatchParamters();
    } else {
      $("#card"+index1).addClass("no-match");
      $("#card"+index2).addClass("no-match");
      setTimeout(flipCards, 2000);

    }
  }
}

$('img').click(function() {
  var pic = event.target.id;
  //console.log(pic);
  clickSound.play();
  var index = pic.slice(3);
  if(cardList[index].clickable && globalClick){
    $("#"+pic).attr("src", "images/"+ cardList[index].image);
    clickedCards.push(pic);
    cardList[index].clickable = false;
    clickCount++;
    checkMatch();
  } else {
    console.log("This card isn't clickable");
  }

});

$("#restart").click(function(){
  location.reload();
});
