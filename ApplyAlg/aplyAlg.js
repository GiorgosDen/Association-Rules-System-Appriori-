var products = [];//products from previous page
var lists = [];//Array with strings
var numberOfLists=0;
var minconf=0;//minimum confindence
var minsup=0;//minimum support
var K_itemsets= new Array();//row 0: 1-gramms,row1: 2-gramms....row k-1: k-gramms
var K_itemsetsScore = new Array();//Keeps support of any itemset
var AssociationsRules = new Array();//AssociationRules = {X , Y}
var AssociationRulesScore = new Array();//Keeps conf for any rule
var kLevelIndex =0;
window.onload = function (){
    products = sessionStorage.getItem('products').split(',');
    lists = sessionStorage.getItem('lists').split('.');
    numberOfLists = sessionStorage.getItem('numberLists');
    printProductsList();
}

//Print into to textarea the products from previous page
function printProductsList(){
    let printArea = document.getElementById("printProducts");
    for(i=0; i<products.length; i++){
        printArea.value+=(i+1)+": "+products[i]+"\n";
    }
}

//Check the values of minsup and minconf
//Runs algorithm
//Print results to next page 
function runAlgorithm(){
    //check values
    if(checkMinSupCon()){
        Apriori();
    }
}

//Update minsup and mincon
//Check if have a valid value (>0)
function checkMinSupCon(){
    minsup = document.getElementById("minsup").value;
    minconf = document.getElementById("mincon").value;

    //unvalid values
    if(minconf<=0 || minconf=='' || minsup<=0 || minsup==''){
        return false;
    }
    return true;
}


//Apriori Algorithm 
function Apriori(){
    //1-itemsets & 2-itemsets are standars steps 
    load1Itemsets();
    deleteNonSupportK_itemsets(0);
    console.log(K_itemsets[0].length+"=>1-itemsets: "+typeof(K_itemsets[0]));
    for( k=0; k<K_itemsets[0].length; k++){
        console.log(k+": 1-itemsets: "+K_itemsets[0][k]+" "+typeof(K_itemsets[0][k]));
    }
    load2Itemsets();
    deleteNonSupportK_itemsets(1);
    console.log(K_itemsets[0].length+"=>2-itemsets: "+typeof(K_itemsets[1]));
    for( k=0; k<K_itemsets[1].length; k++){
        console.log(k+": 2-itemsets: "+K_itemsets[1][k]+" "+typeof(K_itemsets[1][k]));
    }
    //if we have relevant 2-itemsets then calculate 2+-itemsets
    //until not found relevant k-itemsets
    kLevelIndex = 2;
    if(K_itemsets[1].length>0){
        do{
            load3plusItemsets(kLevelIndex);//k-1 as parametre (zero-index)
            deleteNonSupportK_itemsets(kLevelIndex);
            //Print k-itemsets
            if(K_itemsets[kLevelIndex].length>0){
                console.log(K_itemsets[0].length+"=>"+(kLevelIndex+1)+"-itemsets: "+typeof(K_itemsets[kLevelIndex]));
                for( k=0; k<K_itemsets[kLevelIndex].length; k++){
                    console.log(k+": "+(kLevelIndex+1)+"-itemsets: "+K_itemsets[kLevelIndex][k]+" "+typeof(K_itemsets[kLevelIndex][k]));
                }
            }
            kLevelIndex++;
            //while k-1 itemsets is more thn 0
        }while(K_itemsets[kLevelIndex-1].length>0);
    }
    //When Appriori ends (have all relevants itemsets)
    //Rules Function
    findAssociationRules();
    //pass itemsets to another page
    let jsonItems = JSON.stringify(K_itemsets);
    let jsonItemsScores = JSON.stringify(K_itemsetsScore);
    sessionStorage.setItem("itemsets",jsonItems);
    sessionStorage.setItem("kLevels",kLevelIndex-1);
    sessionStorage.setItem("itemsetsScores",jsonItemsScores);
    sessionStorage.setItem("rules",AssociationsRules);
    sessionStorage.setItem("rulesScores",AssociationRulesScore);
    location.href="../PrintResults/printResults.html";
}

