for (let year = 2010; year <= 2023; year++) {
  let rows = [];
  let page = 1;
  while (true) {
    const req = await fetch("https://ucannualwage.ucop.edu/wage/search.do", {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": '"Not;A=Brand";v="24", "Chromium";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      "referrer": "https://ucannualwage.ucop.edu/wage/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body":
        `_search=false&nd=1725742357272&rows=10000&page=${page}&sidx=EAW_LST_NAM&sord=asc&year=${year}&location=ALL&firstname=&lastname=&title=&startSal=&endSal=`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include",
    });
    const data = await req.json();
    rows = [...rows, ...data.rows];
    console.log(year, page, rows.length, data.records);
    if (rows.length === data.records) {
      break;
    }
    page++;
  }
  Deno.writeTextFile(`${year}.json`, JSON.stringify(rows));
}
