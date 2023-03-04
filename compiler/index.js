var codeEditor = document.getElementById('codeEditor');
var lineCounter = document.getElementById('lineCounter');
var coderes = document.getElementById('codeout');
var url = 'https://codequotient.com/api/executeCode';
// var urlr = "https://codequotient.com/api/codeResult/"
var lang = document.getElementById("lang");
var request = new XMLHttpRequest();
var compile = document.getElementById("compile");
var code = document.getElementById("codeEditor");
var lineCountCache = 0,sendRequest,resRequest,output,result;
codeEditor.addEventListener('scroll', () => {
    lineCounter.scrollTop = codeEditor.scrollTop;
    lineCounter.scrollLeft = codeEditor.scrollLeft;
});

function line_counter() {
      var lineCount = codeEditor.value.split('\n').length;
      var outarr = new Array();
      if (lineCountCache != lineCount) {
         for (var x = 0; x < lineCount; x++) {
            outarr[x] = (x + 1);
         }
         lineCounter.value = outarr.join('\n');
      }
      lineCountCache = lineCount;
}
codeEditor.addEventListener('input', () => {
    line_counter();
});
compile.addEventListener('click',()=>{
    // console.log("1");
    request.open('POST',url);
    sendRequest = { "code" : code.value , "langId" : lang.value};
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(sendRequest));
    
    request.addEventListener('load',()=>{
       resRequest = request.responseText;
        // console.log(typeof(resRequest)); 
        output = JSON.parse(resRequest);
        // console.log(output.codeId); 
        // urlr = urlr+`${output.codeId}`;
      
       getres(output.codeId);
    })
})
function display(d){
    if(d.errors!=""){
        coderes.value = d.errors;
    }
    else{
        coderes.value = d.output;
    }
}

function getres(id){
    // console.log(id)
    let res=new XMLHttpRequest();
    res.open('GET','https://codequotient.com/api/codeResult/'+id);
    res.send();
    res.addEventListener('load',()=>{
        result = JSON.parse(res.responseText);
        // console.log(result);
        var d = JSON.parse(result.data);
        // console.log(d);
        if(d.status=="Pending"){
            setTimeout(function(){getres(id);},1000)
        }
        else{
            display(d);
            // console.log(d);
        }
    })
}