//Add all products to 1st list of K_itemsets[[]]
function load1Itemsets(){
    K_itemsets[0]= new Array();
    for(i=0; i<products.length; i++){
        //1-itemsets , so every element of 1st row, has 1 product (list lenght = 1)
        K_itemsets[0][i]=products[i];
        //console.log("1-itemsetsq "+K_itemsets[0][i]);
    }
}

//load 2-gramms function
function load2Itemsets(){
    K_itemsets[1] = new Array();
    inputList = K_itemsets[0];//1-itemsets
    let k=0;
    //for any 1-itemset x
    for(i=0; i<inputList.length-1; i++){
        //for any itemset y, after to x
        for(j=i+1; j<inputList.length; j++){
            //Create and save the new 2-itemsets
            let outputList = inputList[i]+","+inputList[j];
            //console.log("2-itemsetsq: "+inputList[i]+","+inputList[j]);
            //Add all 2-itemsets into to Kitemsets
            outputList = outputList.split(",").sort().toString();
            K_itemsets[1][k]=outputList;
            k++;
        }
    }
   // console.log("1st 2-itemsets number: "+K_itemsets[1].length);
}

//create k-itemsets where k>2
//indexK, the k value
//Method F(k-1)xF1:
//Create k-itemsets from 1-itemsets & (k-1)-itemsets unions
//It's not necessary the support control, because we keep only the relevant k-1itemsets
function load3plusItemsets(indexK){
    
    K_itemsets[indexK] = new Array();
    let currIndex = 0; //Index for k-itemsets
    let Kunder1Index = parseInt(indexK)-1;
    //console.log(Kunder1Index+" type: "+typeof(Kunder1Index));
    //for any 1-itemset
    for(let i=0; i<K_itemsets[0].length; i++){
        //for any k-1 itemset
        for(let j=0; j<K_itemsets[Kunder1Index].length; j++){
            //if k-1 itemset not includes the 1-itemset
            if(!K_itemsets[Kunder1Index][j].includes(K_itemsets[0][i])){
                //Save as k-itemset the union of current 1-itemset and current k-1 itemset
                let compineSet = new Set([...K_itemsets[0][i].split(","),...K_itemsets[Kunder1Index][j].split(",")]);
                if(!K_itemsets[indexK].includes(Array.from(compineSet).sort().toString())){
                    K_itemsets[indexK][currIndex] = Array.from(compineSet).sort().toString();
                    currIndex++;
                }
            }
        }
    }
}

//delete k-itemsets with support<minsup
function deleteNonSupportK_itemsets(kLevel){
    
    let scores = new Array();
    //The first number of (kLevel+1)-itemsets number
    //kLevel: for k-itemsets kLevel== k-1
    let i=0;
    //console.log("lists number "+numberOfLists);
    //console.log("support "+getSupport(K_itemsets[kLevel][i]));
    //console.log("minsup "+minsup/100);
    while(i<K_itemsets[kLevel].length){
        //For k>=2 itemsets
        //Calculate support as the lenght of union list, thats containes all 1-itemsets
        //1. Split the k-itemsets on 1-itemsets
        //2. For any 1-itemsets get the lists that contains it 
        //3. Caclulate the union of the lists
        //4. The lenght of union list by divide "numberOfList" iis the support
        splitGramm = K_itemsets[kLevel][i].split(",");
        sectionList = new Array();
        sectionList=getSupport(splitGramm[0]); //set 1st 1-itemsets as the union, to start
        //console.log("section type: "+typeof(sectionList));
        //for i=1: if K_itemsets[kLevel][i] is 1-itemsets skips the for loop 
        for(j=1; j<splitGramm.length; j++){
            curList = new Array();
            //section: sectionList and support list of the current 1-itemsets 
            curList = getSupport(splitGramm[j]);
            sectionList =sectionList.filter(element => curList.includes(element));
            //console.log(K_itemsets[kLevel][i]+" union "+sectionList+" && "+curList);
        }
        //support of k-gramm: list it appears/ all lists
        //if kitemset support < minsup, then remove it
        //if delete a element i keeps the same
        let supp = (sectionList.length/numberOfLists);
        if((sectionList.length/numberOfLists)<(minsup/100)){
            K_itemsets[kLevel].splice(i,1);
        }else{
            scores.push(supp);
            i++;
        }

    }
    //! Save support from relevant itemsets
    //pass scores to main array (K_itemsetsScore)
    K_itemsetsScore.push(scores);
}


