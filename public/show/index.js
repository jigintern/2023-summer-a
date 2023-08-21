// window.onload = async () => {
//     const response = await fetch('/tasks', {
//         method: "GET"
//     });
//   }

const response=
[
    {
        "id": 0,
        "user": "shuya",
        "completed": 80
    },
    {
        "id": 1,
        "user": "ooi",
        "completed": 95
    },
    {
        "id": 2,
        "user": "alice",
        "completed": 65
    },
    {
        "id": 3,
        "user": "bob",
        "completed": 45
    },
    {
        "id": 4,
        "user": "charlie",
        "completed": 70
    },
    {
        "id": 5,
        "user": "david",
        "completed": 20
    },
    {
        "id": 6,
        "user": "emily",
        "completed": 50
    },
    {
        "id": 7,
        "user": "frank",
        "completed": 90
    },
    {
        "id": 8,
        "user": "grace",
        "completed": 75
    },
    {
        "id": 9,
        "user": "harry",
        "completed": 40
    },
    {
        "id": 10,
        "user": "isabel",
        "completed": 60
    },
    {
        "id": 11,
        "user": "jack",
        "completed": 85
    },
    {
        "id": 12,
        "user": "kate",
        "completed": 55
    },
    {
        "id": 13,
        "user": "liam",
        "completed": 30
    },
    {
        "id": 14,
        "user": "mia",
        "completed": 25
    },
    {
        "id": 15,
        "user": "noah",
        "completed": 90
    }
]

document.getElementById("load").onclick = async () => {
    let table="<table border=1>";
    table+="<thead><tr><th>ID</th><th>USER</th><th>COMPLETED</th></tr></thead>"
    table+="<tbody>";
    for(let i=0; i<response.length; ++i){
        table+="<tr>";
        table+="<td>"+response[i].id+"</td>"+
        "<td>"+response[i].user+"</td>"+
        "<td>"+response[i].completed+"</td>";
        table+="</tr>";
    }
    table+="</tbody>"
    table+="</table>";
    document.getElementById("contents").innerHTML=table;
}