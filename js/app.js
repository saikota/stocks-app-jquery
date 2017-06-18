$( document ).ready(function() {
    var stockArr=[];


    var source   = $("#result-template").html();
    var template = Handlebars.compile(source);
    $( "#datepicker" ).datepicker({dateFormat:'dd/mm/yy'});

    // if (typeof(Storage) !== "undefined") {
    //     // Code for localStorage/sessionStorage.
    //     if(typeof sessionStorage.stockArrHold !="undefined"){
    //        stockArr= sessionStorage.stockArrHold;
    //     };
    // }

    function processData(fetchStockArr){

        for(var i=0;i<stockArr.length;i++){
            fetchStockArr[i]["qty"]=stockArr[i].stockQty;
            fetchStockArr[i]["price"]=stockArr[i].stockPrice;
            fetchStockArr[i]["total"]=stockArr[i].total;
            fetchStockArr[i]["time"]=stockArr[i].stockTime;
            fetchStockArr[i]["currentPrice"]=fetchStockArr[i]["l"];
            fetchStockArr[i]["newPrice"]=fetchStockArr[i]["l"]*stockArr[i].stockQty;
            if(fetchStockArr[i]["newPrice"]>(fetchStockArr[i]["price"]*stockArr[i].stockQty)){
                fetchStockArr[i]["cssStyle"]="stock-up";
            }else{
                fetchStockArr[i]["cssStyle"]="stock-down";
            }
        }
        return fetchStockArr;
    }

   $("#portfolio").submit(function( evt ) {

       evt.preventDefault();
       var newUrl="https://finance.google.com/finance/info?q=";
       var tmpStr="";

       var tmpObj={};
       tmpObj.stockName=$("#symbol").val();
       tmpObj.stockPrice=$("#price").val();
       tmpObj.stockQty=$("#qty").val();
       tmpObj.stockTime=$("#datepicker").datepicker("getDate");
       tmpObj.total=tmpObj.stockPrice*tmpObj.stockQty;

       for(var k=0;k<stockArr.length;k++){
           tmpStr+="NASDAQ:"+stockArr[k].stockName+',';
       }
       tmpStr+="NASDAQ:"+tmpObj.stockName;
       var url = newUrl+tmpStr;
       //"http://finance.google.com/finance/info?q=NASDAQ:AAPL";




       stockArr.push(tmpObj);


       $.getJSON({
           type: "GET",
           url: url,
           dataType:'text',
           success: function(data)
           {
               var responseData=(decodeURIComponent(data));
               var stockArr=JSON.parse(responseData.substring(3));
               $('#results').empty();
              var resultStockArr= processData(stockArr);

               $('#results').append(template({'stocks':resultStockArr}));

               // if (typeof(Storage) !== "undefined") {
               //     // Code for localStorage/sessionStorage.
               //     sessionStorage.stockArrHold = stockArr;
               // }
           }
       });

   })
    Handlebars.registerHelper('formatTime',function(date,format){
        var mmt=moment(date);
        return mmt.format(format);
    })
});