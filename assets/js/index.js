let api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
let loader = document.querySelector(".scoreSectionLoader");
let resultSection = document.querySelector(".resultSection");

const setQuery = async () => {
  
  const inputUrl = document.querySelector("#url").value;
  let isValidURL = (str) => {
    let res = str.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  };
  if (isValidURL(inputUrl)) {
    document.getElementById('errorname').style.display="none"
    mobileTest(inputUrl)
    safeTest(inputUrl)
    loader.style.display = "block";
    resultSection.style.display="none"
    const finalUrl =
      api +
      "?url=" +
      inputUrl +
      "&key=AIzaSyDt013rDXJ0OgUruJGYPMvCG0iqVhabTRk&strategy=desktop&category=seo&category=accessibility&category=best_practices&category=performance";
    try {
      const response = await fetch(finalUrl);
      const data = await response.json();
      console.log("DATA", data);
      showResult(data);
    } catch (error) {
      console.log(error);
    } finally {
      loader.style.display = "none";
      resultSection.style.display="block"
    }
  } else {
    document.getElementById('errorname').style.display="block";
    resultSection.style.display="none"
  }
};

const showResult = (data) => {
  /* Score Card Begins Here */
  let scoreResult = data.lighthouseResult.categories;
  let scoreResultArr = Object.keys(scoreResult).map((key) => [
    scoreResult[key],
  ]);
  document.querySelector(".scoreSectionBox ul").innerHTML = "";
  scoreResultArr.forEach((item) => {
    if (item[0].score * 100 >= 90 && item[0].score * 100 <= 100) {
      showGreenScore(item[0]);
    }
    if (item[0].score * 100 >= 50 && item[0].score * 100 <= 89) {
      showOrangeScore(item[0]);
    }
    if (item[0].score * 100 >= 0 && item[0].score * 100 <= 49) {
      showRedScore(item[0]);
    }
  });
  /* Score Card Ends Here */
  let webVitalsData=data.lighthouseResult.audits
  let webVitalsDataArr=Object.keys(webVitalsData).map((key)=>[webVitalsData[key]])
  let fliterWebVitals=webVitalsDataArr.filter((item)=>{
    return item[0].id==="interactive"|| item[0].id=== "first-contentful-paint" || item[0].id==="largest-contentful-paint" || item[0].id==="speed-index" || item[0].id==="total-blocking-time" || item[0].id==="cumulative-layout-shift";
  })
  showWebVitals(fliterWebVitals)
  ShowThumbnails(webVitalsDataArr)
  technologyUsed(data)
}; 

const showGreenScore = (item) => {
  
  let htmlDiv = ``;
  htmlDiv = `<li>
  <span>${item.title}</span>
  <svg class="scoreSvg" viewport="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle r="53" cx="60" cy="60"></circle>
      <circle transform="rotate(-90 60 60)" class="glh_score_pBar" r="53" cx="60" cy="60" style="stroke-dashoffset: 19 !important; stroke: #18B663 !important"></circle>
      <text x="60" y="55%">${Math.trunc(item.score * 100)}</text>
  </svg>
</li>`;
  document.querySelector(".scoreSectionBox ul").innerHTML += htmlDiv;
};
const showOrangeScore = (item) => {
  
  let htmlDiv = ``;
  htmlDiv = `<li>
  <span>${item.title}</span>
  <svg class="scoreSvg" viewport="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle r="53" cx="60" cy="60"></circle>
      <circle transform="rotate(-90 60 60)" class="glh_score_pBar" r="53" cx="60" cy="60" style="stroke-dashoffset: 23 !important; stroke:#FB8C00  !important"></circle>
      <text x="60" y="55%">${Math.trunc(item.score * 100)}</text>
  </svg>
</li>`;
  document.querySelector(".scoreSectionBox ul").innerHTML += htmlDiv;
};
const showRedScore = (item) => {
  
  let htmlDiv = ``;
  htmlDiv = `<li>
  <span>${item.title}</span>
  <svg class="scoreSvg" viewport="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle r="53" cx="60" cy="60"></circle>
      <circle transform="rotate(-90 60 60)" class="glh_score_pBar" r="53" cx="60" cy="60" style="stroke-dashoffset: 26 !important; stroke: #E53935 !important"></circle>
      <text x="60" y="55%">${Math.trunc(item.score * 100)}</text>
  </svg>
</li>`;
  document.querySelector(".scoreSectionBox ul").innerHTML += htmlDiv;
};

const showWebVitals=(items)=>{
  document.querySelector(".resultStatsBox ul").innerHTML=""
  let htmlDiv=``
  items.map((item)=>{
    
    htmlDiv=`<li class="webVital">${item[0].title}<b style="color: #18b663;">${item[0].displayValue}</b></li>`
    document.querySelector(".resultStatsBox ul").innerHTML+=htmlDiv;
  })
 
  
}

const ShowThumbnails=(data)=>{
  let findData=data.find((res)=>{
    return res[0].id==="screenshot-thumbnails"
  })
  document.querySelector(".resultSnapsBox ul").innerHTML=""
  let htmlDiv=``
  findData[0].details.items.map((item)=>{
    htmlDiv=`<li><img src="${item.data}" ></li>`
    document.querySelector(".resultSnapsBox ul").innerHTML+=htmlDiv;
  })
}

