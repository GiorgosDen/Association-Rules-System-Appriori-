window.onload = function(){

    let paragraph = document.getElementById("p");
    let datas = sessionStorage.getItem("itemsets");
    let levels = sessionStorage.getItem("kLevels");
    let datas2 = JSON.parse(datas);
    for(i=0; i<levels; i++){
        paragraph.innerHTML += datas2[i]+"\n";
    }
}