// Style background color of the body
let body = document.querySelector("body");
body.style.backgroundColor = "#EDCDBB";

// Adding heading to the output
let heading = document.createElement("h1");
heading.innerHTML = "Nationalize API - Hackathon Task";
heading.setAttribute("class", "text-center h1 px-1 py-3");
body.appendChild(heading);

// Creating Card
let card = document.createElement("div");
card.style.maxWidth = "30rem";
card.setAttribute("class", "card d-flex mx-auto my-3 container-sm");

let cardBody = document.createElement("div");
cardBody.setAttribute("class", "card-body text-center");

let cardTitle = document.createElement("h4");
cardTitle.setAttribute("class", "card-title");
cardTitle.innerHTML = "Search For Country here";

let cardInput = document.createElement("input");
cardInput.setAttribute("type", "text");
cardInput.setAttribute("placeholder", "Enter Country Name");
cardInput.setAttribute("class", "form-control my-3");

let buttonLink = document.createElement("a");
buttonLink.setAttribute("href", "#");
buttonLink.setAttribute("class", "btn btn-outline-danger px-5");
buttonLink.innerHTML = "Search";

// buttonDiv.append(buttonLink);
cardBody.append(cardTitle, cardInput, buttonLink);
card.append(cardBody);
body.append(card);

// display no result on default load
var errorMsg = document.createElement("p");
errorMsg.setAttribute("class", "text-center");
errorMsg.style.fontSize = "1.2rem";
errorMsg.innerHTML = "No Results Found";
body.append(errorMsg);

// Handling Button click
let btn = document.querySelector("a");
let enteredText = document.querySelector("input");

btn.addEventListener("click", async (event) => {
  // prevents page reload
  event.preventDefault();

  // removes table and input which was rendered previously
  let removeTab = document.querySelector("table");
  let removeEle = document.getElementsByClassName(
    "p-3 text-center my-2 overflow-auto d-flex mx-auto justify-content-center"
  )[0];
  if (removeTab) {
    removeTab.remove();
  }
  if (removeEle) {
    removeEle.remove();
  }

  // parsing results based on API response
  let req = await fetch(
    `https://api.nationalize.io?name=${enteredText.value.trim()}`
  );
  let res = await req.json();

  // try catch and handle errors
  try {
    // validation on submit
    if (enteredText.value.trim().length === 0) {
      throw "Please Pass any Input";
    }
    var inputEntered = document.createElement("h4");
    inputEntered.setAttribute(
      "class",
      "p-3 text-center my-2 overflow-auto d-flex mx-auto justify-content-center"
    );
    inputEntered.innerHTML = "Input Captured : " + enteredText.value;
    body.append(inputEntered);

    // clearing text post submit
    enteredText.value = "";

    // check if response containes or more country
    if (res["country"].length === 0) {
      throw "No Matching Country Found";
    }

    // creating table
    let table = document.createElement("table");
    table.style.backgroundColor = "#fff";
    table.setAttribute(
      "class",
      "table table-striped table-hover text-center w-50 mx-auto container-fluid table-bordered"
    );
    let thead = document.createElement("thead");
    let tableRow = table.insertRow();
    let thead1 = tableRow.insertCell();
    thead1.innerHTML = "Country Code";
    let thead2 = tableRow.insertCell();
    thead2.innerHTML = "Probability";
    tableRow.append(thead1, thead2);
    thead.append(tableRow);
    table.append(thead);

    // sorting value based on probability value
    Object.entries(res["country"]).sort((a, b) => +b[1] - +a[1]);

    // construction of table body with received results
    let tbody = document.createElement("tbody");
    if (res["country"].length > 2) {
      for (let i = 0; i < 2; i++) {
        let tableBodyRow = table.insertRow();
        let countryCode = tableBodyRow.insertCell();
        countryCode.innerHTML = res["country"][i]["country_id"];
        countryCode.setAttribute("class", "text-danger");
        countryCode.style.fontWeight = "bolder";
        let probability = tableBodyRow.insertCell();
        probability.innerHTML = res["country"][i]["probability"];
        tableBodyRow.append(countryCode, probability);
        tbody.append(tableBodyRow);
      }
    }
    table.append(tbody);
    body.append(table);
    errorMsg.innerHTML = "Results";
  } catch (Error) {
    errorMsg.innerHTML = Error;
  }
});
