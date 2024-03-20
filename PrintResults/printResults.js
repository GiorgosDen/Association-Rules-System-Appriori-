//Globals Data variables
var itemsetsData;//2d array
var itemsetsDataScores;//2d array, same dimension with itemsetsData
var KlevelItemsets;//Integer number
var rulesData;//1d Array
var rulesDataScores;//1d Array, same lenght with rulesData
//indexes for print datas
var slideItemIndex = 1;
var slideRulesIndex = 1;
window.onload = function(){

    //load print data from sessionStorage
    //1. Itemsets
    itemsetsData = sessionStorage.getItem("itemsets");
    KlevelItemsets = sessionStorage.getItem("kLevels");
    itemsetsDataScores = sessionStorage.getItem("itemsetsScores");
    itemsetsDataScores = JSON.parse(itemsetsDataScores);
    itemsetsData = JSON.parse(itemsetsData);
    //2.Rules
    rulesData = sessionStorage.getItem("rules");
    rulesDataScores = sessionStorage.getItem("rulesScores").split(",");

    //Create text content for any K-itemset level, and also create dynamically <p> 
    for(let i=0; i<KlevelItemsets; i++){
        let currLevelItemsets = Array.from(itemsetsData[i]);
        let currLevelItemsetsScores = itemsetsDataScores[i].toString().split(",");
        let labelText = "For k="+(i+1)+" itemsets";//Label text
        let dataText="";//Save all couples itemset - score
        for(let j=0; j<currLevelItemsetsScores.length; j++){
            console.log("itemset: "+currLevelItemsets[j]+" score: "+currLevelItemsetsScores[j]);
            dataText+=currLevelItemsets[j]+" - "+currLevelItemsetsScores[j].substring(0,4)+"<br>";
        }
        //Print data into to page
        createItemsetsCard(labelText,dataText);
    }

    //Create text contents for all rules (by 5)
    labelText = "Association Rules ";
    dataText = "";
    let rulesCardnumber=0;
    let ruleN=1;
    let rulesList = rulesData.split(",");
    let rulesScoresList = Array.from(rulesDataScores);
    for(let i=0; i<rulesList.length; i++){
        dataText+=rulesList[i]+" - "+rulesScoresList[i].substring(0,4)+"<br>";
        console.log(rulesList[i]+" score: "+rulesScoresList[i]);
        rulesCardnumber+=1;
        if(rulesCardnumber==5){
            labelText+=ruleN;
            dataText = dataText.replace(',', '');
            createRulesCard(labelText,dataText);
            dataText="";
            rulesCardnumber=0;
            ruleN+=1;
            labelText = "Association Rules ";
        }
    }
    createRulesCard(labelText,dataText);

    //show the first data
    showItemset(slideItemIndex);
    showRules(slideRulesIndex);
}

//creates dynamically a "card" for some itemsets
function createItemsetsCard(labelT,dataT){
    //Find the element to add the new card
    let container = document.getElementById("itemstesCards");
    //Create the dynamic elements
    //header
    let headerCard = document.createElement("h3");
    headerCard.textContent = labelT;
    //context
    let dataCard = document.createElement("p");
    dataCard.innerHTML = dataT;
    dataCard.style.background = "red";
    dataCard.style.border = "solid gray 1px";
    //label
    let labelCard = document.createElement("p");
    labelCard.textContent="itemset - support";
    labelCard.style.border = "solid gray 2px";

    //new section
    let aSection = document.createElement("section");
    aSection.style.textAlign = "center";
    aSection.className = "itemsCard";

    //Add header and paragraph into to section
    aSection.appendChild(headerCard);
    aSection.appendChild(labelCard);
    aSection.appendChild(dataCard);

    //Add section to page
    container.appendChild(aSection);
}

//Create the rules card
function createRulesCard(labelT,dataT){
    //Find the element to add the new card
    let container = document.getElementById("rulesCard");
    //Create the dynamic elements
    //header
    let headerCard = document.createElement("h3");
    headerCard.textContent = labelT;
    //context
    let dataCard = document.createElement("p");
    dataCard.innerHTML = dataT;
    dataCard.style.background = "red";
    dataCard.style.border = "solid gray 1px";
    //label
    let labelCard = document.createElement("p");
    labelCard.textContent="Rule - Confindence";
    labelCard.style.border = "solid gray 2px";

    //new section
    let aSection = document.createElement("section");
    aSection.style.textAlign = "center";
    aSection.className = "ruleCard";

    //Add header and paragraph into to section
    aSection.appendChild(headerCard);
    aSection.appendChild(labelCard);
    aSection.appendChild(dataCard);

    //Add section to page
    container.appendChild(aSection);
}

//show another itemsets 
function upItemsets(x){
    slideItemIndex+=x;
    showItemset(slideItemIndex);
}

function showItemset(n){
    var i;
    var x = document.getElementsByClassName("itemsCard");
    if (n > x.length) {slideItemIndex = 1}
    if (n < 1) {slideItemIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    x[slideItemIndex-1].style.display = "block"; 
}

//show another rules

function upRules(x){
    slideRulesIndex+=x;
    showRules(slideRulesIndex);
}

function showRules(n){
    var i;
    var x = document.getElementsByClassName("ruleCard");
    if (n > x.length) {slideItemIndex = 1}
    if (n < 1) {slideItemIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    x[slideItemIndex-1].style.display = "block"; 
}