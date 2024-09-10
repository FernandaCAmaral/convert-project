//obtendo elementos do formulário
const form = document.querySelector("form");
const amount = document.querySelector("#amount");
const currency = document.querySelector("#currency");
const footer = document.querySelector("main footer");
const description = document.querySelector("#description");
const result = document.querySelector("#result")

//obtendo valores das moedas em tempo real
async function realTimeCurrency() {
  const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,JPY-BRL,GBP-BRL,ARS-BRL");
  const currencyNow = await response.json();
  return currencyNow;
}

//manipular input para evitar caracteres
amount.addEventListener("input", () => {
  const hasCharacterRegex = /\D+/g
  amount.value = amount.value.replace(hasCharacterRegex, "");
})

//captando o submit do form e identificando a moeda e seu simbolo
form.onsubmit = async (event) => {
  event.preventDefault();

  const currencyNow = await realTimeCurrency(); //espera pela função, até que ela consiga as informações da API
  let price; //declara a variavel de preço

  //verifica os diferentes casos da moeda escolhida
  switch (currency.value) {
    case "USD":
    price = Number(currencyNow.USDBRL.bid);
    convertCurrency(amount.value, price, "US$");
    break;
    case "EUR":
      price = Number(currencyNow.EURBRL.bid);
      convertCurrency(amount.value, price, "€");
      break;
    case "JPY":
      price = Number(currencyNow.JPYBRL.bid);
      convertCurrency(amount.value, price, "¥");
      break;
    case "GBP":
      price = Number(currencyNow.GBPBRL.bid);
      convertCurrency(amount.value, price, "£");
      break;
    case "ARS":
      price = Number(currencyNow.ARSBRL.bid);
      convertCurrency(amount.value, price, "$");
      break;
  }
}

// função para converter a moeda
function convertCurrency(amount, price, symbol) {
  try {
    //adiciona dinâmica ao span description
    description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price.toFixed(2))}`;

    //calcula o resultado total da conversão
    let total = Number(amount) * price;
    
    //verifica se o resultado não é um número
    if(isNaN(total)){
      return alert("Por favor digite o valor corretamente.")
    }

    //exibe o resultado total da conversão
    result.textContent = `${formatCurrencyBRL(total.toFixed(2))}`

    //adiciona a classe no footer, tornando-o visível e mostrando o resultado
    footer.classList.add("show-result");
  } catch(error) {
    //remove a classe do footer, removendo ele da tela
    footer.classList.remove("show-result");

    console.log(error);
    alert("Não foi possível realizar a conversão. Tente novamente mais tarde.");
  }
}

//formata a moeda para real brasileiro
function formatCurrencyBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

