let audio = null;
const player = new Plyr("#player");

// Parse cookie string to object
const parseCookie = (str) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

// Read saved cookie from previous session if exists
document.addEventListener("DOMContentLoaded", () => {
  const cookies = parseCookie(document.cookie);
  if (cookies.hasOwnProperty("text")) {
    let text = document.getElementById("text");
    text.value = cookies.text;
    M.updateTextFields();
  }
});

document.getElementById("daniel").addEventListener("click", async () => {
  const text = document.getElementById("text").value;
  let loading = document.getElementById("circlebox");

  if (text) {
    // Save text to cookie
    document.cookie = "text=" + text + ";max-age=31536000;samesite=strict";

    // Show loading
    loading.style.display = "block";

    // Send POST request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Decode audio data and create player
        let json = JSON.parse(xhr.responseText);
        audio = new Blob([new Uint8Array(json.audioContent.data)]);
        let blobURL = URL.createObjectURL(audio);
        let audioPlayer = document.getElementById("player");
        audioPlayer.src = blobURL;

        // Enable download button
        let downloadButton = document.getElementById("download");
        downloadButton.classList.remove("disabled");

        // Hide loading
        loading.style.display = "none";
      }
    };

    xhr.send(JSON.stringify({ text }));
  }
});

document.getElementById("download").addEventListener("click", async () => {
  // Download audio file if exists
  let filename = "daniel.wav";
  if (audio) {
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(audio, filename);
    else {
      // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(audio);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
});
