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
	
	var NUMBER_OF_NAMES = 8;
	var NAME_MAX_SIZE = 50;
	var NAME_FILTER_REGEX = /^[^()\/><\][\\\x22,;|]+$/;

	swal({
		title: 'Editar Nomes:',
		showCancelButton: true,
		cancelButtonColor: '#EE0E51',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#9BCB3C',
    	confirmButtonText: 'Salvar',
		html: (() => {
			let htmlStr = '';
			for(let i = 0; i < NUMBER_OF_NAMES; i++) {
				htmlStr += '<input id="swal-input' + (i+1) + '" placeholder="(digite aqui o nome ' + (i+1) + ')" class="swal2-input" maxlength="' + NAME_MAX_SIZE + '" value="' + names[i] + '">'
			}
			return htmlStr;
		})(),
		preConfirm: () => {

			let newNames = [ ];
			let validationStr = '';
			for(let i = 1; i <= NUMBER_OF_NAMES; i++) {
				validationStr += $('#swal-input' + i).val();
				newNames.push($('#swal-input' + i).val());
			}

			if(!NAME_FILTER_REGEX.test(validationStr)) {
				alert('Por favor, use apenas letras (A-Z), números (0-9) e ponto final (.)!');
				return;
			}

			names = newNames;
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