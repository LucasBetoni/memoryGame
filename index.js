var names =  ['Helena', 'Alice', 'Laura', 'Maria', 'Sophia',  'Manuela', 'Maitê', 'Heitor'];

var symbols =  names.concat(names),
		opened = [],
		match = 0,
		movimentos = 0,
		$deck = $('.deck'),
		$scorePanel = $('#score-panel'),
		$moveNum = $scorePanel.find('.movimentos'),
		$ratingStars = $scorePanel.find('i'),
		$restart = $scorePanel.find('.restart > .fa-repeat'),
		$mudarNomes = $scorePanel.find('.restart > .fa-cog'),
		delay = 800,
		gameCardsQTY = symbols.length / 2,
		rank3stars = gameCardsQTY + 2,
		rank2stars = gameCardsQTY + 6,
		rank1stars = gameCardsQTY + 10;

// Shuffle function From http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
	
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Initial Game
function initGame() {
	var cards = shuffle(symbols);
  $deck.empty();
  match = 0;
  movimentos = 0;
  $moveNum.html(movimentos);
  $ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa">'+ cards[i] +'</i></li>'))
	}
};

// Set Rating and final Score
function setRating(movimentos) {
	var rating = 3;
	if (movimentos > rank3stars && movimentos < rank2stars) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (movimentos > rank2stars && movimentos < rank1stars) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (movimentos > rank1stars) {
		$ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}	
	return { score: rating };
};

// End Game
function endGame(movimentos, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Parabéns! Você venceu!',
		text: 'Usando ' + movimentos + ' movimentos e com ' + score + ' Estrelas!',
		type: 'success',
		confirmButtonColor: '#9BCB3C',
		confirmButtonText: 'Jogar Novamente!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

// Restart Game
$restart.on('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Tem certeza?',
    text: "O progresso será perdido",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#9BCB3C',
    cancelButtonColor: '#EE0E51',
    confirmButtonText: 'Sim, Reiniciar Jogo!',
	cancelButtonText: 'Cancelar'
  }).then(function(isConfirm) {
    if (isConfirm) {
      initGame();
    }
  })
});

// Change names
$mudarNomes.on('click', function() {
	
	swal({
		title: 'Editar Nomes:',
		showCancelButton: true,
		cancelButtonColor: '#EE0E51',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#9BCB3C',
    	confirmButtonText: 'Salvar',
		html:
		  '<input id="swal-input1" class="swal2-input" value ="'+names[0]+'">' +
		  '<input id="swal-input2" class="swal2-input" value ="'+names[1]+'">' +
		  '<input id="swal-input3" class="swal2-input" value ="'+names[2]+'">' +
		  '<input id="swal-input4" class="swal2-input" value ="'+names[3]+'">' +
		  '<input id="swal-input5" class="swal2-input" value ="'+names[4]+'">' +
		  '<input id="swal-input6" class="swal2-input" value ="'+names[5]+'">' +
		  '<input id="swal-input7" class="swal2-input" value ="'+names[6]+'">' +
		  '<input id="swal-input8" class="swal2-input" value ="'+names[7]+'">',
		preConfirm: () => {

			names = [
			  $('#swal-input1').val(),
			  $('#swal-input2').val(),
			  $('#swal-input3').val(),
			  $('#swal-input4').val(),
			  $('#swal-input5').val(),
			  $('#swal-input6').val(),
			  $('#swal-input7').val(),
			  $('#swal-input8').val()
			];
			symbols =  names.concat(names);
			initGame();
			swal.close();
		},

	  })
  });


// Card flip
$deck.on('click', '.card:not(".match, .open")', function() {
	if($('.show').length > 1) { return true; }
	
	var $this = $(this),
			card = $this.context.innerHTML;
  $this.addClass('open show');
	opened.push(card);

	// Compare with opened card
  if (opened.length > 1) {
    if (card === opened[0]) {
      $deck.find('.open').addClass('match animated infinite rubberBand');
      setTimeout(function() {
        $deck.find('.match').removeClass('open show animated infinite rubberBand');
      }, delay);
      match++;
    } else {
      $deck.find('.open').addClass('notmatch animated infinite wobble');
			setTimeout(function() {
				$deck.find('.open').removeClass('animated infinite wobble');
			}, delay / 1.5);
      setTimeout(function() {
        $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
      }, delay);
    }
    opened = [];
		movimentos++;
		setRating(movimentos);
		$moveNum.html(movimentos);
  }
	
	// End Game if match all cards
	if (gameCardsQTY === match) {
		setRating(movimentos);
		var score = setRating(movimentos).score;
		setTimeout(function() {
			endGame(movimentos, score);
		}, 500);
  }
});

initGame();