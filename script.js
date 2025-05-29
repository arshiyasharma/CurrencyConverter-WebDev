const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") newOption.selected = true;
    if (select.name === "to" && currCode === "INR") newOption.selected = true;
    select.appendChild(newOption);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

function updateFlag(element) {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

async function updateExchangeRate() {
  const amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;
  if (!amtVal || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  try {
    const response = await fetch(`${BASE_URL}/${from}.json`);
    if (!response.ok) throw new Error("Primary API failed");
    const data = await response.json();
    const rate = data[from][to];
    msg.innerText = `${amtVal} ${fromCurr.value} = ${(amtVal * rate).toFixed(2)} ${toCurr.value}`;
  } catch {
    try {
      const fallbackRes = await fetch(`https://latest.currency-api.pages.dev/v1/currencies/${from}.json`);
      const fallbackData = await fallbackRes.json();
      const rate = fallbackData[from][to];
      msg.innerText = `${amtVal} ${fromCurr.value} = ${(amtVal * rate).toFixed(2)} ${toCurr.value}`;
    } catch {
      msg.innerText = "Failed to fetch exchange rate.";
    }
  }
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
