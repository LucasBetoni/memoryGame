const NUMBER_OF_NAMES = 8;
const NAME_MAX_SIZE = 42;
const NAME_FILTER_REGEX = /^[^()\/><\][\\\x22,;|]+$/;

var namesAudio = {};

var names = [
  "Helena",
  "Alice",
  "Laura",
  "Maria",
  "Sophia",
  "Manuela",
  "Maitê",
  "Heitor",
];

function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

var json_str = getCookie("mycookie-memmoryGame");
if (!json_str == "") names = JSON.parse(json_str);

//to do
function validation(test_names) {
  test_names.forEach((element) => {
    if (this == "" || this == null) return false;
  });

  return true;
}

let names2 = parseURLParams(document.URL);
if (names2 !== undefined && names2.length == NUMBER_OF_NAMES) names = names2;

var symbols = names.concat(names),
  opened = [],
  match = 0,
  movimentos = 0,
  $deck = $(".deck"),
  $scorePanel = $("#score-panel"),
  $moveNum = $scorePanel.find(".movimentos"),
  $ratingStars = $scorePanel.find("i"),
  $restart = $scorePanel.find(".restart > .fa-repeat"),
  $mudarNomes = $scorePanel.find(".restart > .fa-cog"),
  $informacoes = $scorePanel.find(".restart > .fa-info"),
  $share = $scorePanel.find(".restart > .fa-share"),
  delay = 800,
  gameCardsQTY = symbols.length / 2,
  rank3stars = gameCardsQTY + 2,
  rank2stars = gameCardsQTY + 6,
  rank1stars = gameCardsQTY + 10;

// Shuffle function From http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function loadAudio(){
  for (let i = 0; i < NUMBER_OF_NAMES; i++) {
    try {
      if(!(names[i] in namesAudio)){
         namesAudio[names[i]] = new Audio(names[i] + ".mp3");
      }
    } catch(e) {
      console.log('Erro ao carregar:', e);
      if(names[i] in namesAudio) {
        delete namesAudio[names[i]];
      }
    }
  }

};

// Initial Game
function initGame() {
  loadAudio();
  var cards = shuffle(symbols);
  $deck.empty();
  match = 0;
  movimentos = 0;
  $moveNum.html(movimentos);
  $ratingStars.removeClass("fa-star-o").addClass("fa-star");
  for (var i = 0; i < cards.length; i++) {
    $deck.append($('<li class="card"><i class="fa">' + cards[i] + "</i></li>"));
  }
}

// Set Rating and final Score
function setRating(movimentos) {
  var rating = 3;
  if (movimentos > rank3stars && movimentos < rank2stars) {
    $ratingStars.eq(2).removeClass("fa-star").addClass("fa-star-o");
    rating = 2;
  } else if (movimentos > rank2stars && movimentos < rank1stars) {
    $ratingStars.eq(1).removeClass("fa-star").addClass("fa-star-o");
    rating = 1;
  } else if (movimentos > rank1stars) {
    $ratingStars.eq(0).removeClass("fa-star").addClass("fa-star-o");
    rating = 0;
  }
  return { score: rating };
}

// End Game
function endGame(movimentos, score) {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: "Parabéns! Você venceu!",
    text: "Usando " + movimentos + " movimentos e com " + score + " Estrelas!",
    type: "success",
    confirmButtonColor: "#9BCB3C",
    confirmButtonText: "Jogar Novamente!",
  }).then(function (isConfirm) {
    if (isConfirm) {
      initGame();
    }
  });
}

// Restart Game
$restart.on("click", function () {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: "Tem certeza?",
    text: "O progresso será perdido",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9BCB3C",
    cancelButtonColor: "#EE0E51",
    confirmButtonText: "Sim, Reiniciar Jogo!",
    cancelButtonText: "Cancelar",
  }).then(function (isConfirm) {
    if (isConfirm) {
      initGame();
    }
  });
});

// Info
$informacoes.on("click", function () {
  swal({
    allowEscapeKey: true,
    allowOutsideClick: true,
    title: "Jogo da Memoria - Nomes",
    text: "Um simples jogo da memória utilizando 8 nomes diferentes. É possível alterar os nomes na configuração.",
    type: "info",
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonColor: "#9BCB3C",
    confirmButtonText: "OK!",
  });
});

