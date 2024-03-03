var productsImportedLists=[];//List with imported user texts
var importedListNumber=0;//Number of imported lists
var productsList=[];//Final list with products (without duplicates)
var importedProductsNumber=0;//Number of products (non duplicates)


window.onload = function (){ 
    //load counters
    count = document.getElementById("listCountNumber");
    count.innerHTML = importedListNumber.toString();
    count = document.getElementById("fProductsNumber");
    count.innerHTML = importedProductsNumber.toString();
}

function addNewList(){
    var listTextArea = document.getElementById("importedListArea");
    var listText = listTextArea.value.trim();
    if(listText==""){
        console.log("empty text");
    }else{
        productsImportedLists.push(listText);
        importedListNumber+=1;
        //update lists counter
        count = document.getElementById("listCountNumber");
        count.innerHTML = importedListNumber.toString();
        //Save products
        splitLastTextToProducts();
        //print new list products
        printProducts();
    }
    //Clear text area
    listTextArea.value="";
}

//Split list text into to products 
//To take the text from count list, we read the productsImportedLists[count-1]
function splitLastTextToProducts(){
    let i = importedListNumber-1;//pointer to last list their user adds
    //Split text to products and add to the main products list
    let suportList = productsImportedLists[i].toString().split(',');
    for(j=0; j<suportList.length; j++){
        productsList.push(suportList[j].toString().toLowerCase().replace('\n',''));
    }
    //remove duplicates
    productsList= productsList.filter((item,index) => productsList.indexOf(item) === index);
    //Update products total number and print to page
    const count = document.getElementById("fProductsNumber");
    count.innerHTML = productsList.length;
}

//Prints the new products list to page (righ textArea)
function printProducts(){
    const productsArea = document.getElementById("printListArea");
    //set text = ""
    productsArea.value="";
    //remove spaces 
    replaceFSpaces();
    //Add the products
    for(i=0; i<productsList.length; i++){
        productsArea.value+=productsList[i].toString()+"\n";
    }
}

//replace the first ' ' from any product
function replaceFSpaces(){
    //for any product
    for(i=0; i<productsList.length; i++){
        //remove spaces from start
        productsList[i] = productsList[i].toString().trimStart();
    }
}

//move to next page + transpot products and lists to next page
function moveToNextPage(){
    //Trasnport data
    sessionStorage.setItem('products',productsList);
    setTerminationCharacter();
    sessionStorage.setItem('lists',productsImportedLists);
    sessionStorage.setItem('numberLists',parseInt(document.getElementById("listCountNumber").textContent));
    //move to page
    location.href="ApplyAlg/applyAlg.html";
}

//set a termination character for lists (in our cases is . )
//Exp: We transport the lists data with the "sessionStorage". 
//The problem with that is on lists they pass to another page, are split with ',' character. 
//This character is used as product splitter, so with this function we add a dot (.) 
//to the end of any list. Now to next page we take the lists by split based on dots.
function setTerminationCharacter(){
    for(i=0; i<productsImportedLists.length; i++){
        productsImportedLists[i] = productsImportedLists[i]+".";
    }
}