const technologyUsed=(data)=>{
 let dataArr=data.lighthouseResult.stackPacks;
 if(data.lighthouseResult.stackPacks){
 document.querySelector(".resultAppUsing").innerHTML=""
 document.querySelector(".resultAppUsing").style.display = 'block'
 let htmlDiv=``
 htmlDiv=`
<div class="resultAppUsingTxtBox"><h3>This Website is using <span class="appUsingNme">${dataArr[0].title}</span></h3>
</div>`
document.querySelector(".resultAppUsing").innerHTML+=htmlDiv;
/* App Suggestions section Begins */
document.querySelector("#accordion").innerHTML=""
document.querySelector(".resultAppSuggestionSec").style.display = 'block'
let htmlDivTwo=``
 let appUsingResult=dataArr[0].descriptions
let appUsingResultArr = Object.entries(appUsingResult)
appUsingResultArr.map((item)=>{
  let result=formatContent(item[1])
  
  // console.log("HAMZa",item)
   htmlDivTwo=`<div class="card appSuggestionWrap">
   <div class="card-header" id="heading${item[0]}">
     <h5 class="mb-0">
       <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#${item[0]}" aria-expanded="false" aria-controls="${item[0]}">
        ${item[0]}
       </button>
     </h5>
   </div>
   <div id="${item[0]}" class="collapse" aria-labelledby="heading${item[0]}" data-parent="#accordion">
     <div class="card-body" style="color:black;">
      ${result}
     </div>
   </div>
 </div>`
 document.querySelector("#accordion").innerHTML+=htmlDivTwo;
//  document.querySelector(".resultAppSuggestionWrap").innerHTML+=htmlDivTwo;
})
}
else{
  document.querySelector(".resultAppUsing").style.display = 'none'
  document.querySelector(".resultAppSuggestionSec").style.display = 'none'
}
/* App Suggestions section Ends */
}
function formatContent(element) {
  let finalText = (element);
  let learnMoreLink;
  let learnMoreLinkText;
  // wrap html tags given in content in code tag
  let tags = (finalText).slice((finalText).indexOf('<') + 1, (finalText).indexOf('>'));
  finalText = (finalText).replace(/(<([^>]+)>)/gi, "<code>" + tags + "</code>");
  // check for links and their content and create a proper <a> tag with href (check for upto 10 links)
  for (let i = 0; i < 10; i++) {
      learnMoreLink = (finalText).slice((finalText).indexOf('(') + 1, (finalText).indexOf(')'));
      learnMoreLinkText = (finalText).slice((finalText).indexOf('[') + 1, (finalText).indexOf(']'));
      finalText = (finalText).replace('[' + learnMoreLinkText + ']', '<a href="' + learnMoreLink + '">' + learnMoreLinkText + '</a> ');
  }
  finalText = (finalText).replace(/ *\([^)]*\) */g, " ");
  return finalText;
}

/* Safe Browser API Starts Here */
const safeTest= async (inputUrl)=>{
  let setData = {
    "client": {
        "clientId": inputUrl,
        "clientVersion": "1.5.2"
    },
    "threatInfo": {
        "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
        "platformTypes": ["WINDOWS"],
        "threatEntryTypes": ["URL"],
        "threatEntries": [
            { "url": inputUrl }
        ]
    }
}
try {

  const response = await fetch('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyB21KvAMNVrbYpniSO_zoDrMCrsmcUh1y0', {
      method: "POST",
      body: JSON.stringify(setData),
      headers: {"Content-type": "application/json; charset=UTF-8" }
  });
  console.log("response Status",response.status)
  const data = await response.json();
  showSafeTest(response.status)
}
catch (error) {
  console.log(error);
}
}
const showSafeTest=(code)=>{
  if(code===200){
    let title="No unsafe content found"
    let description="This page is safe for browsing."
    document.querySelector(".safeBrowserBox").innerHTML=""
    let htmlDiv=``
    htmlDiv=`<div class="safeBrowserTxtBox" style="border-top-color: #18b663 !important;">
    <h3>${title}</h3>
    <p>${description}</p>
</div>`
   document.querySelector(".safeBrowserBox").innerHTML=htmlDiv;
    let titleHttp="HTTPS Encryption found."
    let descriptionHttp="The connection of this website is secure."
    document.querySelector(".safeHttpBox").innerHTML=""
    let htmlDivTwo=``
    htmlDivTwo=`<div class="safeHttpTxtBox" style="border-top-color: #18b663 !important;">
    <h3>${titleHttp}</h3>
    <p>${descriptionHttp}</p>
</div>`
   document.querySelector(".safeHttpBox").innerHTML=htmlDivTwo;
  }
}
/* Safe Browser API Ends Here */

/* Mobile API TEST STARTS Here */

const mobileTest= async (inputUrl)=>{
     try {
      const response = await fetch("https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run?key=AIzaSyCzvpT1bn0kvgnruIqHKsdd_NLmJhyrofs",
      {
        body:JSON.stringify({url:inputUrl}),
        method:"POST"})
      const data = await response.json();
      console.log("DATAMobile", data);
      showMobileResult(data)
    } catch (error) {
      console.log(error);
    } finally {
      // loader.style.display = "none";
    }
  }

  const showMobileResult=(data)=>{
    if(data.mobileFriendliness==="MOBILE_FRIENDLY"){
       let title="Page is mobile friendly"
       let description="This page is easy to use on a mobile device"
       document.querySelector(".mblCheckMainBox").innerHTML=""
       let htmlDiv=``
       htmlDiv=`<div class="mblCheckTxtBox" style="border-top-color: #18b663 !important;">
       <h3>${title}</h3>
       <p>${description}</p>
   </div>`
      document.querySelector(".mblCheckMainBox").innerHTML=htmlDiv;
    }
    else{
      let title="Page is not mobile friendly"
      let description="This page is not easy to use on a mobile device"
      document.querySelector(".mblCheckMainBox").innerHTML=""
      let htmlDiv=``
      htmlDiv=`<div class="mblCheckTxtBox" style="border-top-color: #18b663 !important;">
      <h3>${title}</h3>
      <p>${description}</p>
  </div>`
     document.querySelector(".mblCheckMainBox").innerHTML=htmlDiv;
    }
    
  }

