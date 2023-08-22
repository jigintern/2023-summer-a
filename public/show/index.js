// window.onload = load;

document.getElementById("load").onclick = load;

async function load(){
    const response = await fetch('/tasks');
    const json = await response.json();

    let table="<table>";
    table+="<thead><tr><th>ID</th><th>USER</th><th>COMPLETED</th></tr></thead>"
    table+="<tbody>";
    for(let i=0; i<json.length; ++i){
        table+="<tr>";
        table+="<td>"+json[i].id+"</td>"+
        "<td>"+json[i].user+"</td>"+
        "<td>"+json[i].completed+"%"+"<progress max=\"100\" value="+json[i].completed+"></progress></td>";
        table+="</tr>";
    }
    table+="</tbody>"
    table+="</table>";
    document.getElementById("contents").innerHTML=table;
}