$share.on("click", function () {
  let outputStr = window.location.protocol + "//" + window.location.host + "/?";
  for (let i = 0; i < NUMBER_OF_NAMES; i++) {
    if (i != 0) {
      outputStr += "&";
    }
    outputStr += encodeURIComponent(names[i]);
  }

  swal({
    title: "<strong>Compartilhe este jogo com os mesmos nomes:</strong>",
    icon: "info",
    html:
      '<input type="text" value="' +
      outputStr +
      '" onclick="this.select();" readonly></input>',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: '<i class="fa fa-clipboard"></i> Copiar',
    cancelButtonColor: "#EE0E51",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      copyToClipboard(outputStr);
    },
  });
});

// Change names
$mudarNomes.on("click", function () {
  swal({
    title: "Editar Nomes:",
    showCancelButton: true,
    cancelButtonColor: "#EE0E51",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#9BCB3C",
    confirmButtonText: "Salvar",
    html: (() => {
      let htmlStr = "";
      for (let i = 0; i < NUMBER_OF_NAMES; i++) {
        htmlStr +=
          '<input id="swal-input' +
          (i + 1) +
          '" placeholder="(digite aqui o nome ' +
          (i + 1) +
          ')" class="swal2-input" maxlength="' +
          NAME_MAX_SIZE +
          '" value="' +
          names[i] +
          '">';
      }
      return htmlStr;
    })(),
    preConfirm: () => {
      let newNames = [];
      let validationStr = "";
      for (let i = 1; i <= NUMBER_OF_NAMES; i++) {
        validationStr += $("#swal-input" + i).val();
        newNames.push($("#swal-input" + i).val());
      }

      if (!NAME_FILTER_REGEX.test(validationStr)) {
        alert(
          "Por favor, use apenas letras (A-Z), números (0-9) e ponto final (.)."
        );
        return;
      }

      names = newNames;
      var json_str = JSON.stringify(names);
      createCookie("mycookie-memmoryGame", json_str, 65);

      symbols = names.concat(names);
      initGame();
      swal.close();
    },
  });
});
var audio;
var audio_correto = new Audio("correto.mp3");
var audio_errou = new Audio("errou.mp3");
var audio_ganhou = new Audio("ganhou.mp3");
// Card flip
$deck.on("click", '.card:not(".match, .open")', function () {
  if ($(".show").length > 1) {
    return true;
  }

  var $this = $(this),
    card = $this.context.innerHTML;
  $this.addClass("open show");

  if($this.context.innerText in namesAudio && namesAudio[$this.context.innerText].readyState === 4) {
    namesAudio[$this.context.innerText].play();
  }

  opened.push(card);

  // Compare with opened card
  if (opened.length > 1) {
    if (card === opened[0]) {
      $deck.find(".open").addClass("match animated infinite rubberBand");

      audio_correto.play();
      setTimeout(function () {
        $deck
          .find(".match")
          .removeClass("open show animated infinite rubberBand");
      }, delay);
      match++;
    } else {
      $deck.find(".open").addClass("notmatch animated infinite wobble");
      audio_errou.play();
      setTimeout(function () {
        $deck.find(".open").removeClass("animated infinite wobble");
      }, delay / 1.5);

      setTimeout(function () {
        document.body.addEventListener(
          "click",
          () => {
            $deck
              .find(".open")
              .removeClass("open show notmatch animated infinite wobble");
          },
          { once: true }
        );
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
    setTimeout(function () {
      audio_ganhou.play();
      endGame(movimentos, score);
    }, 500);
  }
});

initGame();

function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i,
    n,
    v,
    nv;

  if (query === url || query === "") return undefined;

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=", 2);
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    if (!parms.hasOwnProperty(n)) parms[n] = [];
    parms[n].push(nv.length === 2 ? v : null);
  }
  return Object.keys(parms);
}

function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return prompt("Copy to clipboard: Ctrl+C, Enter", text);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