function findAssociationRules(){
    //Association rule X->Y, X&Y is itemsets
    //Step 1: Find all subsets
    //Step 2: Find all the subset combinations
    //Step 3: Select the rules with confindence >=minconf

    for(i=0; i<kLevelIndex; i++){
        for(j=0; j<K_itemsets[i].length; j++){
            //Step 1.
            let subsets = Array.from(findSubSets(K_itemsets[i][j].split(",")));
            console.log(K_itemsets[i].length+" " + i +","+j+" "+K_itemsets[i][j]);}}
    console.log("=======================");
    //for any itemset
    for(let i=0; i<kLevelIndex; i++){
        for(let j=0; j<K_itemsets[i].length; j++){
            //Step 1.
            
            let subsets = Array.from(findSubSets(K_itemsets[i][j].split(",")));
            console.log(K_itemsets[i].length + " " + i + "," + j + " " + K_itemsets[i][j]);

        // remove 1st subset ([])
        // remove last subset (all itemset)
        let modifiedSubsets = subsets.slice(1, subsets.length - 1);
        

            //step 2.
            for(let k=0; k< modifiedSubsets.length; k++){
                //split k subset and get their support
                let sub1 =  modifiedSubsets[k]; 
                sub1Support = new Array();
                sub1Support = getSupport(sub1[0]);
                for(let a=1; a<sub1.length; a++){
                    sub1Support = sub1Support.filter(element => getSupport(sub1[a]).includes(element));
                }
                //console.log("Find support from "+sub1[0]+" "+sub1Support.length+" as "+sub1Support);
                for(let l=0; l<subsets.length; l++){
                    let unionL = Array.from(subsets[k].filter(element => subsets[l].includes(element))).length;
                    if(k!=l && unionL==0 && subsets[k]!=""){
                        //split l subset and get their support
                        let sub2 = subsets[l];
                        sub2Support = new Array();
                        sub2Support = getSupport(sub2[0]);
                        for(let a=1; a<sub2.length; a++){
                            sub2Support = sub2Support.filter(element => getSupport(sub2[a]).includes(element));
                        }

                        //Step 3. sectionList =sectionList.filter(element => curList.includes(element));
                        //get section support (list with sub1 & sub2)
                        sectionSupport = new Array();
                        sectionSupport = sub1Support.filter(element => sub2Support.includes(element));
                        if((sectionSupport.length/sub1Support.length)>=minconf){
                            //then add the new rule 
                            AssociationsRules.push(subsets[k].toString()+"=>"+subsets[l].toString());
                            //Keep conf of the new rule
                            AssociationRulesScore.push((sectionSupport.length/sub1Support.length));
                        }
                    }

                }
            }

        }
    
    }
    console.log("The Association Rules:");
    for(i=0; i<AssociationsRules.length; i++){
        console.log(i+1+" Rule: "+AssociationsRules[i]+" conf: "+AssociationRulesScore[i]);
    }
}

//Find all subsets from array
function findSubSets(aArray){
    
    let subsets = [[]];

    for (let el of aArray) {
        const last = subsets.length-1;
        for (let n = 0; n <= last; n++) {
            subsets.push( [...subsets[n], el] );
        }
    }
    
    return subsets;
}


//get support of k-itemset/1-itemset (the indexes of lists, their contains the kgramm)
function getSupport(kgramm){
    supp = new Array();
    for(i=0; i<lists.length; i++){
        //if find the k-itemset to i list, supp++
        if(lists[i].split(',').some(function(w){return w === kgramm})){
            supp.push(i);
        }
    }
    return supp;
}
