const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "UTF-8");

const replaceVal = (tempval, orgval) => {
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%countrys%}", orgval.sys.country);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
            "https://api.openweathermap.org/data/2.5/weather?lat=33.44&lon=-94.04&appid=1c5072fc5cef66d2f74c3c7e3ca45571&units=metric"//&units=metric is used to get the temprature in celsius
        )
        .on("data", function(chunk) {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join(""); // array to string
           
            res.write(realTimeData);
            res.end();
        })
        .on("end", function(err) {
            if (err) 
                console.log("Connection closed due to errors", err);
               
        })
        .on("error", function(err) {
            console.error("Request error", err);
            
        });
    } else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("Not Found");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Server is running at http://127.0.0.1:8000/");
});
