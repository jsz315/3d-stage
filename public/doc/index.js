

$(function(){
    $.get("./data.txt", (str)=>{
        var list = str.split("\n");
        list = formatData(list);
        var str = list.join("");
        $(".left").html(str);
        $(".right").html(str);
    })
})

function formatData(list){
    list = list.map(function(item){
        let m = item.match(/^\s*/);
        let aim = item;
        if(m){
            aim = item.replace(/^\s*/, "");
        }
        return `<div class="padding${m[0].length}">${aim}</div>`
    })
    return list;
}